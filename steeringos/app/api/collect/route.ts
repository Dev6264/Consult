import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const eventSchema = z.object({
  type: z.enum(["visit", "view_item", "add_to_cart", "begin_checkout", "purchase"]),
  sessionId: z.string(),
  userId: z.string().nullable().optional(),
  path: z.string(),
  device: z.string().default("unknown"),
  country: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  referrer: z.string().optional()
});

const rateLimiter = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const limit = 120;
  const entry = rateLimiter.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimiter.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  if (!checkRateLimit(apiKey)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const parsed = eventSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  if (!keyRecord || keyRecord.revokedAt) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  await prisma.event.create({
    data: {
      storeId: keyRecord.storeId,
      ...parsed.data
    }
  });

  await prisma.auditLog.create({
    data: {
      storeId: keyRecord.storeId,
      action: "collect",
      entity: "Event",
      metadata: { source: "tracker" }
    }
  });

  return NextResponse.json({ status: "ok" });
}

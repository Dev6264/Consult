import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { enforceStoreId } from "../../../../lib/tenant";

const webhookSchema = z.object({
  url: z.string().url(),
  status: z.string().default("active")
});

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const webhooks = await prisma.webhook.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ webhooks });
}

export async function POST(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const parsed = webhookSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const webhook = await prisma.webhook.create({
    data: {
      storeId,
      ...parsed.data
    }
  });

  await prisma.auditLog.create({
    data: {
      storeId,
      action: "create",
      entity: "Webhook",
      entityId: webhook.id
    }
  });

  return NextResponse.json({ webhook });
}

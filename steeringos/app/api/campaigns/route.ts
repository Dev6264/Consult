import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { enforceStoreId } from "../../../lib/tenant";

const campaignSchema = z.object({
  name: z.string(),
  baseUrl: z.string().url(),
  utmSource: z.string(),
  utmMedium: z.string(),
  utmCampaign: z.string()
});

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const campaigns = await prisma.campaign.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const parsed = campaignSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      storeId,
      ...parsed.data
    }
  });

  await prisma.auditLog.create({
    data: {
      storeId,
      action: "create",
      entity: "Campaign",
      entityId: campaign.id
    }
  });

  return NextResponse.json({ campaign });
}

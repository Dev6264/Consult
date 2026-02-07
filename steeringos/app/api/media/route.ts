import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { enforceStoreId } from "../../../lib/tenant";

const mediaSchema = z.object({
  folder: z.string(),
  filename: z.string(),
  url: z.string().url(),
  uploadedBy: z.string()
});

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const assets = await prisma.mediaAsset.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ assets });
}

export async function POST(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const parsed = mediaSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      storeId,
      ...parsed.data
    }
  });

  await prisma.auditLog.create({
    data: {
      storeId,
      action: "upload",
      entity: "MediaAsset",
      entityId: asset.id
    }
  });

  return NextResponse.json({ asset });
}

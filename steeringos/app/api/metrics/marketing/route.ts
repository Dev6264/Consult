import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { enforceStoreId } from "../../../../lib/tenant";

const uploadSchema = z.object({
  filename: z.string(),
  rows: z.number().int().min(1)
});

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const uploads = await prisma.emailFunnelUpload.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
    take: 1
  });

  return NextResponse.json({
    latestUpload: uploads[0] ?? null,
    note: "Use POST /api/metrics/marketing with filename and rows metadata."
  });
}

export async function POST(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const parsed = uploadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const record = await prisma.emailFunnelUpload.create({
    data: {
      storeId,
      filename: parsed.data.filename,
      rows: parsed.data.rows
    }
  });

  await prisma.auditLog.create({
    data: {
      storeId,
      action: "upload",
      entity: "EmailFunnelUpload",
      entityId: record.id,
      metadata: { filename: record.filename }
    }
  });

  return NextResponse.json({ status: "ok", id: record.id });
}

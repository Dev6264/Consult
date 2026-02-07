import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { enforceStoreId } from "../../../../lib/tenant";

const storeSchema = z.object({
  name: z.string(),
  timezone: z.string()
});

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  return NextResponse.json({ store });
}

export async function PUT(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const parsed = storeSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const store = await prisma.store.update({
    where: { id: storeId },
    data: parsed.data
  });

  await prisma.auditLog.create({
    data: {
      storeId,
      action: "update",
      entity: "Store",
      entityId: store.id
    }
  });

  return NextResponse.json({ store });
}

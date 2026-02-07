import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { enforceStoreId } from "../../../../lib/tenant";

function generateKey() {
  return `sk_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const keys = await prisma.apiKey.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ keys });
}

export async function POST(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const key = await prisma.apiKey.create({
    data: {
      storeId,
      label: "Generated key",
      key: generateKey()
    }
  });

  await prisma.auditLog.create({
    data: {
      storeId,
      action: "create",
      entity: "ApiKey",
      entityId: key.id
    }
  });

  return NextResponse.json({ key });
}

export async function DELETE(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const existing = await prisma.apiKey.findFirst({
    where: { id, storeId }
  });
  if (!existing) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  const key = await prisma.apiKey.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() }
  });

  await prisma.auditLog.create({
    data: {
      storeId,
      action: "revoke",
      entity: "ApiKey",
      entityId: key.id
    }
  });

  return NextResponse.json({ status: "revoked" });
}

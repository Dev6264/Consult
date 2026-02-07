import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { enforceStoreId } from "../../../../lib/tenant";

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const users = await prisma.user.findMany({
    where: { storeId },
    select: { id: true, name: true, email: true, role: true }
  });
  return NextResponse.json({ users });
}

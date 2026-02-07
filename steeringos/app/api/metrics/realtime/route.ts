import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { enforceStoreId } from "../../../../lib/tenant";

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const since = new Date();
  since.setMinutes(since.getMinutes() - 30);

  const events = await prisma.event.findMany({
    where: { storeId, createdAt: { gte: since } },
    select: { type: true, device: true, country: true, utmSource: true, referrer: true, createdAt: true }
  });

  const activeUsers = new Set(events.map((event) => `${event.type}-${event.createdAt.getMinutes()}`)).size;
  const funnelCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.type] = (acc[event.type] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    activeUsers,
    funnelCounts,
    totalEvents: events.length
  });
}

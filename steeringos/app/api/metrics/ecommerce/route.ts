import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { enforceStoreId } from "../../../../lib/tenant";
import { calculateAOV, calculateConversionRate } from "../../../../lib/metrics";

export async function GET(request: NextRequest) {
  const storeId = enforceStoreId(request);
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const startDate = start ? new Date(start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = end ? new Date(end) : new Date();

  const [orders, visitors] = await Promise.all([
    prisma.event.count({
      where: { storeId, type: "purchase", createdAt: { gte: startDate, lte: endDate } }
    }),
    prisma.event.count({
      where: { storeId, type: "visit", createdAt: { gte: startDate, lte: endDate } }
    })
  ]);

  const revenue = orders * 68;

  return NextResponse.json({
    revenue,
    orders,
    visitors,
    conversion: calculateConversionRate(orders, visitors),
    aov: calculateAOV(revenue, orders)
  });
}

export type FunnelStep = {
  step: string;
  count: number;
};

export type EcommerceMetrics = {
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
  aov: number;
};

export function calculateConversionRate(orders: number, visitors: number): number {
  if (visitors === 0) return 0;
  return Number(((orders / visitors) * 100).toFixed(2));
}

export function calculateAOV(revenue: number, orders: number): number {
  if (orders === 0) return 0;
  return Number((revenue / orders).toFixed(2));
}

export function buildEcommerceMetrics(revenue: number, orders: number, visitors: number): EcommerceMetrics {
  return {
    revenue,
    orders,
    visitors,
    conversionRate: calculateConversionRate(orders, visitors),
    aov: calculateAOV(revenue, orders)
  };
}

export function funnelCompletionRate(funnel: FunnelStep[]): number {
  if (funnel.length === 0) return 0;
  const first = funnel[0]?.count ?? 0;
  const last = funnel[funnel.length - 1]?.count ?? 0;
  if (first === 0) return 0;
  return Number(((last / first) * 100).toFixed(2));
}

export function sumSeries(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function buildTrafficShare(source: Record<string, number>) {
  const total = sumSeries(Object.values(source));
  return Object.entries(source).map(([label, value]) => ({
    label,
    value,
    share: total === 0 ? 0 : Number(((value / total) * 100).toFixed(2))
  }));
}

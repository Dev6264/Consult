import { describe, expect, it } from "vitest";
import {
  buildEcommerceMetrics,
  buildTrafficShare,
  calculateAOV,
  calculateConversionRate,
  funnelCompletionRate,
  sumSeries
} from "../lib/metrics";

describe("metrics", () => {
  it("calculates conversion rate", () => {
    expect(calculateConversionRate(12, 300)).toBe(4);
  });

  it("returns 0 conversion rate when no visitors", () => {
    expect(calculateConversionRate(2, 0)).toBe(0);
  });

  it("calculates AOV", () => {
    expect(calculateAOV(1250, 25)).toBe(50);
  });

  it("builds ecommerce metrics", () => {
    expect(buildEcommerceMetrics(1000, 20, 200)).toEqual({
      revenue: 1000,
      orders: 20,
      visitors: 200,
      conversionRate: 10,
      aov: 50
    });
  });

  it("calculates funnel completion", () => {
    expect(
      funnelCompletionRate([
        { step: "visit", count: 400 },
        { step: "purchase", count: 40 }
      ])
    ).toBe(10);
  });

  it("sums series values", () => {
    expect(sumSeries([1, 2, 3, 4])).toBe(10);
  });

  it("builds traffic share", () => {
    expect(buildTrafficShare({ email: 20, social: 30 })).toEqual([
      { label: "email", value: 20, share: 40 },
      { label: "social", value: 30, share: 60 }
    ]);
  });
});

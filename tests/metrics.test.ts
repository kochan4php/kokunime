import { beforeEach, describe, expect, it } from "vitest";
import { getMetrics, incrementMetric, resetMetrics } from "@/lib/metrics";
import { safeCompare } from "@/lib/safe-compare";

describe("metrics registry", () => {
  beforeEach(() => resetMetrics());

  it("counts events and ignores zero/invalid increments", () => {
    incrementMetric("x");
    incrementMetric("x", 2);
    incrementMetric("y", 0);
    incrementMetric("z", Number.NaN);
    expect(getMetrics()).toEqual({ x: 3 });
  });
});

describe("safeCompare", () => {
  it("matches equal strings and rejects different ones", () => {
    expect(safeCompare("token-123", "token-123")).toBe(true);
    expect(safeCompare("token-123", "token-124")).toBe(false);
    expect(safeCompare("token-123", "token-1234")).toBe(false);
    expect(safeCompare("", "")).toBe(true);
  });
});

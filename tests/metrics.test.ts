import { beforeEach, describe, expect, it } from "vitest";
import { getHistograms, getMetrics, incrementMetric, observeHistogram, resetMetrics } from "@/lib/metrics";
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

  it("buckets histogram observations and tracks sum/count", () => {
    observeHistogram("latency", 10); // ≤50
    observeHistogram("latency", 50); // ≤50 (inclusive bound)
    observeHistogram("latency", 60); // ≤100
    observeHistogram("latency", 99_999); // +Inf
    observeHistogram("latency", -1); // ignored
    observeHistogram("latency", Number.NaN); // ignored

    const state = getHistograms().latency;
    expect(state.count).toBe(4);
    expect(state.sum).toBe(10 + 50 + 60 + 99_999);
    expect(state.bucketCounts[0]).toBe(2); // ≤50
    expect(state.bucketCounts[1]).toBe(1); // ≤100
    expect(state.bucketCounts.at(-1)).toBe(1); // +Inf overflow
  });

  it("reset clears histograms too", () => {
    observeHistogram("latency", 10);
    resetMetrics();
    expect(getHistograms()).toEqual({});
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

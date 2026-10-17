import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cachedWithMeta } from "@/services/cache";
import { getMetrics, resetMetrics } from "@/lib/metrics";

describe("cachedWithMeta", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetMetrics();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns miss on first call and a memory hit afterwards", async () => {
    const fn = vi.fn().mockResolvedValue({ n: 1 });
    const first = await cachedWithMeta("k1", 60, fn, null);
    const second = await cachedWithMeta("k1", 60, fn, null);

    expect(first.tier).toBe("miss");
    expect(second.tier).toBe("memory");
    expect(second.value).toEqual({ n: 1 });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("single-flights concurrent misses for the same key", async () => {
    let resolveFn!: (value: string) => void;
    const gate = new Promise<string>((resolve) => {
      resolveFn = resolve;
    });
    const fn = vi.fn(() => gate);

    const p1 = cachedWithMeta("k2", 60, fn, "");
    const p2 = cachedWithMeta("k2", 60, fn, "");
    resolveFn("shared");

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(r1.value).toBe("shared");
    expect(r2.value).toBe("shared");
  });

  it("serves stale data when the upstream fails after the TTL", async () => {
    const good = vi.fn().mockResolvedValue("fresh");
    await cachedWithMeta("k3", 60, good, "fallback");

    await vi.advanceTimersByTimeAsync(61_000); // memory expired, stale grace holds

    const failing = vi.fn().mockRejectedValue(new Error("upstream boom"));
    const result = await cachedWithMeta("k3", 60, failing, "fallback");
    expect(result.tier).toBe("stale");
    expect(result.value).toBe("fresh");
  });

  it("falls back when the upstream fails with no prior value", async () => {
    const failing = vi.fn().mockRejectedValue(new Error("upstream boom"));
    const result = await cachedWithMeta("k4", 60, failing, "fallback");
    expect(result.tier).toBe("fallback");
    expect(result.value).toBe("fallback");
  });

  it("counts cache tiers in metrics", async () => {
    const fn = vi.fn().mockResolvedValue(1);
    await cachedWithMeta("k5", 60, fn, 0);
    await cachedWithMeta("k5", 60, fn, 0);

    const counters = getMetrics();
    expect(counters.cache_miss).toBe(1);
    expect(counters.cache_hit_memory).toBe(1);
  });
});

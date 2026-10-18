// @vitest-environment node
// Chaos drills (in-process): the app must degrade gracefully when Redis is
// missing and while the upstream circuit is open — never throw, never block.
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/redis", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/redis")>();
  return {
    ...actual,
    getRedis: vi.fn(async () => null),
    redisGet: vi.fn(async () => null),
    redisSet: vi.fn(async () => undefined),
    redisRateLimit: vi.fn(async () => null),
    redisHealth: vi.fn(async () => "disabled" as const),
  };
});

const { checkRateLimit, scaleLimit } = await import("@/lib/rate-limit");
const { getCircuitState, recordFailure, recordSuccess } = await import("@/lib/circuit-breaker");
const { UPSTREAM_CIRCUIT_KEY } = await import("@/config/upstream");
const { searchLocalIndex, suggestLocal, getIndexSize } = await import("@/lib/search-index");
const { recordTrendingView, getTrending } = await import("@/lib/trending");

describe("chaos: Redis down", () => {
  it("search index degrades to empty instead of throwing", async () => {
    await expect(searchLocalIndex("naruto")).resolves.toEqual([]);
    await expect(suggestLocal("naruto")).resolves.toEqual([]);
    await expect(getIndexSize()).resolves.toBe(0);
  });

  it("trending is a silent no-op", async () => {
    await expect(recordTrendingView("one-piece")).resolves.toBeUndefined();
    await expect(getTrending()).resolves.toEqual([]);
  });

  it("rate limiter falls back to the in-memory store", async () => {
    const id = `chaos-${Date.now()}`;
    const first = await checkRateLimit(id, 5, 10_000);
    expect(first.success).toBe(true);
    expect(first.remaining).toBe(4);
  });
});

describe("chaos: latency injection", () => {
  it("a hanging upstream aborts via timeout (ETIMEDOUT) instead of hanging forever", async () => {
    const hangingFetch = (_url: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        const signal = init?.signal as AbortSignal | null | undefined;
        const abort = () => {
          const error = new Error("aborted");
          error.name = "TimeoutError"; // mirrors AbortSignal.timeout()
          reject(error);
        };
        if (signal?.aborted) abort();
        else signal?.addEventListener("abort", abort, { once: true });
      });

    vi.stubGlobal("fetch", hangingFetch);
    try {
      const upstream = (await import("@/config/upstream")).default;
      await expect(upstream.get("/anime/some-title", { timeoutMs: 20 })).rejects.toMatchObject({
        code: "ETIMEDOUT",
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("cache eviction storm: thousands of unique keys neither throw nor corrupt windows", async () => {
    vi.useFakeTimers();
    try {
      const id = `storm-${Date.now()}`;
      const first = await checkRateLimit(id, 3, 5_000);
      expect(first.remaining).toBe(2);

      for (let i = 0; i < 500; i++) {
        await checkRateLimit(`${id}-${i}`, 1, 5_000);
      }

      // Window expiry must reset the original key even after the storm.
      await vi.advanceTimersByTimeAsync(6_000);
      const reset = await checkRateLimit(id, 3, 5_000);
      expect(reset.remaining).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("chaos: upstream circuit open", () => {
  beforeEach(() => {
    // Trip the breaker with enough consecutive failures to open it.
    for (let i = 0; i < 10; i++) recordFailure(UPSTREAM_CIRCUIT_KEY);
  });

  it("circuit reports open and rate limits tighten", async () => {
    expect(getCircuitState(UPSTREAM_CIRCUIT_KEY)).toBe("open");

    const id = `chaos-open-${Date.now()}`;
    const scaled = await checkRateLimit(id, 100, 60_000);
    // 100 * 0.25 = 25 under open circuit (never below the floor of 5).
    expect(scaled.limit).toBe(25);

    recordSuccess(UPSTREAM_CIRCUIT_KEY);
    recordSuccess(UPSTREAM_CIRCUIT_KEY);
    recordSuccess(UPSTREAM_CIRCUIT_KEY);
    expect(scaleLimit(100, 1)).toBe(100);
  });

  it("readiness probe tells the truth: 503 degraded while open, 200 ready after recovery", async () => {
    const { GET } = await import("@/app/api/ready/route");

    const degraded = await GET();
    expect(degraded.status).toBe(503);
    expect(await degraded.json()).toMatchObject({ status: "degraded", circuit: "open", shuttingDown: false });

    recordSuccess(UPSTREAM_CIRCUIT_KEY);
    const ready = await GET();
    expect(ready.status).toBe(200);
    expect(await ready.json()).toMatchObject({ status: "ready", circuit: "closed" });
  });
});

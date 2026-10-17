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
});

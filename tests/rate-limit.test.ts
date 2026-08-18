import { describe, expect, it } from "vitest";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

describe("Rate Limiter", () => {
  it("allows requests under the limit", () => {
    const id = `client-${Date.now()}-1`;
    const res1 = checkRateLimit(id, 5, 10_000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(4);

    const res2 = checkRateLimit(id, 5, 10_000);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(3);
  });

  it("blocks requests over the limit and generates correct headers", () => {
    const id = `client-${Date.now()}-2`;
    for (let i = 0; i < 3; i++) {
      checkRateLimit(id, 3, 10_000);
    }
    const blockedRes = checkRateLimit(id, 3, 10_000);
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);

    const headers = getRateLimitHeaders(blockedRes);
    expect(headers["X-RateLimit-Limit"]).toBe("3");
    expect(headers["X-RateLimit-Remaining"]).toBe("0");
    expect(headers["X-RateLimit-Reset"]).toBeDefined();
  });
});

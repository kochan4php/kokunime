import { describe, expect, it, vi } from "vitest";
import { GET as getHealth } from "@/app/api/health/route";
import upstream from "@/config/upstream";

describe("API Uptime & Latency Prober Suite", () => {
  it("measures health prober response time and memory stats", async () => {
    vi.spyOn(upstream, "get").mockResolvedValue({
      status: 200,
      data: '<html><body><title>Kusonime</title><div class="kover"><div class="content"><h2><a>Test Anime</a></h2></div></div></body></html>',
      headers: {},
    } as any);

    const start = performance.now();
    const res = await getHealth();
    const duration = performance.now() - start;

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.scraper).toBe("operational");
    expect(json.memory).toBeDefined();
    expect(json.memory.heap_used_mb).toBeGreaterThan(0);
    expect(json.probes[0].kover_count).toBe(1);
    // Two upstream fetches (health check + diagnostic probe) — allow network slack.
    expect(duration).toBeLessThan(5000);
  });

  it("handles upstream degradation gracefully with status 503 and degraded status", async () => {
    vi.spyOn(upstream, "get").mockRejectedValue(new Error("Connection timeout"));

    const res = await getHealth();
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.status).toBe("degraded");
    expect(json.scraper).toBe("unreachable");
  });
});

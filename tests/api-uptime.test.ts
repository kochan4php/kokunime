import { describe, expect, it, vi } from "vitest";
import { GET as getHealth } from "@/app/api/health/route";
import upstream from "@/config/upstream";

describe("API Uptime & Latency Prober Suite", () => {
  it("measures health prober response time and memory stats", async () => {
    vi.spyOn(upstream, "get").mockResolvedValueOnce({
      status: 200,
      data: "<html>OK</html>",
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
    expect(duration).toBeLessThan(1000);
  });

  it("handles upstream degradation gracefully with status 503 and degraded status", async () => {
    vi.spyOn(upstream, "get").mockRejectedValueOnce(new Error("Connection timeout"));

    const res = await getHealth();
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.status).toBe("degraded");
    expect(json.scraper).toBe("unreachable");
  });
});

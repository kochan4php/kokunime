import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fetchUpstream } from "@/config/upstream";

describe("upstream fetcher", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches data successfully from upstream", async () => {
    const mockHtml = "<html><body><h1>Kokunime</h1></body></html>";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        url: "https://kusonime.com/anime-test",
        headers: new Headers({ "content-length": "100" }),
        text: () => Promise.resolve(mockHtml),
      }),
    );

    const res = await fetchUpstream("/anime-test");
    expect(res.status).toBe(200);
    expect(res.data).toBe(mockHtml);
    expect(res.url).toBe("https://kusonime.com/anime-test");
  });

  it("retries on 429 status and succeeds on second attempt", async () => {
    const mockHtml = "<html>Success after retry</html>";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: "https://kusonime.com/anime-test",
        headers: new Headers(),
        text: () => Promise.resolve(mockHtml),
      });

    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchUpstream("/anime-test");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(res.data).toBe(mockHtml);
  });

  it("throws error when all retries are exhausted", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchUpstream("/anime-test")).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it("blocks disallowed URLs with SSRF guard", async () => {
    await expect(fetchUpstream("https://evil-attacker.com/malicious")).rejects.toThrow("SSRF Guard");
  });

  it("calculates exponential backoff with jitter", async () => {
    const { calculateBackoff } = await import("@/config/upstream");
    const delay0 = calculateBackoff(0);
    const delay1 = calculateBackoff(1);
    expect(delay0).toBeGreaterThanOrEqual(500);
    expect(delay0).toBeLessThan(750);
    expect(delay1).toBeGreaterThanOrEqual(1000);
    expect(delay1).toBeLessThan(1250);
  });

  it("coalesces concurrent requests for the exact same URL (Singleflight)", async () => {
    const mockHtml = "<html>Coalesced</html>";
    let fetchCalls = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        fetchCalls++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return {
          ok: true,
          status: 200,
          url: "https://kusonime.com/coalesced",
          headers: new Headers(),
          text: () => Promise.resolve(mockHtml),
        };
      }),
    );

    const [res1, res2, res3] = await Promise.all([
      fetchUpstream("/coalesced"),
      fetchUpstream("/coalesced"),
      fetchUpstream("/coalesced"),
    ]);

    expect(fetchCalls).toBe(1);
    expect(res1.data).toBe(mockHtml);
    expect(res2.data).toBe(mockHtml);
    expect(res3.data).toBe(mockHtml);
  });
});

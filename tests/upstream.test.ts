import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import upstream from "@/config/upstream";

describe("upstream axios instance", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches data successfully using upstream instance", async () => {
    const mockHtml = "<html><body><h1>Kokunime</h1></body></html>";
    vi.spyOn(upstream, "get").mockResolvedValueOnce({
      data: mockHtml,
      status: 200,
      statusText: "OK",
      headers: {},
      config: { url: "/anime-test" } as any,
    });

    const res = await upstream.get("/anime-test");
    expect(res.status).toBe(200);
    expect(res.data).toBe(mockHtml);
  });

  it("has correct base URL and timeout", () => {
    expect(upstream.defaults.baseURL).toBe("https://kusonime.com/");
    expect(upstream.defaults.timeout).toBe(10_000);
    expect(upstream.defaults.headers["User-Agent"]).toBe("*");
    expect(upstream.defaults.headers["Referer"]).toBe("https://kusonime.com/");
  });
});

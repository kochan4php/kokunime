import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import kusonime from "@/config/kusonime";

describe("kusonime axios instance", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches data successfully using kusonime instance", async () => {
    const mockHtml = "<html><body><h1>Kokunime</h1></body></html>";
    vi.spyOn(kusonime, "get").mockResolvedValueOnce({
      data: mockHtml,
      status: 200,
      statusText: "OK",
      headers: {},
      config: { url: "/anime-test" } as any,
    });

    const res = await kusonime.get("/anime-test");
    expect(res.status).toBe(200);
    expect(res.data).toBe(mockHtml);
  });

  it("has correct base URL and timeout", () => {
    expect(kusonime.defaults.baseURL).toBe("https://kusonime.com");
    expect(kusonime.defaults.timeout).toBe(10_000);
    expect(kusonime.defaults.headers["User-Agent"]).toBe("*");
    expect(kusonime.defaults.headers["Referer"]).toBe("https://kusonime.com/");
  });
});

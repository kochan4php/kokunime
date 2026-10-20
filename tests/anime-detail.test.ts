import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/config/upstream", () => ({ default: { get } }));
vi.mock("@/services/cache", () => ({
  cachedWithMeta: async (_key: string, _ttl: number, load: () => Promise<unknown>) => ({
    value: await load(),
    tier: "fresh",
    fetchedAt: Date.now(),
  }),
  TTL: { detail: 300 },
}));

const html = readFileSync(new URL("./fixtures/detail-page.html", import.meta.url), "utf8");

describe("anime detail fetch", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("parses the requested detail page", async () => {
    get.mockResolvedValue({
      data: html,
      status: 200,
      request: { responseURL: "https://kusonime.com/one-piece/" },
    });
    const { getAnimeDetail } = await import("@/services/scraper/anime-detail");
    expect((await getAnimeDetail("one-piece"))?.title).toBeTruthy();
  }, 20_000);

  it("returns null when upstream redirects an unknown slug to the homepage", async () => {
    get.mockResolvedValue({
      data: "<html><title>Kusonime</title></html>",
      status: 200,
      request: { responseURL: "https://kusonime.com/" },
    });
    const { getAnimeDetail } = await import("@/services/scraper/anime-detail");
    expect(await getAnimeDetail("missing-slug")).toBeNull();
  });

  it("maps upstream 404 and 410 to null", async () => {
    const { getAnimeDetail } = await import("@/services/scraper/anime-detail");
    get.mockRejectedValueOnce(Object.assign(new Error("Upstream responded 404"), { response: { status: 404 } }));
    expect(await getAnimeDetail("gone")).toBeNull();
    get.mockRejectedValueOnce(Object.assign(new Error("Upstream responded 410"), { response: { status: 410 } }));
    expect(await getAnimeDetail("deleted")).toBeNull();
  });

  it("still throws on upstream server errors", async () => {
    get.mockRejectedValueOnce(Object.assign(new Error("Upstream responded 500"), { response: { status: 500 } }));
    const { getAnimeDetail } = await import("@/services/scraper/anime-detail");
    await expect(getAnimeDetail("boom")).rejects.toThrow("500");
  });
});

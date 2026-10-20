import { describe, expect, it, vi } from "vitest";
import { SITE_URL } from "@/lib/site";

vi.mock("@/lib/catalog-snapshot", () => ({
  getCatalogSnapshot: async () => ({
    items: [
      {
        slug: "one-piece",
        title: "One Piece",
        modified: "2026-10-19T15:10:41.000Z",
        image: "https://cdn.example/one.jpg",
      },
      { slug: "steins-gate", title: "Steins;Gate", modified: "bad-date" },
      { slug: "sakamoto", title: "Sakamoto", modified: "2026-10-18T00:00:00Z" },
      { slug: "slam-dunk", title: "Slam Dunk", modified: "2026-10-17T00:00:00Z" },
    ],
    complete: true,
    fetchedAt: Date.parse("2026-10-20T00:00:00Z"),
  }),
}));

vi.mock("@/services/cache", () => ({ getLastUpstreamFetchAt: () => 0 }));

vi.mock("@/services/scraper", () => ({
  getAnimePerPage: async () => ({
    anime: [
      {
        title: "One Piece",
        link: {
          endpoint: "https://kusonime.com/one-piece/",
          url: "https://kusonime.com/one-piece/",
          image: "https://cdn.example/fresh.jpg",
        },
      },
    ],
    pagination: { total_page: 3 },
  }),
  getGenres: async () => [],
  getSeasons: async () => [],
}));

describe("sitemap entries", () => {
  it("dedupes catalog URLs, uses modified dates, and lists every page", async () => {
    const { getSitemapEntries } = await import("@/lib/sitemap-entries");
    const entries = await getSitemapEntries();
    const urls = entries.map((entry) => entry.url);
    const anime = entries.filter((entry) => entry.url === `${SITE_URL}/anime/one-piece`);

    expect(new Set(urls).size).toBe(urls.length);
    expect(anime).toHaveLength(1);
    expect(anime[0]?.lastModified).toEqual(new Date("2026-10-19T15:10:41.000Z"));
    expect(anime[0]?.images).toEqual(["https://cdn.example/fresh.jpg"]);
    expect(urls).toContain(`${SITE_URL}/anime/steins-gate`);
    expect(urls).toContain(`${SITE_URL}/indeks/S`);
    expect(urls).toContain(`${SITE_URL}/page/2`);
    expect(urls).toContain(`${SITE_URL}/page/3`);
    expect(urls).not.toContain(`${SITE_URL}/page/4`);
  });
});

// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// Contract tests: response shapes stay stable for third-party clients.
vi.mock("@/services/scraper", () => ({
  getAnimeDetail: vi.fn(),
  getAnimeDetailWithMeta: vi.fn(),
  getAnimeByGenres: vi.fn(),
}));

const scraper = await import("@/services/scraper");
const { GET: bulkGet } = await import("@/app/api/anime/bulk/route");
const { GET: episodesGet } = await import("@/app/api/anime/[slug]/episodes/route");
const { GET: genreGet } = await import("@/app/api/genres/[genre]/route");
const { GET: suggestGet } = await import("@/app/api/suggest/route");
const { GET: searchIndexGet } = await import("@/app/api/search-index/route");
const { GET: trendingGet } = await import("@/app/api/trending/route");
const { GET: statusGet } = await import("@/app/api/status/route");
const { encodeCursor, decodeCursor } = await import("@/lib/api-pagination");

const fakeDetail = {
  title: "Naruto Batch",
  japanese: "ナルト",
  score: "8.0",
  status: "Completed",
  type: "TV",
  total_episode: "220",
  trailer: null,
  download: [
    {
      title: "Episode 2 - 12 (End)",
      is_batch: true,
      link_download: [
        {
          resolusi: "720p",
          height: 720,
          link: [{ platform: "Acefile", url: "https://example.com/720", is_torrent: false }],
        },
      ],
    },
    {
      title: "Episode 1",
      link_download: [
        {
          resolusi: "480p",
          height: 480,
          link: [
            { platform: "Gdrive", url: "https://example.com/1" },
            { platform: "Torrent", url: "https://example.com/1.torrent", is_torrent: true },
          ],
        },
      ],
    },
  ],
};

beforeEach(() => {
  vi.mocked(scraper.getAnimeDetail).mockResolvedValue(fakeDetail as never);
  vi.mocked(scraper.getAnimeDetailWithMeta).mockResolvedValue({
    anime: fakeDetail as never,
    tier: "miss",
    fetchedAt: Date.now(),
  });
});

describe("GET /api/anime/bulk (contract)", () => {
  it("projects fields and keeps the { total, results } envelope", async () => {
    const res = await bulkGet(new NextRequest("http://localhost/api/anime/bulk?slugs=naruto&fields=title,hack"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.total).toBe(1);
    expect(json.results[0].slug).toBe("naruto");
    expect(json.results[0].success).toBe(true);
    expect(json.results[0].data).toEqual({ title: "Naruto Batch" });
  });

  it("answers 304 for a matching If-None-Match", async () => {
    const first = await bulkGet(new NextRequest("http://localhost/api/anime/bulk?slugs=naruto"));
    const etag = first.headers.get("etag");
    expect(etag).toBeTruthy();

    const second = await bulkGet(
      new NextRequest("http://localhost/api/anime/bulk?slugs=naruto", {
        headers: { "if-none-match": etag as string },
      }),
    );
    expect(second.status).toBe(304);
  });
});

describe("GET /api/anime/[slug]/episodes (contract)", () => {
  it("flattens mirrors and sorts episodes", async () => {
    const res = await episodesGet(new NextRequest("http://localhost/api/anime/naruto/episodes"), {
      params: Promise.resolve({ slug: "naruto" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.slug).toBe("naruto");
    expect(json.total_episodes).toBe(2);
    expect(json.groups.map((group: { episode: number | null }) => group.episode)).toEqual([1, 2]);
    expect(json.groups[0].mirrors).toHaveLength(2);
    expect(json.groups[0].mirrors[0]).toMatchObject({ resolution: "480p", platform: "Gdrive" });
    expect(json.groups[1].is_batch).toBe(true);
  });
});

describe("GET /api/genres/[genre] (contract)", () => {
  it("exposes next_cursor and honours cursor= over page=", async () => {
    vi.mocked(scraper.getAnimeByGenres).mockResolvedValue({
      anime: [] as never,
      pagination: { next_page_endpoint: "genres/action?page=2", total_page: 5 } as never,
    });

    const res = await genreGet(new NextRequest("http://localhost/api/genres/action?cursor=" + encodeCursor(3)), {
      params: Promise.resolve({ genre: "action" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.page).toBe(3);
    expect(decodeCursor(json.next_cursor)).toBe(4);
  });
});

describe("GET /api/suggest + /api/trending + /api/status (contract)", () => {
  it("suggest returns the { query, total, items } envelope with ETag", async () => {
    const res = await suggestGet(new NextRequest("http://localhost/api/suggest?q=naruto"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.query).toBe("naruto");
    expect(Array.isArray(json.items)).toBe(true);
    expect(res.headers.get("etag")).toBeTruthy();
  });

  it("search-index returns compact rows with an ETag and honours If-None-Match", async () => {
    const res = await searchIndexGet(new NextRequest("http://localhost/api/search-index"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json.total).toBe("number");
    expect(Array.isArray(json.items)).toBe(true);
    // Rows are [slug, title, image, release, genres] — arrays, not objects.
    for (const row of json.items) {
      expect(Array.isArray(row)).toBe(true);
      expect(typeof row[0]).toBe("string");
      expect(typeof row[1]).toBe("string");
    }
    const etag = res.headers.get("etag");
    expect(etag).toBeTruthy();

    const cached = await searchIndexGet(
      new NextRequest("http://localhost/api/search-index", { headers: { "if-none-match": String(etag) } }),
    );
    expect(cached.status).toBe(304);
  });

  it("trending returns the { total, items } envelope", async () => {
    const res = await trendingGet(new NextRequest("http://localhost/api/trending"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json.total).toBe("number");
    expect(Array.isArray(json.items)).toBe(true);
  });

  it("status always exposes the ops contract", async () => {
    const res = await statusGet();
    expect([200, 503]).toContain(res.status);
    const json = await res.json();
    expect(["ok", "degraded"]).toContain(json.status);
    expect(typeof json.uptime_seconds).toBe("number");
    expect(json.upstream).toHaveProperty("circuit");
    expect(["disabled", "connected", "error"]).toContain(json.redis);
  });
});

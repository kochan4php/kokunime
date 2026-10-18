// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearCatalog,
  getCatalogSnapshot,
  MAX_CATALOG_ENTRIES,
  mergeServerIndex,
  recordCatalogDetail,
  recordCatalogItems,
  searchLocalCatalog,
  suggestCorrection,
} from "@/utils/local-catalog";
import type { Anime, AnimeDetail } from "@/interfaces";

const item = (title: string, endpoint: string, release = "", genres: string[] = []): Anime => ({
  title,
  release,
  genres,
  link: { endpoint, image: `https://example.com/${endpoint}.jpg` },
});

const detail = (overrides: Partial<AnimeDetail> = {}): AnimeDetail => ({
  title: "Naruto",
  studio: "Pierrot",
  score: "8.1",
  release_on: "3 Oktober 2002",
  genre: [{ name: "Action" }, { name: "Adventure" }],
  download: [],
  ...overrides,
});

beforeEach(() => {
  clearCatalog();
  window.localStorage.clear();
  window.dispatchEvent(new Event("storage"));
});

describe("recordCatalogItems", () => {
  it("records titles, dedupes by slug and ignores items without a slug", () => {
    const added = recordCatalogItems([
      item("Naruto", "naruto", "2002", ["Action"]),
      item("Naruto", "naruto", "2002", ["Action"]),
      { title: "Broken", release: "", genres: [], link: {} },
    ]);
    expect(added).toBe(1);
    const snapshot = getCatalogSnapshot();
    expect(snapshot).toHaveLength(1);
    expect(snapshot[0]?.slug).toBe("naruto");
    expect(snapshot[0]?.image).toContain("naruto.jpg");
  });

  it("keeps the newest MAX_CATALOG_ENTRIES titles when the catalog overflows", () => {
    const bulk = Array.from({ length: MAX_CATALOG_ENTRIES + 10 }, (_, index) =>
      item(`Judul ${index}`, `judul-${index}`),
    );
    recordCatalogItems(bulk);
    const snapshot = getCatalogSnapshot();
    expect(snapshot).toHaveLength(MAX_CATALOG_ENTRIES);
    // Oldest ten dropped, newest ten kept.
    expect(snapshot.some((entry) => entry.slug === "judul-0")).toBe(false);
    expect(snapshot.some((entry) => entry.slug === `judul-${MAX_CATALOG_ENTRIES + 9}`)).toBe(true);
  });

  it("survives a reload by hydrating from localStorage", async () => {
    recordCatalogItems([item("Bleach", "bleach", "2004", ["Action"])]);
    vi.resetModules();
    const fresh = await import("@/utils/local-catalog");
    const hydrated = fresh.getCatalogSnapshot();
    expect(hydrated.map((entry) => entry.slug)).toEqual(["bleach"]);
  });
});

describe("recordCatalogDetail", () => {
  it("stores score, studio and genres gleaned from a detail page", () => {
    recordCatalogItems([item("Naruto", "naruto")]);
    recordCatalogDetail("naruto", detail());
    const entry = getCatalogSnapshot()[0];
    expect(entry?.rating).toBe("8.1");
    expect(entry?.studio).toBe("Pierrot");
    expect(entry?.release).toBe("2002");
    expect(entry?.genres).toEqual(["Action", "Adventure"]);
  });
});

describe("mergeServerIndex", () => {
  it("adds unknown rows, reports the count and never overwrites local titles", () => {
    recordCatalogItems([item("Naruto", "naruto", "2002", ["Action"])]);
    const added = mergeServerIndex([
      { slug: "naruto", title: "Naruto (SERVER)", release: "1999", genres: ["Server"] },
      { slug: "bleach", title: "Bleach", release: "2004", genres: ["Action"] },
      null,
    ]);
    expect(added).toBe(1);
    const snapshot = getCatalogSnapshot();
    expect(snapshot.find((entry) => entry.slug === "naruto")?.title).toBe("Naruto");
    expect(snapshot.find((entry) => entry.slug === "naruto")?.release).toBe("2002");
    expect(snapshot.some((entry) => entry.slug === "bleach")).toBe(true);
  });
});

describe("searchLocalCatalog", () => {
  beforeEach(() => {
    recordCatalogItems([
      item("Naruto", "naruto", "2002", ["Action", "Adventure"]),
      item("Naruto Shippuden", "naruto-shippuden", "2007", ["Action", "Supernatural"]),
      item("Bleach", "bleach", "2004", ["Action", "Supernatural"]),
      item("K-On!", "k-on", "2009", ["Comedy", "Slice of Life"]),
    ]);
    recordCatalogDetail("naruto", detail());
    recordCatalogDetail(
      "bleach",
      detail({ title: "Bleach", studio: "Studio Pierrot", score: "7.9", release_on: "5 Oktober 2004" }),
    );
    recordCatalogDetail(
      "k-on",
      detail({
        title: "K-On!",
        studio: "Kyoto Animation",
        score: "7.5",
        release_on: "2009",
        genre: [{ name: "Comedy" }],
      }),
    );
  });

  it("matches text with the shared ranker", () => {
    const result = searchLocalCatalog("naruto");
    expect(result.items.map((entry) => entry.slug)).toContain("naruto");
    expect(result.items.length).toBe(2);
  });

  it("applies genre, year, score and studio filters", () => {
    expect(searchLocalCatalog("genre:comedy").items.map((entry) => entry.slug)).toEqual(["k-on"]);
    expect(searchLocalCatalog("tahun:2004").items.map((entry) => entry.slug)).toEqual(["bleach"]);
    expect(searchLocalCatalog("skor:8").items.map((entry) => entry.slug)).toEqual(["naruto"]);
    expect(searchLocalCatalog("studio:kyoto").items.map((entry) => entry.slug)).toEqual(["k-on"]);
    // Score/studio filters drop titles whose detail page was never opened.
    expect(
      searchLocalCatalog("skor:7")
        .items.map((entry) => entry.slug)
        .sort(),
    ).toEqual(["bleach", "k-on", "naruto"]);
  });

  it("excludes terms", () => {
    const result = searchLocalCatalog("naruto -shippuden");
    expect(result.items.map((entry) => entry.slug)).toEqual(["naruto"]);
  });

  it("counts facets with the other dimensions still applied", () => {
    const result = searchLocalCatalog("genre:action");
    expect(result.facets.years.map((facet) => facet.name)).toEqual(["2002", "2004", "2007"]);
    expect(result.facets.genres.map((facet) => facet.name)).toContain("Adventure");
    const comedy = searchLocalCatalog("genre:comedy");
    expect(comedy.facets.years).toEqual([{ name: "2009", count: 1 }]);
  });

  it("returns a spelling suggestion only when nothing matched", () => {
    const miss = searchLocalCatalog("narutoooo");
    expect(miss.items).toEqual([]);
    expect(miss.didYouMean).toBe("Naruto");
    const hit = searchLocalCatalog("naruto");
    expect(hit.didYouMean).toBeNull();
  });

  it("stays empty and instant on an empty catalog", () => {
    clearCatalog();
    const result = searchLocalCatalog("naruto");
    expect(result.items).toEqual([]);
    expect(result.facets.genres).toEqual([]);
    expect(result.didYouMean).toBeNull();
  });
});

describe("suggestCorrection", () => {
  it("ignores operator tokens and short queries", () => {
    recordCatalogItems([item("Naruto", "naruto")]);
    expect(suggestCorrection("genre:action narutoo")).toBe("Naruto");
    expect(suggestCorrection("nar")).toBeNull();
  });
});

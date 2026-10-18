import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { parseAnimeDetail } from "@/services/scraper/parse-detail";
import { extractWithFallback } from "@/services/scraper/parse-fallback";
import { formatAnimeData } from "@/services/scraper/parse-list";
import { parsePagination } from "@/services/scraper/parse-pagination";
import { parseSimplePagination } from "@/services/scraper/parse-simple-pagination";

// Golden fixtures live in tests/fixtures/*.html (mirroring real upstream
// markup; the list fixtures are trimmed captures of the live genre, season and
// home listings). The matrix also runs every parser over every fixture: a
// parser crashing on foreign markup is a robustness bug, not a "no data" case.
const fixture = (name: string): string => readFileSync(path.join(process.cwd(), "tests", "fixtures", name), "utf8");
const FIXTURES = [
  "list-page.html",
  "detail-page.html",
  "pagination-page.html",
  "genre-page.html",
  "season-page.html",
  "update-page.html",
  "empty-page.html",
  "error-page.html",
];

describe("parser golden-fixture matrix", () => {
  it("list parser reads titles, release, genres and the largest image", () => {
    const anime = formatAnimeData(load(fixture("list-page.html")));
    expect(anime).toHaveLength(1);
    expect(anime[0]).toMatchObject({ title: "Anime Foo", release: "3:54 pm", genres: ["Action", "Adventure"] });
    expect(anime[0]!.link.endpoint).toBe("anime-foo/");
    expect(anime[0]!.link.image).toContain("foo.jpg");
  });

  it("detail parser reads the info table, genres, season and synopsis", () => {
    const detail = parseAnimeDetail(load(fixture("detail-page.html")));
    expect(detail).toMatchObject({
      title: "Anime Foo",
      japanese: "フー",
      producer: "Studio Foo",
      type: "TV",
      status: "Completed",
      total_episode: "12",
      score: "8.10",
      duration: "24 min.",
    });
    expect(detail.genre).toEqual([
      { name: "Action", url: "https://kusonime.com/genres/action/", endpoint: "genres/action/" },
    ]);
    expect(detail.season).toMatchObject({ name: "Fall 2024", endpoint: "seasons/fall-2024/" });
  });

  it("pagination parser reads current/total pages", () => {
    const pagination = parsePagination(load(fixture("pagination-page.html")));
    expect(pagination).toMatchObject({ current_page: 1, total_page: 10 });
  });

  it("genre listing fixture parses and keeps its rel=next page", () => {
    const $ = load(fixture("genre-page.html"));
    const anime = formatAnimeData($);
    // Every rendered card must reach the parser — count drift means selector drift.
    expect(anime).toHaveLength($(".venz .kover").length);
    expect(anime.length).toBeGreaterThan(0);
    expect(anime[0]!.title).toBe("Pokemon (2023) 001-150 Batch Subtitle Indonesia");
    expect(anime[0]!.link.endpoint).toBe("pokemon-2023-batch-subtitle-indonesia-2/");
    expect(anime[0]!.genres).toContain("Action");
    expect(parseSimplePagination($, 1)).toMatchObject({ current_page: 1, next_page_endpoint: "page/2" });
  });

  it("season listing fixture parses with pagination", () => {
    const $ = load(fixture("season-page.html"));
    const anime = formatAnimeData($);
    expect(anime).toHaveLength($(".venz .kover").length);
    expect(anime[0]!.title).toBe("Ushiro no Shoumen Kamui-san Batch Subtitle Indonesia");
    expect(parseSimplePagination($, 1)?.next_page_endpoint).toBe("page/2");
  });

  it("home/update listing fixture parses with pagination", () => {
    const $ = load(fixture("update-page.html"));
    const anime = formatAnimeData($);
    expect(anime).toHaveLength($(".venz .kover").length);
    expect(anime[0]!.title).toBe("Jigoku Shoujo Live Action (2019) BD Subtitle Indonesia");
    expect(parseSimplePagination($, 1)?.next_page_endpoint).toBe("page/2");
  });

  it("empty search fixture yields zero items and no pagination", () => {
    const $ = load(fixture("empty-page.html"));
    expect(formatAnimeData($)).toEqual([]);
    expect(parseSimplePagination($, 1)).toBeNull();
  });

  it("error shell fixture degrades to the fallback extractor, never throws", () => {
    const $ = load(fixture("error-page.html"));
    expect(formatAnimeData($)).toEqual([]);
    expect(parseSimplePagination($, 1)).toBeNull();
    const fallback = extractWithFallback($);
    expect(fallback.title).toBe("Kusonime");
    expect(fallback.image).toBeUndefined();
    expect(fallback.synopsis).toBeUndefined();
  });

  it("every parser survives every fixture without throwing", () => {
    for (const name of FIXTURES) {
      const $ = load(fixture(name));
      expect($).toBeTruthy();
      expect(() => formatAnimeData($)).not.toThrow();
      expect(() => parseAnimeDetail($)).not.toThrow();
      expect(() => parsePagination($)).not.toThrow();
      expect(() => parseSimplePagination($, 1)).not.toThrow();
      expect(() => extractWithFallback($)).not.toThrow();
    }
  });
});

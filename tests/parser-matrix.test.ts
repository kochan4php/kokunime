import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { parseAnimeDetail } from "@/services/scraper/parse-detail";
import { formatAnimeData } from "@/services/scraper/parse-list";
import { parsePagination } from "@/services/scraper/parse-pagination";

// Golden fixtures live in tests/fixtures/*.html (mirroring real upstream
// markup). The matrix also runs every parser over every fixture: a parser
// crashing on foreign markup is a robustness bug, not a "no data" case.
const fixture = (name: string): string => readFileSync(path.join(process.cwd(), "tests", "fixtures", name), "utf8");

describe("parser golden-fixture matrix", () => {
  it("list parser reads titles, release, genres and the largest image", () => {
    const anime = formatAnimeData(load(fixture("list-page.html")));
    expect(anime).toHaveLength(1);
    expect(anime[0]).toMatchObject({ title: "Anime Foo", release: "3:54 pm", genres: ["Action", "Adventure"] });
    expect(anime[0]!.link.endpoint).toBe("anime-foo/");
    expect(anime[0]!.link.image).toContain("foo.jpg");
  });

  it("detail parser reads the info table and synopsis", () => {
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
  });

  it("pagination parser reads current/total pages", () => {
    const pagination = parsePagination(load(fixture("pagination-page.html")));
    expect(pagination).toMatchObject({ current_page: 1, total_page: 10 });
  });

  it("every parser survives every fixture without throwing", () => {
    for (const name of ["list-page.html", "detail-page.html", "pagination-page.html"]) {
      const $ = load(fixture(name));
      expect($).toBeTruthy();
      expect(() => formatAnimeData($)).not.toThrow();
      expect(() => parseAnimeDetail($)).not.toThrow();
      expect(() => parsePagination($)).not.toThrow();
    }
  });
});

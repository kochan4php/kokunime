import { describe, expect, it } from "vitest";
import { mergeSearchResults, normalizeSearchTerm, resolveSearchAlias } from "@/config/search-aliases";
import type { Anime } from "@/interfaces";

const anime = (title: string, endpoint: string): Anime => ({ title, release: "", genres: [], link: { endpoint } });

describe("search aliases", () => {
  it("normalizes queries (case, punctuation, spacing)", () => {
    expect(normalizeSearchTerm("  Attack  On   Titan! ")).toBe("attack on titan");
    expect(normalizeSearchTerm("Re:Zero")).toBe("re zero");
  });

  it("resolves known aliases only", () => {
    expect(resolveSearchAlias("AOT")).toBe("shingeki no kyojin");
    expect(resolveSearchAlias("aot!")).toBe("shingeki no kyojin");
    expect(resolveSearchAlias("naruto")).toBeNull();
    expect(resolveSearchAlias("")).toBeNull();
  });

  it("merges results with primary first and dedupes by endpoint/title", () => {
    const primary = [anime("A", "anime-a/"), anime("B", "anime-b/")];
    const secondary = [anime("B duplicate", "ANIME-B"), anime("C", "anime-c/")];

    const merged = mergeSearchResults(primary, secondary);
    expect(merged.map((item) => item.title)).toEqual(["A", "B", "C"]);
  });

  it("dedupes entries that only share a title", () => {
    const merged = mergeSearchResults([anime("Same", "")], [anime("same", "")]);
    expect(merged).toHaveLength(1);
  });
});

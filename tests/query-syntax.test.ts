import { describe, expect, it } from "vitest";
import { parseQuerySyntax } from "@/utils/query-syntax";
import { rankIndexItems, type IndexedAnime } from "@/lib/search-index";

describe("parseQuerySyntax", () => {
  it("splits free text, genre filters and exclusions", () => {
    expect(parseQuerySyntax("naruto genre:action,adventure -movie")).toEqual({
      text: "naruto",
      genres: ["action", "adventure"],
      exclude: ["movie"],
    });
  });

  it("keeps plain queries untouched", () => {
    expect(parseQuerySyntax("one piece")).toEqual({ text: "one piece", genres: [], exclude: [] });
  });

  it("treats a lone dash as text", () => {
    expect(parseQuerySyntax("- x")).toEqual({ text: "- x", genres: [], exclude: [] });
  });
});

const records: IndexedAnime[] = [
  { slug: "one-piece", title: "One Piece", genres: ["Action", "Adventure"] },
  { slug: "naruto", title: "Naruto Shippuden", genres: ["Action"] },
  { slug: "bleach", title: "Bleach", genres: ["Action", "Supernatural"] },
  { slug: "k-on", title: "K-On!", genres: ["Comedy", "Slice of Life"] },
];

describe("rankIndexItems", () => {
  it("prefers prefix matches and matches compact spelling", () => {
    const result = rankIndexItems(records, { text: "onepiece", genres: [], exclude: [] }, 10);
    expect(result[0]?.slug).toBe("one-piece");
  });

  it("filters by genre (ANY-of, case-insensitive substring)", () => {
    const result = rankIndexItems(records, { text: "", genres: ["comedy"], exclude: [] }, 10);
    expect(result.map((item) => item.slug)).toEqual(["k-on"]);
  });

  it("excludes terms", () => {
    const result = rankIndexItems(records, { text: "e", genres: [], exclude: ["bleach"] }, 10);
    expect(result.some((item) => item.slug === "bleach")).toBe(false);
  });

  it("matches reordered multiword tokens via token-AND fallback", () => {
    const result = rankIndexItems(records, { text: "shippuden naruto", genres: [], exclude: [] }, 10);
    expect(result[0]?.slug).toBe("naruto");
  });

  it("returns everything (capped) for empty queries", () => {
    const result = rankIndexItems(records, { text: "", genres: [], exclude: [] }, 2);
    expect(result).toHaveLength(2);
  });

  it("returns nothing when no title matches", () => {
    expect(rankIndexItems(records, { text: "zzzz", genres: [], exclude: [] }, 10)).toEqual([]);
  });
});

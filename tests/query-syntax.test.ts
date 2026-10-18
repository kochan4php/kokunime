import { describe, expect, it } from "vitest";
import { ParsedQuery, parseQuerySyntax, queryUsesLocalOnlyFilters } from "@/utils/query-syntax";
import { rankIndexItems, type IndexedAnime } from "@/lib/search-index";

const P = (partial: Partial<ParsedQuery>): ParsedQuery => ({
  text: "",
  genres: [],
  exclude: [],
  years: [],
  minRating: null,
  studios: [],
  ...partial,
});

describe("parseQuerySyntax", () => {
  it("splits free text, genre filters and exclusions", () => {
    expect(parseQuerySyntax("naruto genre:action,adventure -movie")).toEqual(
      P({ text: "naruto", genres: ["action", "adventure"], exclude: ["movie"] }),
    );
  });

  it("keeps plain queries untouched", () => {
    expect(parseQuerySyntax("one piece")).toEqual(P({ text: "one piece" }));
  });

  it("treats a lone dash as text", () => {
    expect(parseQuerySyntax("- x")).toEqual(P({ text: "- x" }));
  });

  it("parses tahun:, skor: and studio: operators", () => {
    expect(parseQuerySyntax("tahun:2024,1999 skor:8,5 studio:mappa,wit genre:action")).toEqual(
      P({ years: ["2024", "1999"], minRating: 8.5, studios: ["mappa", "wit"], genres: ["action"] }),
    );
  });

  it("ignores malformed years, clamps scores and keeps stray operators as text", () => {
    expect(parseQuerySyntax("tahun:20x4 skor:99 naruto").years).toEqual([]);
    expect(parseQuerySyntax("naruto skor:99").minRating).toBe(10);
    expect(parseQuerySyntax("naruto skor:-3").minRating).toBe(0);
    expect(parseQuerySyntax("tahun: skor:").text).toBe("tahun: skor:");
  });

  it("flags local-only operators", () => {
    expect(queryUsesLocalOnlyFilters("naruto skor:8")).toBe(true);
    expect(queryUsesLocalOnlyFilters("naruto studio:mappa")).toBe(true);
    expect(queryUsesLocalOnlyFilters("naruto tahun:2024 genre:action")).toBe(false);
  });
});

const records: IndexedAnime[] = [
  { slug: "one-piece", title: "One Piece", genres: ["Action", "Adventure"], release: "2023" },
  { slug: "naruto", title: "Naruto Shippuden", genres: ["Action"], release: "2007" },
  { slug: "bleach", title: "Bleach", genres: ["Action", "Supernatural"], release: "2004" },
  { slug: "k-on", title: "K-On!", genres: ["Comedy", "Slice of Life"], release: "2009" },
];

describe("rankIndexItems", () => {
  it("prefers prefix matches and matches compact spelling", () => {
    const result = rankIndexItems(records, P({ text: "onepiece" }), 10);
    expect(result[0]?.slug).toBe("one-piece");
  });

  it("filters by genre (ANY-of, case-insensitive substring)", () => {
    const result = rankIndexItems(records, P({ genres: ["comedy"] }), 10);
    expect(result.map((item) => item.slug)).toEqual(["k-on"]);
  });

  it("excludes terms", () => {
    const result = rankIndexItems(records, P({ text: "e", exclude: ["bleach"] }), 10);
    expect(result.some((item) => item.slug === "bleach")).toBe(false);
  });

  it("matches reordered multiword tokens via token-AND fallback", () => {
    const result = rankIndexItems(records, P({ text: "shippuden naruto" }), 10);
    expect(result[0]?.slug).toBe("naruto");
  });

  it("filters by release year", () => {
    const result = rankIndexItems(records, P({ years: ["2004", "2007"] }), 10);
    expect(result.map((item) => item.slug).sort()).toEqual(["bleach", "naruto"]);
  });

  it("returns everything (capped) for empty queries", () => {
    const result = rankIndexItems(records, P({}), 2);
    expect(result).toHaveLength(2);
  });

  it("returns nothing when no title matches", () => {
    expect(rankIndexItems(records, P({ text: "zzzz" }), 10)).toEqual([]);
  });
});

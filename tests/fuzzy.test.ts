import { describe, expect, it } from "vitest";
import { fuzzyScore, highlightSegments } from "@/utils/fuzzy";

describe("fuzzyScore", () => {
  it("scores prefix > substring > subsequence > no match", () => {
    expect(fuzzyScore("one", "One Piece")).toBe(100);
    expect(fuzzyScore("piece", "One Piece")).toBeGreaterThan(0);
    expect(fuzzyScore("opc", "One Piece")).toBeGreaterThan(0);
    expect(fuzzyScore("zzz", "One Piece")).toBe(0);
    expect(fuzzyScore("", "anything")).toBe(1);
  });

  it("is case-insensitive", () => {
    expect(fuzzyScore("BLEACH", "bleach")).toBe(100);
  });
});

describe("highlightSegments", () => {
  it("marks substring matches", () => {
    expect(highlightSegments("One Piece", "piece")).toEqual([
      { text: "One ", match: false },
      { text: "Piece", match: true },
    ]);
  });

  it("marks subsequence characters when there is no exact substring", () => {
    const segments = highlightSegments("One Piece", "ope");
    expect(
      segments
        .filter((segment) => segment.match)
        .map((segment) => segment.text)
        .join("")
        .toLowerCase(),
    ).toBe("ope");
  });

  it("returns a single unmatched segment for an empty query", () => {
    expect(highlightSegments("One Piece", "")).toEqual([{ text: "One Piece", match: false }]);
  });
});

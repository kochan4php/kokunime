import { describe, expect, it } from "vitest";
import { extractYear, similarityScore } from "@/utils/similar";

describe("similarityScore", () => {
  it("scores identical inputs highest and returns symmetric results", () => {
    const a = { genres: ["Action", "Fantasy"], score: "8.5", year: "2024", type: "TV" };
    const b = { genres: ["action", " fantasy "], score: 8.5, year: 2024, type: "tv" };
    expect(similarityScore(a, b)).toBe(100);
    expect(similarityScore(a, b)).toBe(similarityScore(b, a));
  });

  it("scores disjoint genres lower than overlapping ones", () => {
    const base = { genres: ["Action", "Fantasy"], score: "8.0", year: "2024", type: "TV" };
    const overlapping = { genres: ["Action", "Comedy"], score: "8.0", year: "2024", type: "TV" };
    const disjoint = { genres: ["Romance", "Slice of Life"], score: "8.0", year: "2024", type: "TV" };
    expect(similarityScore(base, overlapping)).toBeGreaterThan(similarityScore(base, disjoint));
  });

  it("degrades gracefully when data is missing", () => {
    const score = similarityScore({ genres: ["Action"] }, {});
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("extractYear", () => {
  it("parses years from strings and numbers", () => {
    expect(extractYear("Fall 2024")).toBe(2024);
    expect(extractYear("2024")).toBe(2024);
    expect(extractYear(1999)).toBe(1999);
    expect(extractYear("")).toBeUndefined();
    expect(extractYear(null)).toBeUndefined();
  });
});

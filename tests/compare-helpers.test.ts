import { describe, expect, it } from "vitest";
import { buildCompareMetrics, buildGenreSets, pickWinners, seriesMark } from "@/utils/compare";
import { AnimeDetail } from "@/interfaces";

const anime = (overrides: Partial<AnimeDetail>): AnimeDetail =>
  ({ title: "T", ...overrides }) as unknown as AnimeDetail;

describe("pickWinners", () => {
  it("returns every index on a tie and the leader otherwise", () => {
    expect(pickWinners([3, 5, 5])).toEqual([1, 2]);
    expect(pickWinners([8, 5, 1])).toEqual([0]);
  });

  it("returns nothing when all values are zero or the list is empty", () => {
    expect(pickWinners([0, 0, 0])).toEqual([]);
    expect(pickWinners([])).toEqual([]);
  });
});

describe("buildGenreSets", () => {
  it("splits shared and exclusive genres across two lists", () => {
    const { shared, uniques } = buildGenreSets([
      ["Action", "Fantasy"],
      ["Action", "Romance"],
    ]);
    expect(shared).toEqual(["Action"]);
    expect(uniques).toEqual([["Fantasy"], ["Romance"]]);
  });

  it("treats a genre held by any other title as not exclusive", () => {
    const { shared, uniques } = buildGenreSets([["Action", "Fantasy"], ["Action"], ["Action", "Fantasy", "Mecha"]]);
    expect(shared).toEqual(["Action"]);
    expect(uniques).toEqual([[], [], ["Mecha"]]);
  });

  it("handles empty lists", () => {
    expect(buildGenreSets([])).toEqual({ shared: [], uniques: [] });
    expect(buildGenreSets([[]])).toEqual({ shared: [], uniques: [[]] });
  });
});

describe("buildCompareMetrics", () => {
  it("keeps one value per compared title", () => {
    const metrics = buildCompareMetrics(
      anime({ score: "8.2", total_episode: "24 Episode", duration: "23 Menit", genre: [], release_on: "2024" }),
      anime({ score: "7.5", total_episode: "12 Episode", duration: "24 Menit", genre: [], release_on: "2025" }),
      anime({ score: "8.9", total_episode: "10 Episode", duration: "22 Menit", genre: [], release_on: "2023" }),
    );
    const score = metrics.find((metric) => metric.key === "score");
    const episodes = metrics.find((metric) => metric.key === "episodes");
    expect(score?.values).toEqual([8.2, 7.5, 8.9]);
    expect(episodes?.values).toEqual([24, 12, 10]);
    expect(score?.display(8.9)).toBe("8.9");
    expect(score?.display(0)).toBe("—");
  });

  it("marks the purple fallback for unknown slot indexes", () => {
    expect(seriesMark(0)).toBe("🔴");
    expect(seriesMark(2)).toBe("🟣");
    expect(seriesMark(9)).toBe("🟣");
  });
});

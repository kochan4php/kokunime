import { describe, expect, it } from "vitest";
import { DownloadOption } from "@/interfaces";
import { analyzeEpisodeCoverage, formatEpisodeRanges, listEpisodeNumbers } from "@/utils/episodes";
import { nextUnwatchedEpisode } from "@/utils/progress";

const group = (title: string, isBatch = false): DownloadOption => ({ title, is_batch: isBatch, link_download: [] });

describe("listEpisodeNumbers", () => {
  it("collects single-episode groups ascending, skipping batch and ranges", () => {
    const downloads = [
      group("One Piece Episode 1100"),
      group("One Piece Episode 1098"),
      group("One Piece Episode 01 - 12"),
      group("One Piece Batch", true),
      group("Attack on Titan The Final Season"),
    ];
    expect(listEpisodeNumbers(downloads)).toEqual([1098, 1100]);
  });

  it("handles empty and undefined input", () => {
    expect(listEpisodeNumbers(undefined)).toEqual([]);
    expect(listEpisodeNumbers([])).toEqual([]);
  });
});

describe("analyzeEpisodeCoverage", () => {
  it("treats a complete batch range as covering every episode", () => {
    expect(analyzeEpisodeCoverage([group("Episode 01 - 12", true)], "12 Episode")).toEqual({
      total: 12,
      available: [],
      missing: [],
      verifiable: true,
    });
  });

  it("reports only the episode numbers missing from the parsed page", () => {
    const coverage = analyzeEpisodeCoverage([group("Episode 01"), group("Episode 02"), group("Episode 04")], "6");
    expect(coverage.verifiable).toBe(true);
    expect(coverage.total).toBe(6);
    expect(coverage.missing).toEqual([3, 5, 6]);
  });

  it("does not claim gaps when a batch has no parseable range", () => {
    const coverage = analyzeEpisodeCoverage([group("Batch Lengkap", true), group("Episode 01")], "12");
    expect(coverage.verifiable).toBe(false);
    expect(coverage.missing).toEqual([]);
  });

  it("returns no total when metadata has no episode count", () => {
    expect(analyzeEpisodeCoverage([group("Episode 01")], "TBA")).toMatchObject({
      total: undefined,
      missing: [],
      verifiable: false,
    });
  });
});

describe("formatEpisodeRanges", () => {
  it("compresses consecutive numbers and keeps gaps readable", () => {
    expect(formatEpisodeRanges([3, 4, 5, 9, 11, 12])).toBe("3–5, 9, 11–12");
    expect(formatEpisodeRanges([])).toBe("");
    expect(formatEpisodeRanges([2, 2, 1])).toBe("1–2");
  });
});

describe("nextUnwatchedEpisode", () => {
  it("returns the first missing episode", () => {
    expect(nextUnwatchedEpisode([1, 2, 4], [1, 2, 3, 4])).toBe(3);
  });

  it("returns null when all watched or the list is empty", () => {
    expect(nextUnwatchedEpisode([1, 2], [1, 2])).toBeNull();
    expect(nextUnwatchedEpisode([], [])).toBeNull();
  });

  it("ignores watched episodes missing from the available list", () => {
    expect(nextUnwatchedEpisode([99], [50, 51])).toBe(50);
  });
});

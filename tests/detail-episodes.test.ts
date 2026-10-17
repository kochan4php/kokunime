import { describe, expect, it } from "vitest";
import { DownloadOption } from "@/interfaces";
import { listEpisodeNumbers } from "@/utils/episodes";
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

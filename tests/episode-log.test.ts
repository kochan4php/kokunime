import {
  countMarksSince,
  getEpisodeMarks,
  recordEpisodeMark,
  removeEpisodeMark,
  startOfWeek,
} from "@/utils/episode-log";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("episode log utility", () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const mockStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
    vi.stubGlobal("localStorage", mockStorage);
    vi.stubGlobal("window", {
      localStorage: mockStorage,
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("records marks and counts them since a timestamp", () => {
    recordEpisodeMark("a", 1);
    recordEpisodeMark("a", 2);
    expect(getEpisodeMarks()).toHaveLength(2);
    expect(countMarksSince(0)).toBe(2);
    expect(countMarksSince(Date.now() + 1000)).toBe(0);
  });

  it("removes the most recent matching mark on unmark", () => {
    recordEpisodeMark("a", 1);
    recordEpisodeMark("a", 1);
    recordEpisodeMark("a", 2);
    removeEpisodeMark("a", 1);
    const marks = getEpisodeMarks();
    expect(marks).toHaveLength(2);
    expect(marks.filter((mark) => mark.episode === 1)).toHaveLength(1);
    expect(marks.filter((mark) => mark.episode === 2)).toHaveLength(1);
  });

  it("ignores invalid input", () => {
    recordEpisodeMark("", 1);
    recordEpisodeMark("a", 0);
    recordEpisodeMark("a", Number.NaN);
    expect(getEpisodeMarks()).toHaveLength(0);
  });

  it("startOfWeek lands on Monday at midnight", () => {
    // Wednesday 2026-10-14 15:00 local.
    const wednesday = new Date(2026, 9, 14, 15, 0, 0).getTime();
    const start = new Date(startOfWeek(wednesday));
    expect(start.getDay()).toBe(1);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getTime()).toBeLessThanOrEqual(wednesday);
  });
});

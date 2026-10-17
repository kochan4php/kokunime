import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAllProgress,
  getProgress,
  getProgressList,
  getWatchedCount,
  isEpisodeWatched,
  parseTotalEpisodes,
  subscribeProgress,
  syncProgressMeta,
  toggleEpisodeWatched,
} from "@/utils/progress";

describe("progress utility", () => {
  let store: Record<string, string> = {};
  let listeners: Record<string, Array<() => void>> = {};

  beforeEach(() => {
    store = {};
    listeners = {};
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
      dispatchEvent: (event: { type?: string }) => {
        if (event?.type) (listeners[event.type] ?? []).forEach((cb) => cb());
        return true;
      },
      addEventListener: (type: string, cb: () => void) => {
        (listeners[type] ??= []).push(cb);
      },
      removeEventListener: (type: string, cb: () => void) => {
        listeners[type] = (listeners[type] ?? []).filter((registered) => registered !== cb);
      },
    });
  });

  it("toggles episodes and keeps them sorted and deduped", () => {
    expect(toggleEpisodeWatched("anime-1", 3, { title: "Anime 1", total: 12 })).toBe(true);
    expect(toggleEpisodeWatched("anime-1", 1)).toBe(true);

    const entry = getProgress("anime-1");
    expect(entry?.watched).toEqual([1, 3]);
    expect(entry?.title).toBe("Anime 1");
    expect(entry?.total).toBe(12);
    expect(getWatchedCount("anime-1")).toBe(2);
    expect(isEpisodeWatched("anime-1", 3)).toBe(true);

    expect(toggleEpisodeWatched("anime-1", 3)).toBe(false);
    expect(getProgress("anime-1")?.watched).toEqual([1]);
  });

  it("sanitizes stored data and ignores invalid toggles", () => {
    store["kokunime_progress"] = JSON.stringify([{ slug: "x", watched: [2, 2, -1, 1.5, "9"], updatedAt: 1 }]);
    expect(getProgress("x")?.watched).toEqual([2]);

    expect(toggleEpisodeWatched("y", 0)).toBe(false);
    expect(toggleEpisodeWatched("", 1)).toBe(false);
    expect(getProgress("y")).toBeUndefined();
  });

  it("creates a meta-only entry via syncProgressMeta", () => {
    syncProgressMeta("anime-2", { title: "Anime 2", total: 24 });
    expect(getProgress("anime-2")?.title).toBe("Anime 2");
    expect(getProgress("anime-2")?.watched).toEqual([]);
  });

  it("notifies subscribers until they unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeProgress(listener);
    expect(listener).toHaveBeenCalledTimes(1); // initial sync call

    toggleEpisodeWatched("anime-4", 1);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    toggleEpisodeWatched("anime-4", 2);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("clears all progress", () => {
    toggleEpisodeWatched("anime-3", 2);
    clearAllProgress();
    expect(getProgressList()).toHaveLength(0);
  });

  it("parses total episode strings", () => {
    expect(parseTotalEpisodes("12")).toBe(12);
    expect(parseTotalEpisodes("12 Episode")).toBe(12);
    expect(parseTotalEpisodes("1100+")).toBe(1100);
    expect(parseTotalEpisodes("?")).toBeUndefined();
    expect(parseTotalEpisodes("")).toBeUndefined();
    expect(parseTotalEpisodes(null)).toBeUndefined();
  });
});

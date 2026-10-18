import { COMPLETED_FOLDER, maybeAutoArchive } from "@/utils/auto-archive";
import { getBookmarks } from "@/utils/bookmarks";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("auto-archive", () => {
  let store: Record<string, string> = {};

  const seed = (overrides: { autoArchive?: boolean; watched?: number[]; total?: number; folder?: string } = {}) => {
    store.kokunime_user_settings = JSON.stringify({
      language: "id",
      accent: "orange",
      font: "mono",
      fontSize: "normal",
      density: "comfortable",
      nightShift: false,
      reduceMotion: true,
      readingMode: "none",
      defaultView: "grid",
      downloadLayout: "cards",
      dataSaver: false,
      hideSpoilers: false,
      autoMarkWatched: false,
      autoArchive: overrides.autoArchive ?? true,
      weeklyGoal: 0,
    });
    store.kokunime_bookmarks = JSON.stringify([
      { slug: "a", title: "Anime A", addedAt: 1, ...(overrides.folder ? { folder: overrides.folder } : {}) },
    ]);
    store.kokunime_progress = JSON.stringify([
      {
        slug: "a",
        title: "Anime A",
        total: overrides.total ?? 2,
        watched: overrides.watched ?? [1, 2],
        updatedAt: 1,
      },
    ]);
  };

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

  it("moves a completed bookmark into the Selesai folder", () => {
    seed();
    expect(maybeAutoArchive("a")).toBe("Anime A");
    expect(getBookmarks()[0]?.folder).toBe(COMPLETED_FOLDER);
  });

  it("does nothing when the setting is off", () => {
    seed({ autoArchive: false });
    expect(maybeAutoArchive("a")).toBeNull();
    expect(getBookmarks()[0]?.folder).toBeUndefined();
  });

  it("does nothing while episodes remain", () => {
    seed({ watched: [1] });
    expect(maybeAutoArchive("a")).toBeNull();
  });

  it("does nothing without a known total", () => {
    store.kokunime_progress = JSON.stringify([{ slug: "a", watched: [1, 2], updatedAt: 1 }]);
    const settings = JSON.parse(store.kokunime_user_settings ?? "{}");
    store.kokunime_user_settings = JSON.stringify({ ...settings, autoArchive: true });
    expect(maybeAutoArchive("a")).toBeNull();
  });

  it("is a no-op when the bookmark is already archived", () => {
    seed({ folder: COMPLETED_FOLDER });
    expect(maybeAutoArchive("a")).toBeNull();
  });
});

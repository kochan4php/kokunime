import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  DEFAULT_SETTINGS,
  getStoredSettings,
  saveSettings,
  applySettingsToDom,
  calculateStorageBreakdown,
  exportAllAppData,
  importAllAppData,
  mergeSettings,
} from "@/utils/settings";

describe("settings utility", () => {
  let store: Record<string, string> = {};
  let osDark = false;
  const mockRoot = {
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
  };
  // theme-color meta pair the browser chrome uses (media-scoped).
  const makeMeta = (initial: string) => {
    const state = { media: initial };
    return {
      state,
      dataset: {} as Record<string, string>,
      getAttribute: (name: string) => (name === "media" ? state.media : null),
      setAttribute: (name: string, value: string) => {
        if (name === "media") state.media = value;
      },
    };
  };
  let darkMeta = makeMeta("(prefers-color-scheme: dark)");
  let lightMeta = makeMeta("(prefers-color-scheme: light)");

  beforeEach(() => {
    store = {};
    osDark = false;
    darkMeta = makeMeta("(prefers-color-scheme: dark)");
    lightMeta = makeMeta("(prefers-color-scheme: light)");
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
      matchMedia: () => ({
        matches: osDark,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    vi.stubGlobal("document", {
      documentElement: mockRoot,
      querySelectorAll: () => [darkMeta, lightMeta],
    });
  });

  it("returns default settings when storage is empty", () => {
    const settings = getStoredSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it("saves and retrieves settings correctly", () => {
    const custom = {
      ...DEFAULT_SETTINGS,
      language: "en" as const,
      accent: "cyan" as const,
      font: "sans" as const,
      downloadLayout: "matrix" as const,
      nightShift: true,
    };
    saveSettings(custom);
    const retrieved = getStoredSettings();
    expect(retrieved.language).toBe("en");
    expect(retrieved.accent).toBe("cyan");
    expect(retrieved.font).toBe("sans");
    expect(retrieved.downloadLayout).toBe("matrix");
    expect(retrieved.nightShift).toBe(true);
  });

  it("applies settings attributes to DOM root element", () => {
    applySettingsToDom({
      ...DEFAULT_SETTINGS,
      language: "en",
      accent: "emerald",
      fontSize: "large",
      reduceMotion: true,
      readingMode: "sepia",
    });

    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-accent", "emerald");
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-font-size", "large");
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-reduce-motion", "true");
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-reading-mode", "sepia");
  });

  it("resolves the theme and pins the browser chrome to it", () => {
    applySettingsToDom({ ...DEFAULT_SETTINGS, theme: "dark" });
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-theme", "dark");
    expect(darkMeta.state.media).toBe("all");
    expect(lightMeta.state.media).toBe("not all");

    // Explicit light beats an OS that prefers dark.
    osDark = true;
    applySettingsToDom({ ...DEFAULT_SETTINGS, theme: "light" });
    expect(mockRoot.removeAttribute).toHaveBeenCalledWith("data-theme");
    expect(darkMeta.state.media).toBe("not all");
    expect(lightMeta.state.media).toBe("all");

    // System follows the OS.
    applySettingsToDom({ ...DEFAULT_SETTINGS, theme: "system" });
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-theme", "dark");
    expect(darkMeta.state.media).toBe("(prefers-color-scheme: dark)");
    expect(lightMeta.state.media).toBe("(prefers-color-scheme: light)");
  });

  it("calculates storage breakdown accurately", () => {
    store.kokunime_bookmarks = JSON.stringify([{ slug: "one-piece", title: "One Piece" }]);
    store.kokunime_watch_history = JSON.stringify([{ slug: "bleach", title: "Bleach" }]);
    store.kokunime_recent_searches = JSON.stringify(["naruto", "jujutsu"]);

    const breakdown = calculateStorageBreakdown();
    expect(breakdown.bookmarksCount).toBe(1);
    expect(breakdown.historyCount).toBe(1);
    expect(breakdown.searchHistoryCount).toBe(2);
    expect(breakdown.totalBytes).toBeGreaterThan(0);
  });

  it("exports and imports all app data accurately", () => {
    store.kokunime_bookmarks = JSON.stringify([{ slug: "naruto" }]);
    const exportedJson = exportAllAppData();
    expect(exportedJson).toContain("Kokunime");
    expect(exportedJson).toContain("naruto");

    store = {};
    const success = importAllAppData(exportedJson);
    expect(success).toBe(true);
    expect(store.kokunime_bookmarks).toContain("naruto");
  });

  it("rejects malformed storage breakdown JSON without throwing", () => {
    store.kokunime_bookmarks = "{broken";
    const breakdown = calculateStorageBreakdown();
    expect(breakdown.bookmarksCount).toBe(0);
  });

  it("merges only validated settings from untrusted input", () => {
    const applied = mergeSettings({
      accent: "violet",
      weeklyGoal: 250,
      nightShift: "yes",
      font: "comic-sans",
      bogus: true,
    });
    expect(applied).toBe(true);
    const stored = getStoredSettings();
    expect(stored.accent).toBe("violet");
    expect(stored.weeklyGoal).toBe(99);
    expect(stored.nightShift).toBe(false);
    expect(stored.font).toBe(DEFAULT_SETTINGS.font);
  });

  it("rejects non-object sync payloads", () => {
    expect(mergeSettings(null)).toBe(false);
    expect(mergeSettings("accent")).toBe(false);
  });
});

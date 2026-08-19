import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  DEFAULT_SETTINGS,
  getStoredSettings,
  saveSettings,
  applySettingsToDom,
  calculateStorageBreakdown,
  exportAllAppData,
  importAllAppData,
} from "@/utils/settings";

describe("settings utility", () => {
  let store: Record<string, string> = {};
  const mockClassList = {
    add: vi.fn(),
    remove: vi.fn(),
    toggle: vi.fn(),
  };
  const mockRoot = {
    classList: mockClassList,
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
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
      matchMedia: () => ({ matches: false }),
    });
    vi.stubGlobal("document", {
      documentElement: mockRoot,
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
      theme: "oled" as const,
      accent: "cyan" as const,
      font: "sans" as const,
      downloadLayout: "matrix" as const,
      nightShift: true,
    };
    saveSettings(custom);
    const retrieved = getStoredSettings();
    expect(retrieved.language).toBe("en");
    expect(retrieved.theme).toBe("oled");
    expect(retrieved.accent).toBe("cyan");
    expect(retrieved.font).toBe("sans");
    expect(retrieved.downloadLayout).toBe("matrix");
    expect(retrieved.nightShift).toBe(true);
  });

  it("applies settings attributes to DOM root element", () => {
    applySettingsToDom({
      ...DEFAULT_SETTINGS,
      language: "en",
      theme: "dark",
      accent: "emerald",
      fontSize: "large",
      reduceMotion: true,
      glassEffects: false,
      readingMode: "sepia",
    });

    expect(mockClassList.add).toHaveBeenCalledWith("dark");
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-accent", "emerald");
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-font-size", "large");
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-reduce-motion", "true");
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-glass", "false");
    expect(mockRoot.setAttribute).toHaveBeenCalledWith("data-reading-mode", "sepia");
  });

  it("calculates storage breakdown accurately", () => {
    store.kokunime_bookmarks = JSON.stringify([{ slug: "one-piece", title: "One Piece" }]);
    store.kokunime_watch_history = JSON.stringify([{ slug: "bleach", title: "Bleach" }]);
    store.kokunime_search_history = JSON.stringify(["naruto", "jujutsu"]);

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
});

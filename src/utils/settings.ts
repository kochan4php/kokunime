"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/utils/storage-keys";

export type AppLanguage = "id" | "en";
type AccentColor = "orange" | "emerald" | "violet" | "cyan" | "rose" | "amber";
export type FontFamily = "sans" | "mono" | "serif";
export type FontSize = "compact" | "normal" | "large";
export type CardDensity = "comfortable" | "compact";
export type ReadingMode = "none" | "sepia" | "high-contrast";
type DefaultViewMode = "grid" | "list";
type DownloadLayoutMode = "cards" | "matrix";

export interface AppSettings {
  language: AppLanguage;
  accent: AccentColor;
  font: FontFamily;
  fontSize: FontSize;
  density: CardDensity;
  nightShift: boolean;
  reduceMotion: boolean;
  readingMode: ReadingMode;
  defaultView: DefaultViewMode;
  downloadLayout: DownloadLayoutMode;
  dataSaver: boolean;
  hideSpoilers: boolean;
  autoMarkWatched: boolean;
  autoArchive: boolean;
  weeklyGoal: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
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
  autoArchive: false,
  weeklyGoal: 0,
};

export const ACCENT_PRESETS: { key: AccentColor; label: string; color: string; desc: string }[] = [
  { key: "orange", label: "Sunset Orange", color: "#ff6a33", desc: "Hangat & Ikonik Kokunime" },
  { key: "emerald", label: "Emerald Green", color: "#10b981", desc: "Segar & Modern" },
  { key: "violet", label: "Mystic Violet", color: "#8b5cf6", desc: "Futuristik & Elegan" },
  { key: "cyan", label: "Cyber Cyan", color: "#06b6d4", desc: "Cyberpunk & Tajam" },
  { key: "rose", label: "Neon Rose", color: "#f43f5e", desc: "Berani & Kontras Tinggi" },
  { key: "amber", label: "Golden Amber", color: "#f59e0b", desc: "Emas Hangat & Klasik" },
];

const SETTINGS_STORAGE_KEY = STORAGE_KEYS.userSettings;
export const SETTINGS_CHANGE_EVENT = STORAGE_KEYS.settingsChanged;

let cachedSettingsRaw: string | null = null;
let cachedSettingsObject: AppSettings = DEFAULT_SETTINGS;

export const getStoredSettings = (): AppSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      const legacyLang = localStorage.getItem(STORAGE_KEYS.lang) as AppLanguage;
      const legacyAccent = localStorage.getItem(STORAGE_KEYS.accent) as AccentColor;
      const legacyFont = localStorage.getItem(STORAGE_KEYS.font) as FontFamily;
      const legacyNightShift = localStorage.getItem(STORAGE_KEYS.nightShift) === "true";

      const legacyFingerprint = `legacy:${legacyLang}_${legacyAccent}_${legacyFont}_${legacyNightShift}`;
      if (cachedSettingsRaw === legacyFingerprint) {
        return cachedSettingsObject;
      }

      cachedSettingsRaw = legacyFingerprint;
      cachedSettingsObject = {
        ...DEFAULT_SETTINGS,
        language: legacyLang === "en" ? "en" : "id",
        accent: legacyAccent || DEFAULT_SETTINGS.accent,
        font: legacyFont || DEFAULT_SETTINGS.font,
        nightShift: legacyNightShift,
      };
      return cachedSettingsObject;
    }

    if (raw === cachedSettingsRaw) {
      return cachedSettingsObject;
    }

    cachedSettingsRaw = raw;
    cachedSettingsObject = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    return cachedSettingsObject;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const applySettingsToDom = (settings: AppSettings): void => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  // 0. Language
  const lang = settings.language || "id";
  root.lang = lang;
  localStorage.setItem(STORAGE_KEYS.lang, lang);
  window.dispatchEvent(new CustomEvent("kokunime:lang_change", { detail: { language: lang } }));

  // 1. Accent
  if (settings.accent === "orange") {
    root.removeAttribute("data-accent");
    localStorage.removeItem(STORAGE_KEYS.accent);
  } else {
    root.setAttribute("data-accent", settings.accent);
    localStorage.setItem(STORAGE_KEYS.accent, settings.accent);
  }

  // 2. Font
  if (settings.font === "mono") {
    root.removeAttribute("data-font");
    localStorage.removeItem(STORAGE_KEYS.font);
  } else {
    root.setAttribute("data-font", settings.font);
    localStorage.setItem(STORAGE_KEYS.font, settings.font);
  }

  // 3. Font Size
  if (settings.fontSize === "normal") {
    root.removeAttribute("data-font-size");
  } else {
    root.setAttribute("data-font-size", settings.fontSize);
  }

  // 3b. Card density (compact tightens catalog grids & list rows)
  if (settings.density === "compact") {
    root.setAttribute("data-density", "compact");
  } else {
    root.removeAttribute("data-density");
  }

  // 4. Night Shift
  if (settings.nightShift) {
    root.setAttribute("data-night-shift", "true");
    localStorage.setItem(STORAGE_KEYS.nightShift, "true");
  } else {
    root.removeAttribute("data-night-shift");
    localStorage.removeItem(STORAGE_KEYS.nightShift);
  }

  // 5. Reduce Motion
  if (settings.reduceMotion) {
    root.setAttribute("data-reduce-motion", "true");
  } else {
    root.removeAttribute("data-reduce-motion");
  }

  // 6. Reading Mode
  if (settings.readingMode === "none") {
    root.removeAttribute("data-reading-mode");
  } else {
    root.setAttribute("data-reading-mode", settings.readingMode);
  }
};

export const saveSettings = (newSettings: AppSettings): void => {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(newSettings);
    cachedSettingsRaw = raw;
    cachedSettingsObject = newSettings;
    localStorage.setItem(SETTINGS_STORAGE_KEY, raw);
    applySettingsToDom(newSettings);
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: newSettings }));
  } catch (err) {
    console.error("Failed to save settings to localStorage:", err);
  }
};

// Applies an untrusted partial settings object (share-link import) on top of
// the current settings, keeping only values that survive validation: the key
// must exist, the type must match the default, and strings must be a known
// enum value. Returns whether anything was applied.
const isKnownStringValue = (key: string, value: string): boolean => {
  if (key === "accent") return ACCENT_PRESETS.some((preset) => preset.key === value);
  return [
    "id",
    "en",
    "sans",
    "mono",
    "serif",
    "compact",
    "normal",
    "large",
    "comfortable",
    "none",
    "sepia",
    "high-contrast",
    "grid",
    "list",
    "cards",
    "matrix",
  ].includes(value);
};

export const mergeSettings = (partial: unknown): boolean => {
  if (!partial || typeof partial !== "object") return false;
  const current = getStoredSettings();
  const merged: Record<string, unknown> = { ...current };
  let applied = false;
  for (const [key, value] of Object.entries(partial as Record<string, unknown>)) {
    if (!(key in DEFAULT_SETTINGS)) continue;
    const expected = (DEFAULT_SETTINGS as unknown as Record<string, unknown>)[key];
    if (typeof value !== typeof expected) continue;
    if (typeof value === "string" && !isKnownStringValue(key, value)) continue;
    if (key === "weeklyGoal") merged[key] = Math.max(0, Math.min(99, Math.floor(Number(value) || 0)));
    else merged[key] = value;
    applied = true;
  }
  if (applied) saveSettings(merged as unknown as AppSettings);
  return applied;
};

export interface StorageBreakdown {
  bookmarksCount: number;
  bookmarksBytes: number;
  historyCount: number;
  historyBytes: number;
  searchHistoryCount: number;
  searchHistoryBytes: number;
  queueCount: number;
  queueBytes: number;
  marksCount: number;
  marksBytes: number;
  settingsBytes: number;
  totalBytes: number;
  formattedTotal: string;
}

export const calculateStorageBreakdown = (): StorageBreakdown => {
  if (typeof window === "undefined") {
    return {
      bookmarksCount: 0,
      bookmarksBytes: 0,
      historyCount: 0,
      historyBytes: 0,
      searchHistoryCount: 0,
      searchHistoryBytes: 0,
      queueCount: 0,
      queueBytes: 0,
      marksCount: 0,
      marksBytes: 0,
      settingsBytes: 0,
      totalBytes: 0,
      formattedTotal: "0 KB",
    };
  }

  const rawBookmarks = localStorage.getItem(STORAGE_KEYS.bookmarks) || "[]";
  const rawHistory = localStorage.getItem(STORAGE_KEYS.watchHistory) || "[]";
  const rawSearches = localStorage.getItem(STORAGE_KEYS.recentSearches) || "[]";
  const rawQueue = localStorage.getItem(STORAGE_KEYS.watchQueue) || "[]";
  const rawMarks = localStorage.getItem(STORAGE_KEYS.episodeLog) || "[]";
  const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}";

  const countOf = (raw: string): number => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  const bookmarksCount = countOf(rawBookmarks);
  const historyCount = countOf(rawHistory);
  const searchHistoryCount = countOf(rawSearches);
  const queueCount = countOf(rawQueue);
  const marksCount = countOf(rawMarks);

  const bookmarksBytes = new Blob([rawBookmarks]).size;
  const historyBytes = new Blob([rawHistory]).size;
  const searchHistoryBytes = new Blob([rawSearches]).size;
  const queueBytes = new Blob([rawQueue]).size;
  const marksBytes = new Blob([rawMarks]).size;
  const settingsBytes = new Blob([rawSettings]).size;
  const totalBytes = bookmarksBytes + historyBytes + searchHistoryBytes + queueBytes + marksBytes + settingsBytes;

  const formattedTotal =
    totalBytes > 1024 * 1024 ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB` : `${(totalBytes / 1024).toFixed(1)} KB`;

  return {
    bookmarksCount,
    bookmarksBytes,
    historyCount,
    historyBytes,
    searchHistoryCount,
    searchHistoryBytes,
    queueCount,
    queueBytes,
    marksCount,
    marksBytes,
    settingsBytes,
    totalBytes,
    formattedTotal,
  };
};

export const exportAllAppData = (): string => {
  if (typeof window === "undefined") return "{}";
  const data = {
    app: "Kokunime",
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    settings: getStoredSettings(),
    bookmarks: JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarks) || "[]"),
    history: JSON.parse(localStorage.getItem(STORAGE_KEYS.watchHistory) || "[]"),
    searches: JSON.parse(localStorage.getItem(STORAGE_KEYS.recentSearches) || "[]"),
    queue: JSON.parse(localStorage.getItem(STORAGE_KEYS.watchQueue) || "[]"),
    progress: JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || "[]"),
    episodeLog: JSON.parse(localStorage.getItem(STORAGE_KEYS.episodeLog) || "[]"),
    folderOrder: JSON.parse(localStorage.getItem(STORAGE_KEYS.folderOrder) || "[]"),
  };
  return JSON.stringify(data, null, 2);
};

export const importAllAppData = (jsonString: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") return false;

    if (parsed.settings) {
      saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
    }
    const writeArray = (key: string, value: unknown): void => {
      if (Array.isArray(value)) localStorage.setItem(key, JSON.stringify(value));
    };
    writeArray(STORAGE_KEYS.bookmarks, parsed.bookmarks);
    writeArray(STORAGE_KEYS.watchHistory, parsed.history);
    writeArray(STORAGE_KEYS.recentSearches, parsed.searches);
    writeArray(STORAGE_KEYS.watchQueue, parsed.queue);
    writeArray(STORAGE_KEYS.progress, parsed.progress);
    writeArray(STORAGE_KEYS.episodeLog, parsed.episodeLog);
    writeArray(STORAGE_KEYS.folderOrder, parsed.folderOrder);

    window.dispatchEvent(new Event("storage"));
    return true;
  } catch {
    return false;
  }
};

const subscribeSettings = (callback: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    cachedSettingsRaw = null;
    callback();
  };
  window.addEventListener(SETTINGS_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(SETTINGS_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

export const useSettings = (): AppSettings => {
  return useSyncExternalStore(subscribeSettings, getStoredSettings, () => DEFAULT_SETTINGS);
};

"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/utils/storage-keys";

export type AppLanguage = "id" | "en";
export type AccentColor = "orange" | "emerald" | "violet" | "cyan" | "rose" | "amber";
export type FontFamily = "sans" | "mono" | "serif";
export type FontSize = "compact" | "normal" | "large";
export type CardDensity = "comfortable" | "compact";
export type ReadingMode = "none" | "sepia" | "high-contrast";
export type DefaultViewMode = "grid" | "list";
export type DownloadLayoutMode = "cards" | "matrix";

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
};

export const ACCENT_PRESETS: { key: AccentColor; label: string; color: string; desc: string }[] = [
  { key: "orange", label: "Sunset Orange", color: "#ff6a33", desc: "Hangat & Ikonik Kokunime" },
  { key: "emerald", label: "Emerald Green", color: "#10b981", desc: "Segar & Modern" },
  { key: "violet", label: "Mystic Violet", color: "#8b5cf6", desc: "Futuristik & Elegan" },
  { key: "cyan", label: "Cyber Cyan", color: "#06b6d4", desc: "Cyberpunk & Tajam" },
  { key: "rose", label: "Neon Rose", color: "#f43f5e", desc: "Berani & Kontras Tinggi" },
  { key: "amber", label: "Golden Amber", color: "#f59e0b", desc: "Emas Hangat & Klasik" },
];

export const SETTINGS_STORAGE_KEY = STORAGE_KEYS.userSettings;
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

export interface StorageBreakdown {
  bookmarksCount: number;
  bookmarksBytes: number;
  historyCount: number;
  historyBytes: number;
  searchHistoryCount: number;
  searchHistoryBytes: number;
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
      settingsBytes: 0,
      totalBytes: 0,
      formattedTotal: "0 KB",
    };
  }

  const rawBookmarks = localStorage.getItem(STORAGE_KEYS.bookmarks) || "[]";
  const rawHistory = localStorage.getItem(STORAGE_KEYS.watchHistory) || "[]";
  const rawSearches = localStorage.getItem(STORAGE_KEYS.recentSearches) || "[]";
  const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}";

  const bookmarksCount = (JSON.parse(rawBookmarks) || []).length;
  const historyCount = (JSON.parse(rawHistory) || []).length;
  const searchHistoryCount = (JSON.parse(rawSearches) || []).length;

  const bookmarksBytes = new Blob([rawBookmarks]).size;
  const historyBytes = new Blob([rawHistory]).size;
  const searchHistoryBytes = new Blob([rawSearches]).size;
  const settingsBytes = new Blob([rawSettings]).size;
  const totalBytes = bookmarksBytes + historyBytes + searchHistoryBytes + settingsBytes;

  const formattedTotal =
    totalBytes > 1024 * 1024 ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB` : `${(totalBytes / 1024).toFixed(1)} KB`;

  return {
    bookmarksCount,
    bookmarksBytes,
    historyCount,
    historyBytes,
    searchHistoryCount,
    searchHistoryBytes,
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
    if (Array.isArray(parsed.bookmarks)) {
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(parsed.bookmarks));
    }
    if (Array.isArray(parsed.history)) {
      localStorage.setItem(STORAGE_KEYS.watchHistory, JSON.stringify(parsed.history));
    }
    if (Array.isArray(parsed.searches)) {
      localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(parsed.searches));
    }

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

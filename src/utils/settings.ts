"use client";

import { useSyncExternalStore } from "react";

export type AppLanguage = "id" | "en";
export type ThemeMode = "system" | "light" | "dark" | "oled";
export type AccentColor = "orange" | "emerald" | "violet" | "cyan" | "rose" | "amber";
export type FontFamily = "sans" | "mono" | "serif";
export type FontSize = "compact" | "normal" | "large";
export type ReadingMode = "none" | "sepia" | "high-contrast";
export type DefaultViewMode = "grid" | "list";
export type DownloadLayoutMode = "cards" | "matrix";

export interface AppSettings {
  language: AppLanguage;
  theme: ThemeMode;
  accent: AccentColor;
  font: FontFamily;
  fontSize: FontSize;
  nightShift: boolean;
  reduceMotion: boolean;
  glassEffects: boolean;
  readingMode: ReadingMode;
  defaultView: DefaultViewMode;
  downloadLayout: DownloadLayoutMode;
  dataSaver: boolean;
  hideSpoilers: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: "id",
  theme: "system",
  accent: "orange",
  font: "mono",
  fontSize: "normal",
  nightShift: false,
  reduceMotion: false,
  glassEffects: true,
  readingMode: "none",
  defaultView: "grid",
  downloadLayout: "cards",
  dataSaver: false,
  hideSpoilers: false,
};

export const ACCENT_PRESETS: { key: AccentColor; label: string; color: string; desc: string }[] = [
  { key: "orange", label: "Sunset Orange", color: "#ff6a33", desc: "Hangat & Ikonik Kokunime" },
  { key: "emerald", label: "Emerald Green", color: "#10b981", desc: "Segar & Modern" },
  { key: "violet", label: "Mystic Violet", color: "#8b5cf6", desc: "Futuristik & Elegan" },
  { key: "cyan", label: "Cyber Cyan", color: "#06b6d4", desc: "Cyberpunk & Tajam" },
  { key: "rose", label: "Neon Rose", color: "#f43f5e", desc: "Berani & Kontras Tinggi" },
  { key: "amber", label: "Golden Amber", color: "#f59e0b", desc: "Emas Hangat & Klasik" },
];

export const SETTINGS_STORAGE_KEY = "kokunime_user_settings";
export const SETTINGS_CHANGE_EVENT = "kokunime_settings_changed";

let cachedSettingsRaw: string | null = null;
let cachedSettingsObject: AppSettings = DEFAULT_SETTINGS;

export const getStoredSettings = (): AppSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      const legacyLang = localStorage.getItem("kokunime_lang") as AppLanguage;
      const legacyAccent = localStorage.getItem("kokunime_accent") as AccentColor;
      const legacyContrast = localStorage.getItem("kokunime_contrast");
      const legacyFont = localStorage.getItem("kokunime_font") as FontFamily;
      const legacyNightShift = localStorage.getItem("kokunime_night_shift") === "true";
      const legacyTheme = localStorage.getItem("theme");

      const legacyFingerprint = `legacy:${legacyLang}_${legacyAccent}_${legacyContrast}_${legacyFont}_${legacyNightShift}_${legacyTheme}`;
      if (cachedSettingsRaw === legacyFingerprint) {
        return cachedSettingsObject;
      }

      cachedSettingsRaw = legacyFingerprint;
      cachedSettingsObject = {
        ...DEFAULT_SETTINGS,
        language: legacyLang === "en" ? "en" : "id",
        accent: legacyAccent || DEFAULT_SETTINGS.accent,
        theme: legacyContrast === "oled" ? "oled" : legacyTheme === "dark" ? "dark" : legacyTheme === "light" ? "light" : "system",
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
  localStorage.setItem("kokunime_lang", lang);
  window.dispatchEvent(new CustomEvent("kokunime:lang_change", { detail: { language: lang } }));

  // 1. Theme & Contrast
  if (settings.theme === "oled") {
    root.classList.add("dark");
    root.setAttribute("data-contrast", "oled");
    localStorage.setItem("theme", "dark");
    localStorage.setItem("kokunime_contrast", "oled");
  } else if (settings.theme === "dark") {
    root.classList.add("dark");
    root.removeAttribute("data-contrast");
    localStorage.setItem("theme", "dark");
    localStorage.removeItem("kokunime_contrast");
  } else if (settings.theme === "light") {
    root.classList.remove("dark");
    root.removeAttribute("data-contrast");
    localStorage.setItem("theme", "light");
    localStorage.removeItem("kokunime_contrast");
  } else {
    // System
    root.removeAttribute("data-contrast");
    localStorage.removeItem("kokunime_contrast");
    localStorage.removeItem("theme");
    const isSysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isSysDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  // 2. Accent
  if (settings.accent === "orange") {
    root.removeAttribute("data-accent");
    localStorage.removeItem("kokunime_accent");
  } else {
    root.setAttribute("data-accent", settings.accent);
    localStorage.setItem("kokunime_accent", settings.accent);
  }

  // 3. Font
  if (settings.font === "mono") {
    root.removeAttribute("data-font");
    localStorage.removeItem("kokunime_font");
  } else {
    root.setAttribute("data-font", settings.font);
    localStorage.setItem("kokunime_font", settings.font);
  }

  // 4. Font Size
  if (settings.fontSize === "normal") {
    root.removeAttribute("data-font-size");
  } else {
    root.setAttribute("data-font-size", settings.fontSize);
  }

  // 5. Night Shift
  if (settings.nightShift) {
    root.setAttribute("data-night-shift", "true");
    localStorage.setItem("kokunime_night_shift", "true");
  } else {
    root.removeAttribute("data-night-shift");
    localStorage.removeItem("kokunime_night_shift");
  }

  // 6. Reduce Motion
  if (settings.reduceMotion) {
    root.setAttribute("data-reduce-motion", "true");
  } else {
    root.removeAttribute("data-reduce-motion");
  }

  // 7. Glass Effects
  if (!settings.glassEffects) {
    root.setAttribute("data-glass", "false");
  } else {
    root.removeAttribute("data-glass");
  }

  // 8. Reading Mode
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

  const rawBookmarks = localStorage.getItem("kokunime_bookmarks") || "[]";
  const rawHistory = localStorage.getItem("kokunime_watch_history") || "[]";
  const rawSearches = localStorage.getItem("kokunime_search_history") || "[]";
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
    totalBytes > 1024 * 1024
      ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(totalBytes / 1024).toFixed(1)} KB`;

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
    bookmarks: JSON.parse(localStorage.getItem("kokunime_bookmarks") || "[]"),
    history: JSON.parse(localStorage.getItem("kokunime_watch_history") || "[]"),
    searches: JSON.parse(localStorage.getItem("kokunime_search_history") || "[]"),
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
      localStorage.setItem("kokunime_bookmarks", JSON.stringify(parsed.bookmarks));
    }
    if (Array.isArray(parsed.history)) {
      localStorage.setItem("kokunime_watch_history", JSON.stringify(parsed.history));
    }
    if (Array.isArray(parsed.searches)) {
      localStorage.setItem("kokunime_search_history", JSON.stringify(parsed.searches));
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
  return useSyncExternalStore(
    subscribeSettings,
    getStoredSettings,
    () => DEFAULT_SETTINGS
  );
};

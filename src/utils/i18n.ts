"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/utils/storage-keys";

export type AppLanguage = "id" | "en";

const LANG_STORAGE_KEY = STORAGE_KEYS.lang;
const LANG_CHANGE_EVENT = "kokunime:lang_change";

import { DICTIONARY } from "@/utils/i18n/dictionary";

export { DICTIONARY } from "@/utils/i18n/dictionary";

export type TranslationKey = keyof typeof DICTIONARY.id;

function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "id";
  try {
    const direct = localStorage.getItem(LANG_STORAGE_KEY) as AppLanguage;
    if (direct === "en" || direct === "id") return direct;

    const userSettings = localStorage.getItem(STORAGE_KEYS.userSettings);
    if (userSettings) {
      const parsed = JSON.parse(userSettings);
      if (parsed.language === "en" || parsed.language === "id") return parsed.language;
    }
  } catch {}
  return "id";
}

function setStoredLanguage(lang: AppLanguage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    // Sync with kokunime_user_settings
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.userSettings) || "{}");
      localStorage.setItem(STORAGE_KEYS.userSettings, JSON.stringify({ ...existing, language: lang }));
    } catch {}

    window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: { language: lang } }));
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LANG_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANG_CHANGE_EVENT, callback);
  };
}

export function useTranslation() {
  const language = useSyncExternalStore(subscribe, getStoredLanguage, () => "id" as AppLanguage);

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = DICTIONARY[language] || DICTIONARY.id;
    return (dict as Record<string, string>)[key] || (DICTIONARY.id as Record<string, string>)[key] || fallback || key;
  };

  return { language, setLanguage: setStoredLanguage, t };
}

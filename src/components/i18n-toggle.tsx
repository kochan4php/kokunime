"use client";

import { JSX, useSyncExternalStore } from "react";

const LANG_STORAGE_KEY = "kokunime_lang";

export type LangCode = "id" | "en";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("kokunime:lang_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("kokunime:lang_change", callback);
  };
}

function getSnapshot(): LangCode {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as LangCode;
    return saved === "en" || saved === "id" ? saved : "id";
  } catch {
    return "id";
  }
}

function getServerSnapshot(): LangCode {
  return "id";
}

export const I18nToggle = (): JSX.Element => {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const switchLang = (target: LangCode) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, target);
      document.documentElement.lang = target;
      window.dispatchEvent(new CustomEvent("kokunime:lang_change", { detail: { lang: target } }));
    } catch {}
  };

  return (
    <div className="flex items-center rounded-full border border-border bg-surface p-0.5 font-mono text-[10px]">
      <button
        type="button"
        onClick={() => switchLang("id")}
        title="Ganti bahasa ke Bahasa Indonesia"
        className={`rounded-full px-2 py-0.5 font-bold transition-colors cursor-pointer ${
          lang === "id" ? "bg-accent text-(--accent-ink)" : "text-ink-muted hover:text-ink"
        }`}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => switchLang("en")}
        title="Switch language to English"
        className={`rounded-full px-2 py-0.5 font-bold transition-colors cursor-pointer ${
          lang === "en" ? "bg-accent text-(--accent-ink)" : "text-ink-muted hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
};


"use client";

import { STORAGE_KEYS } from "@/utils/storage-keys";
import { useTranslation } from "@/utils/i18n";
import { JSX, useEffect, useState } from "react";

const STORAGE_KEY = STORAGE_KEYS.firstVisitTips;

// One-time orientation card on the home page. Dismissal is local and permanent
// (the empty states keep teaching after this disappears).
const FirstVisitTips = (): JSX.Element | null => {
  const [visible, setVisible] = useState(false);
  const { language } = useTranslation();
  const en = language === "en";

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) === null);
    } catch {
      setVisible(false);
    }
  }, []);

  const dismiss = (): void => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage blocked: hide for this page view only.
    }
  };

  if (!visible) return null;

  return (
    <section aria-labelledby="first-visit-title" className="container px-4 pt-6">
      <div className="card-shell">
        <div className="card-core p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                {en ? "Quick start" : "Panduan singkat"}
              </p>
              <h2 id="first-visit-title" className="font-display text-lg font-bold text-ink">
                {en ? "First time here?" : "Baru di Kokunime?"}
              </h2>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label={en ? "Dismiss quick start" : "Tutup panduan singkat"}
              className="rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-xs text-ink-muted hover:text-ink cursor-pointer"
            >
              ✕
            </button>
          </div>
          <ul className="mt-3 grid gap-2 text-xs text-ink sm:grid-cols-3">
            <li className="rounded-sm border-2 border-border bg-surface-solid p-2.5">
              <kbd className="rounded-sm border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">Ctrl K</kbd>{" "}
              {en ? "search + quick actions" : "cari + aksi cepat"}
            </li>
            <li className="rounded-sm border-2 border-border bg-surface-solid p-2.5">
              🔖 {en ? "Save titles and group them into folders" : "Simpan judul dan kelompokkan ke folder"}
            </li>
            <li className="rounded-sm border-2 border-border bg-surface-solid p-2.5">
              📴 {en ? "Save pages offline from any detail page" : "Simpan halaman offline dari halaman detail"}
            </li>
          </ul>
          <button
            type="button"
            onClick={dismiss}
            className="mt-3 rounded-sm border-2 border-border bg-accent px-4 py-2 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
          >
            {en ? "Got it, start browsing" : "Mengerti, mulai jelajah"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FirstVisitTips;

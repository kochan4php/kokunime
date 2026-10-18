"use client";

import MainLayout from "@/layouts/main-layout";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { useTranslation } from "@/utils/i18n";
import {
  listSavedOffline,
  removeOfflineEntry,
  subscribeOfflineSaved,
  type SavedOfflineEntry,
} from "@/utils/offline-saved";

const OfflinePage = (): JSX.Element => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<SavedOfflineEntry[]>([]);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      const list = await listSavedOffline();
      if (active) setEntries(list);
    };
    refresh();
    const unsubscribe = subscribeOfflineSaved(refresh);

    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);

    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  const remove = async (url: string): Promise<void> => {
    await removeOfflineEntry(url);
    setEntries((prev) => prev.filter((entry) => entry.url !== url));
  };

  return (
    <MainLayout>
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-sm border-2 border-border bg-nb-orange text-nb-ink shadow-[4px_4px_0_0_var(--border)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
            {t("offline.title")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("offline.desc")}</p>
          <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-wide">
            <span className={online ? "text-nb-lime" : "text-nb-orange"}>
              ● {online ? t("offline.online") : t("offline.offline")}
            </span>
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/bookmarks" className="btn-primary w-full sm:w-auto">
              {t("offline.open_bookmarks")}
            </Link>
            <button type="button" onClick={() => window.location.reload()} className="btn-secondary w-full sm:w-auto">
              {t("offline.retry")}
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <h2 className="mb-4 font-display text-lg font-extrabold uppercase tracking-tight text-ink">
            {t("offline.saved_title")}
          </h2>
          {entries.length === 0 ? (
            <p className="rounded-sm border-2 border-border bg-surface p-4 text-sm text-ink-muted shadow-[2px_2px_0_0_var(--border)]">
              {t("offline.saved_empty")}
            </p>
          ) : (
            <ul className="space-y-2">
              {entries.map((entry) => (
                <li
                  key={entry.url}
                  className="flex items-center justify-between gap-3 rounded-sm border-2 border-border bg-surface p-3 shadow-[2px_2px_0_0_var(--border)]"
                >
                  <Link href={entry.url} className="min-w-0 truncate text-sm font-bold text-ink hover:text-accent-text">
                    {entry.title || entry.url}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(entry.url)}
                    className="shrink-0 rounded-sm border-2 border-border bg-surface px-2 py-0.5 font-mono text-[11px] font-bold text-ink transition-colors hover:bg-nb-red"
                  >
                    {t("offline.remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default OfflinePage;

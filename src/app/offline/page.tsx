"use client";

import MainLayout from "@/layouts/main-layout";
import Link from "next/link";
import { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/utils/i18n";
import { searchLocalCatalog } from "@/utils/local-catalog";
import {
  clearRollingCache,
  estimateOfflineBatch,
  isQuotaTight,
  listSavedOffline,
  refreshOfflineSaved,
  removeOfflineEntry,
  saveOfflineBatch,
  setOfflinePinned,
  subscribeOfflineSaved,
  type RollingCacheKind,
  type SavedOfflineEntry,
} from "@/utils/offline-saved";
import { showToast } from "@/utils/toast";

// Relative age of a saved copy (last refresh wins over save time).
const formatAge = (timestamp: number, language: string): string => {
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  const minutes = Math.round((timestamp - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  return formatter.format(Math.round(hours / 24), "day");
};

const OfflinePage = (): JSX.Element => {
  const { t, language } = useTranslation();
  const [entries, setEntries] = useState<SavedOfflineEntry[]>([]);
  const [online, setOnline] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [storageText, setStorageText] = useState("");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<{ done: number; total: number } | null>(null);
  const [quotaWarning, setQuotaWarning] = useState(false);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      const list = await listSavedOffline();
      if (active) setEntries(list);
      navigator.storage
        ?.estimate?.()
        .then((estimate) => {
          if (!active || !estimate?.quota) return;
          setQuotaWarning(isQuotaTight(estimate.usage ?? 0, estimate.quota));
          if (estimate.usage) setStorageText(`${(estimate.usage / 1024 / 1024).toFixed(1)} MB`);
        })
        .catch(() => {
          // Estimate unsupported — the line simply stays hidden.
        });
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

  const results = useMemo(() => {
    const trimmed = query.trim();
    return trimmed ? searchLocalCatalog(trimmed, 8).items : [];
  }, [query]);
  const savedUrls = useMemo(() => new Set(entries.map((entry) => entry.url)), [entries]);

  const remove = async (url: string): Promise<void> => {
    await removeOfflineEntry(url);
    setEntries((prev) => prev.filter((entry) => entry.url !== url));
  };

  const togglePin = async (entry: SavedOfflineEntry): Promise<void> => {
    const ok = await setOfflinePinned(entry.url, !entry.pinned);
    if (!ok) return;
    setEntries((prev) => prev.map((item) => (item.url === entry.url ? { ...item, pinned: !entry.pinned } : item)));
  };

  const saveResults = async (): Promise<void> => {
    if (saving || results.length === 0) return;
    const estimate = await estimateOfflineBatch(results.length);
    const targets = results.slice(0, estimate.affordable);
    if (targets.length === 0) {
      showToast(t("offline.quota_full"));
      return;
    }
    setSaving({ done: 0, total: targets.length });
    try {
      const saved = await saveOfflineBatch(targets, (done, total) => setSaving({ done, total }));
      setEntries(await listSavedOffline());
      showToast(saved > 0 ? t("offline.save_all_done") : t("offline.failed_toast"));
      if (targets.length < results.length || saved < targets.length) showToast(t("offline.save_all_limited"));
    } finally {
      setSaving(null);
    }
  };

  const clearCache = async (kind: RollingCacheKind): Promise<void> => {
    const cleared = await clearRollingCache(kind);
    showToast(cleared > 0 ? t("offline.cache_cleared") : t("offline.cache_already_clear"));
  };

  const refreshEntries = useCallback(
    async (url?: string): Promise<void> => {
      if (busy) return;
      setBusy(url ?? "all");
      try {
        const ok = await refreshOfflineSaved(url);
        showToast(ok ? t("offline.refreshed_toast") : t("offline.refresh_failed_toast"));
        if (ok) setEntries(await listSavedOffline());
      } finally {
        setBusy(null);
      }
    },
    [busy, t],
  );

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
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
            {t("offline.search_title")}
          </h2>
          <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-muted">{t("offline.search_hint")}</p>
          <label htmlFor="offline-search" className="sr-only">
            {t("offline.search_title")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="offline-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("offline.search_placeholder")}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-sm border-2 border-border bg-surface px-3 py-2 font-mono text-xs text-ink placeholder:text-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-text"
            />
            <button
              type="button"
              onClick={() => void saveResults()}
              disabled={!online || results.length === 0 || saving !== null}
              className="inline-flex min-h-9 items-center justify-center rounded-sm border-2 border-border bg-nb-lime px-3 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? `${t("offline.saving")} ${saving.done}/${saving.total}`
                : `${t("offline.save_all")} (${results.length})`}
            </button>
          </div>
          {query.trim() !== "" && results.length === 0 && (
            <p className="mt-3 rounded-sm border-2 border-border bg-surface px-3 py-2 text-xs text-ink-muted">
              {t("offline.search_empty")}
            </p>
          )}
          {results.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {results.map((item) => {
                const url = `/anime/${item.slug}`;
                return (
                  <li
                    key={item.slug}
                    className="flex items-center justify-between gap-2 rounded-sm border-2 border-border bg-surface px-2.5 py-1.5"
                  >
                    <Link
                      href={url}
                      className="min-w-0 truncate text-xs font-bold text-ink transition-colors hover:text-accent-text"
                    >
                      {item.title}
                    </Link>
                    {savedUrls.has(url) ? (
                      <span className="shrink-0 rounded-sm border border-border bg-nb-lime px-1.5 font-mono text-[10px] font-bold text-nb-ink">
                        {t("offline.saved_badge")}
                      </span>
                    ) : (
                      <span className="shrink-0 font-mono text-[10px] text-ink-muted">{item.release}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
              {t("offline.saved_title")}
            </h2>
            {entries.length > 0 && (
              <button
                type="button"
                onClick={() => refreshEntries()}
                disabled={!online || busy === "all"}
                className="inline-flex min-h-6 items-center rounded-sm border-2 border-border bg-surface px-2 font-mono text-[11px] font-bold text-ink transition-colors hover:bg-nb-yellow hover:text-nb-ink disabled:opacity-60"
              >
                {busy === "all" ? t("offline.refreshing") : t("offline.refresh_all")}
              </button>
            )}
          </div>
          {storageText && (
            <p className="mb-2 font-mono text-[11px] text-ink-muted">
              {t("offline.storage_used")} · {storageText}
            </p>
          )}
          <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span className="text-ink-muted">{t("offline.clear_cache")}:</span>
            <button
              type="button"
              onClick={() => void clearCache("pages")}
              className="inline-flex min-h-6 items-center rounded-sm border border-border bg-surface px-1.5 font-bold text-ink-muted transition-colors hover:bg-nb-yellow hover:text-nb-ink"
            >
              {t("offline.clear_pages")}
            </button>
            <button
              type="button"
              onClick={() => void clearCache("api")}
              className="inline-flex min-h-6 items-center rounded-sm border border-border bg-surface px-1.5 font-bold text-ink-muted transition-colors hover:bg-nb-yellow hover:text-nb-ink"
            >
              {t("offline.clear_api")}
            </button>
          </div>
          {quotaWarning && (
            <p className="mb-3 rounded-sm border-2 border-border bg-nb-orange px-3 py-2 text-xs font-bold text-nb-ink">
              {t("offline.quota_warning")}
            </p>
          )}
          {entries.length === 0 ? (
            <p className="rounded-sm border-2 border-border bg-surface p-4 text-sm text-ink-muted shadow-[2px_2px_0_0_var(--border)]">
              {t("offline.saved_empty")}
            </p>
          ) : (
            <ul className="space-y-2">
              {entries.map((entry) => (
                <li
                  key={entry.url}
                  className="rounded-sm border-2 border-border bg-surface p-3 shadow-[2px_2px_0_0_var(--border)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={entry.url}
                      className="min-w-0 truncate text-sm font-bold text-ink hover:text-accent-text"
                    >
                      {entry.title || entry.url}
                    </Link>
                    <span className="shrink-0 font-mono text-[10px] text-ink-muted">
                      {formatAge(entry.refreshedAt ?? entry.addedAt, language)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void togglePin(entry)}
                      aria-pressed={Boolean(entry.pinned)}
                      className="inline-flex min-h-6 items-center rounded-sm border-2 border-border bg-surface px-2 font-mono text-[11px] font-bold text-ink transition-colors hover:bg-nb-lime hover:text-nb-ink"
                    >
                      {entry.pinned ? t("offline.unpin") : t("offline.pin")}
                    </button>
                    <button
                      type="button"
                      onClick={() => refreshEntries(entry.url)}
                      disabled={!online || busy === entry.url}
                      className="inline-flex min-h-6 items-center rounded-sm border-2 border-border bg-surface px-2 font-mono text-[11px] font-bold text-ink transition-colors hover:bg-nb-lime hover:text-nb-ink disabled:opacity-60"
                    >
                      {busy === entry.url ? t("offline.refreshing") : t("offline.refresh")}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(entry.url)}
                      className="inline-flex min-h-6 items-center rounded-sm border-2 border-border bg-surface px-2 font-mono text-[11px] font-bold text-ink transition-colors hover:bg-nb-red hover:text-nb-ink"
                    >
                      {t("offline.remove")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {entries.length > 0 && (
            <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-muted">{t("offline.eviction_note")}</p>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default OfflinePage;

"use client";

import { Anime } from "@/interfaces";
import { getCatalogSnapshot, recordCatalogItems, searchLocalCatalog, subscribeCatalog } from "@/utils/local-catalog";
import { highlightSegments } from "@/utils/fuzzy";
import { queryUsesLocalOnlyFilters } from "@/utils/query-syntax";
import { checkSavedSearches, isSearchSaved, subscribeSavedSearches, toggleSavedSearch } from "@/utils/saved-searches";
import { showToast } from "@/utils/toast";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { JSX, useEffect, useMemo, useState, useSyncExternalStore } from "react";

interface SearchLocalPanelProps {
  query: string;
  serverResults: Anime[];
}

const NO_SNAPSHOT: never[] = [];

// Below the upstream search results: what the device-local catalog knows about
// this query — instant, offline-capable, with facet counts, a spelling hint and
// the saved-search toggle. Score/studio filters only exist for titles whose
// detail page was opened, and the copy says so instead of pretending otherwise.
const SearchLocalPanel = ({ query, serverResults }: SearchLocalPanelProps): JSX.Element => {
  const { language } = useTranslation();
  const en = language === "en";
  const baseQuery = useMemo(() => query.split("+").join(" ").trim(), [query]);
  const catalog = useSyncExternalStore(subscribeCatalog, getCatalogSnapshot, () => NO_SNAPSHOT);
  const saved = useSyncExternalStore(
    subscribeSavedSearches,
    () => isSearchSaved(baseQuery),
    () => false,
  );

  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [activeYears, setActiveYears] = useState<string[]>([]);
  const [minScore, setMinScore] = useState("");
  const [studio, setStudio] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (recordCatalogItems(serverResults) > 0) checkSavedSearches();
  }, [serverResults]);

  // New search = new filter context.
  useEffect(() => {
    setActiveGenres([]);
    setActiveYears([]);
    setMinScore("");
    setStudio("");
    setExpanded(false);
  }, [baseQuery]);

  const effectiveQuery = useMemo(() => {
    const parts = [baseQuery];
    if (activeGenres.length > 0) parts.push(`genre:${activeGenres.join(",")}`);
    if (activeYears.length > 0) parts.push(`tahun:${activeYears.join(",")}`);
    if (minScore.trim()) parts.push(`skor:${minScore.trim()}`);
    if (studio.trim()) parts.push(`studio:${studio.trim()}`);
    return parts.filter(Boolean).join(" ");
  }, [baseQuery, activeGenres, activeYears, minScore, studio]);

  const result = useMemo(() => searchLocalCatalog(effectiveQuery, 24), [effectiveQuery, catalog]);
  const localOnly = queryUsesLocalOnlyFilters(effectiveQuery);
  const showList = expanded || serverResults.length === 0 || localOnly;

  const toggle = (value: string, list: string[], setList: (next: string[]) => void): void => {
    setList(list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value]);
  };

  return (
    <div className="card-shell mt-8">
      <div className="card-core space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="chip">
            🔎 {en ? "Local catalog" : "Katalog lokal"}
            <span className="ml-1 text-ink-muted" aria-live="polite">
              ({catalog.length})
            </span>
          </span>
          {baseQuery.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const nowSaved = toggleSavedSearch(baseQuery);
                showToast(
                  nowSaved
                    ? en
                      ? `Search “${baseQuery}” saved — new matches land in your inbox.`
                      : `Pencarian “${baseQuery}” disimpan — hasil baru masuk ke inbox.`
                    : en
                      ? `Search “${baseQuery}” removed from saved searches.`
                      : `Pencarian “${baseQuery}” dihapus dari pencarian tersimpan.`,
                );
              }}
              aria-pressed={saved}
              className={`rounded-sm border-2 border-border px-2.5 py-1 font-mono text-[11px] font-bold shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer ${
                saved ? "bg-nb-lime text-nb-ink" : "bg-surface text-ink"
              }`}
            >
              {saved ? (en ? "✓ Search saved" : "✓ Pencarian tersimpan") : en ? "Save search" : "Simpan pencarian"}
            </button>
          )}
        </div>

        <p className="text-xs leading-relaxed text-ink-muted">
          {en
            ? "Titles this device has already seen (listings, searches, detail pages) plus whatever the server index knows. Works offline and answers instantly."
            : "Judul yang sudah pernah terlihat di perangkat ini (daftar, pencarian, halaman detail) plus yang diketahui indeks server. Tetap bekerja offline dan menjawab instan."}
        </p>

        {(result.facets.genres.length > 0 || result.facets.years.length > 0) && (
          <div className="space-y-2">
            {result.facets.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  {en ? "Genre" : "Genre"}
                </span>
                {result.facets.genres.map((facet) => {
                  const value = facet.name.toLowerCase();
                  const active = activeGenres.includes(value);
                  return (
                    <button
                      key={facet.name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(value, activeGenres, setActiveGenres)}
                      className={`rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] transition-colors cursor-pointer ${
                        active ? "bg-nb-teal text-nb-ink" : "bg-surface-muted text-ink-muted hover:text-ink"
                      }`}
                    >
                      {facet.name} · {facet.count}
                    </button>
                  );
                })}
              </div>
            )}

            {result.facets.years.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  {en ? "Year" : "Tahun"}
                </span>
                {result.facets.years.slice(0, 8).map((facet) => {
                  const active = activeYears.includes(facet.name);
                  return (
                    <button
                      key={facet.name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(facet.name, activeYears, setActiveYears)}
                      className={`rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] transition-colors cursor-pointer ${
                        active ? "bg-nb-teal text-nb-ink" : "bg-surface-muted text-ink-muted hover:text-ink"
                      }`}
                    >
                      {facet.name} · {facet.count}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-end gap-2">
          <div className="flex items-center gap-1.5">
            <label htmlFor="local-min-score" className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {en ? "Score ≥" : "Skor ≥"}
            </label>
            <input
              id="local-min-score"
              type="number"
              min={0}
              max={10}
              step={0.5}
              inputMode="decimal"
              value={minScore}
              onChange={(event) => setMinScore(event.target.value)}
              placeholder="8"
              className="w-16 rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-xs text-ink outline-none focus-visible:border-accent-text"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label htmlFor="local-studio" className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {en ? "Studio" : "Studio"}
            </label>
            <input
              id="local-studio"
              type="text"
              maxLength={32}
              value={studio}
              onChange={(event) => setStudio(event.target.value)}
              placeholder="mappa"
              className="w-28 rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-xs text-ink outline-none focus-visible:border-accent-text"
            />
          </div>
          <p className="font-mono text-[10px] text-ink-muted">
            genre:action · tahun:2024 · skor:8 · studio:mappa · -movie
          </p>
        </div>

        {result.items.length === 0 ? (
          <div className="space-y-2">
            <p className="font-mono text-xs text-ink-muted">
              {en
                ? "Nothing in the local catalog matches this query yet."
                : "Belum ada judul di katalog lokal yang cocok dengan kueri ini."}
            </p>
            {serverResults.length === 0 && result.didYouMean && (
              <Link
                href={`/search/${encodeURIComponent(result.didYouMean)}`}
                className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-nb-yellow px-2.5 py-1 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
              >
                {en ? "Did you mean" : "Maksud Anda"}: {result.didYouMean} →
              </Link>
            )}
          </div>
        ) : showList ? (
          <ul className="space-y-1.5">
            {result.items.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/anime/${entry.slug}`}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-sm border-2 border-border bg-surface p-2 transition-colors hover:bg-surface-muted"
                >
                  <span className="font-mono text-xs font-bold text-ink">
                    {highlightSegments(entry.title, baseQuery).map((segment, index) =>
                      segment.match ? (
                        <mark key={`${segment.text}-${index}`} className="bg-nb-yellow px-0.5 text-nb-ink">
                          {segment.text}
                        </mark>
                      ) : (
                        <span key={`${segment.text}-${index}`}>{segment.text}</span>
                      ),
                    )}
                  </span>
                  {entry.release && <span className="font-mono text-[10px] text-ink-muted">{entry.release}</span>}
                  {entry.rating && <span className="font-mono text-[10px] text-ink-muted">★ {entry.rating}</span>}
                  {entry.studio && <span className="font-mono text-[10px] text-ink-muted">{entry.studio}</span>}
                  {entry.genres.length > 0 && (
                    <span className="font-mono text-[10px] text-ink-muted">{entry.genres.slice(0, 3).join(" · ")}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
          >
            {en
              ? `${result.items.length} local match(es) — show`
              : `${result.items.length} judul cocok di katalog lokal — tampilkan`}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchLocalPanel;

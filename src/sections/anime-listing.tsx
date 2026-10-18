"use client";

import AnimeGrid from "@/components/cards/anime-grid";
import AnimeImage from "@/components/cards/anime-image";
import { useUrlState } from "@/hooks/use-url-state";
import Pagination from "@/sections/pagination";
import PaginationBar from "@/sections/pagination/bar";
import { SearchIcon } from "@/components/icons";
import SectionHeader from "@/components/section-header";
import { Anime, PaginationInfo } from "@/interfaces";
import { buildItemListJsonLd, safeJsonLd } from "@/lib/seo";
import { animeSlug } from "@/utils/endpoint-slug";
import { fuzzyScore } from "@/utils/fuzzy";
import { UrlStateSchema, writeUrlState } from "@/utils/url-state";
import Link from "next/link";
import { JSX, useMemo, useState } from "react";

interface AnimeListingProps {
  chip: string;
  title: string;
  anime: Anime[];
  pagination?: PaginationInfo | null;
  eagerCount?: number;
}

type SortMode = "catalog" | "az" | "za";

const SORT_LABELS: { value: SortMode; label: string }[] = [
  { value: "catalog", label: "Urutan katalog" },
  { value: "az", label: "Judul A → Z" },
  { value: "za", label: "Judul Z → A" },
];

const VIEW_MODES = new Set(["grid", "list"]);
const SORT_MODES = new Set(["catalog", "az", "za"]);

// Shareable listing state: filter, view, sort and genre live in the URL query
// so a filtered view can be copied, bookmarked and restored on refresh.
const LISTING_SCHEMA: UrlStateSchema = {
  defaults: { f: "", v: "grid", s: "catalog", g: "all" },
  sanitize: (key, value) => {
    if (key === "v") return VIEW_MODES.has(value) ? value : null;
    if (key === "s") return SORT_MODES.has(value) ? value : null;
    if (key === "f") return value.slice(0, 80).trim() || null;
    return value.length <= 48 ? value : null;
  },
};

const AnimeListing = ({ chip, title, anime, pagination, eagerCount = 0 }: AnimeListingProps): JSX.Element => {
  const [listingState, setListingState] = useUrlState(LISTING_SCHEMA);
  const filterQuery = listingState.f ?? "";
  const viewMode = (listingState.v ?? "grid") as "grid" | "list";
  const sortBy = (listingState.s ?? "catalog") as SortMode;
  const genreFilter = listingState.g ?? "all";
  const [copiedLink, setCopiedLink] = useState(false);
  const hasViewState = filterQuery !== "" || viewMode !== "grid" || sortBy !== "catalog" || genreFilter !== "all";
  const hasNumbers = (pagination?.total_page ?? 0) > 0;
  const isFirstPage = !pagination || pagination.current_page <= 1;

  const jsonLdItems = useMemo(
    () =>
      anime
        .map((item) => ({ title: item.title ?? "", slug: animeSlug(item?.link?.endpoint) }))
        .filter((item): item is { title: string; slug: string } => Boolean(item.slug)),
    [anime],
  );

  // Genres present on this page, most frequent first — an honest in-page picker.
  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of anime) {
      for (const genre of item.genres ?? []) {
        const name = genre.trim();
        if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
      .slice(0, 12)
      .map(([name]) => name);
  }, [anime]);

  const filteredAnime = useMemo(() => {
    const q = filterQuery.trim();
    let list = anime;
    if (genreFilter !== "all") {
      list = list.filter((item) => (item.genres ?? []).some((genre) => genre.trim() === genreFilter));
    }
    if (!q) return list;
    // Fuzzy filter + re-rank: prefix hits first, subsequence matches still land.
    return list
      .map((item) => ({ item, score: fuzzyScore(q, item.title) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [anime, filterQuery, genreFilter]);

  const sortedAnime = useMemo(() => {
    if (sortBy === "catalog" || filterQuery.trim()) return filteredAnime;
    const copy = [...filteredAnime];
    copy.sort((a, b) =>
      sortBy === "az"
        ? (a.title ?? "").localeCompare(b.title ?? "", "id", { sensitivity: "base" })
        : (b.title ?? "").localeCompare(a.title ?? "", "id", { sensitivity: "base" }),
    );
    return copy;
  }, [filteredAnime, sortBy, filterQuery]);

  const newestRail = isFirstPage && anime.length >= 8 ? anime.slice(0, 8) : [];

  // The URL write is debounced, so the copy handler rebuilds the canonical
  // link from state instead of trusting window.location right away.
  const copyViewLink = async () => {
    try {
      const query = writeUrlState(window.location.search, listingState, LISTING_SCHEMA);
      const url = `${window.location.origin}${window.location.pathname}${query}${window.location.hash}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 1500);
    } catch {
      // clipboard blocked — stay quiet
    }
  };

  return (
    <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
      {jsonLdItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(buildItemListJsonLd(title, jsonLdItems)) }}
        />
      )}
      <SectionHeader
        kicker={chip}
        title={title}
        titleAs="h1"
        tone="purple"
        className="mb-8"
        badge={
          <span className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
            {sortedAnime.length} Anime
          </span>
        }
        description={`Daftar anime ${title} lengkap dengan link download batch & episode subtitle Indonesia — update tiap hari di Kokunime.`}
        aside={
          <>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-sm border-2 border-border bg-surface p-0.5 shadow-[2px_2px_0_0_var(--border)]">
              <button
                type="button"
                onClick={() => setListingState({ v: "grid" })}
                aria-label="Tampilan Grid"
                title="Tampilan Grid"
                className={`flex h-8 w-8 items-center justify-center rounded-sm text-xs transition-all cursor-pointer ${
                  viewMode === "grid" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                }`}
              >
                ⊞
              </button>
              <button
                type="button"
                onClick={() => setListingState({ v: "list" })}
                aria-label="Tampilan List"
                title="Tampilan List"
                className={`flex h-8 w-8 items-center justify-center rounded-sm text-xs transition-all cursor-pointer ${
                  viewMode === "list" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                }`}
              >
                ☰
              </button>
            </div>

            {/* In-page Filter Input */}
            {anime.length > 3 && (
              <div className="relative w-full sm:w-56">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-xs">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setListingState({ f: e.target.value })}
                  placeholder="Filter di halaman ini..."
                  aria-label="Filter anime di halaman ini"
                  className="h-10 w-full rounded-sm border-2 border-border bg-surface pl-9 pr-8 text-xs text-ink shadow-[2px_2px_0_0_var(--border)] outline-none transition-all placeholder:text-ink-muted focus:border-accent"
                />
                {filterQuery && (
                  <button
                    type="button"
                    onClick={() => setListingState({ f: "" })}
                    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm text-xs text-ink-muted hover:text-ink cursor-pointer"
                    aria-label="Bersihkan filter"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Sort (catalog order = upstream recency) */}
            {anime.length > 3 && (
              <select
                value={sortBy}
                onChange={(e) => setListingState({ s: e.target.value })}
                aria-label="Urutkan anime di halaman ini"
                className="h-10 cursor-pointer rounded-sm border-2 border-border bg-surface px-2 font-mono text-xs text-ink shadow-[2px_2px_0_0_var(--border)] outline-none focus:border-accent"
              >
                {SORT_LABELS.map((option) => (
                  <option key={option.value} value={option.value}>
                    ⇅ {option.label}
                  </option>
                ))}
              </select>
            )}

            {/* Genre picker (genres present on this page) */}
            {genres.length > 2 && (
              <select
                value={genreFilter}
                onChange={(e) => setListingState({ g: e.target.value })}
                aria-label="Filter genre di halaman ini"
                className="h-10 cursor-pointer rounded-sm border-2 border-border bg-surface px-2 font-mono text-xs text-ink shadow-[2px_2px_0_0_var(--border)] outline-none focus:border-accent"
              >
                <option value="all">🎭 Semua genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            )}

            {/* Share the current filter/sort/view as a link. */}
            {hasViewState && (
              <button
                type="button"
                onClick={copyViewLink}
                aria-label={copiedLink ? "Tautan tampilan tersalin" : "Salin tautan tampilan ini"}
                title="Salin tautan tampilan ini"
                className="h-10 rounded-sm border-2 border-border bg-surface px-3 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
              >
                {copiedLink ? "✓ Tersalin" : "🔗 Salin"}
              </button>
            )}
          </>
        }
      />

      {/* Card titles render as h3; this hidden h2 bridges the h1 → h3 gap so
          the heading outline stays valid (axe heading-order). */}
      <h2 className="sr-only">Daftar anime {title}</h2>

      {/* Quick-scan rail: first items of page 1 in catalog order. */}
      {newestRail.length > 0 && (
        <div className="mb-8" data-print-hide>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">
              ⚡ Terbaru di halaman ini
            </h3>
            <span className="font-mono text-[10px] text-ink-muted">geser →</span>
          </div>
          <ul className="flex snap-x gap-3 overflow-x-auto pb-2">
            {newestRail.map((item, index) => {
              const slug = animeSlug(item.link?.endpoint);
              if (!slug) return null;
              return (
                <li key={`${slug}-${index}`} className="w-36 shrink-0 snap-start">
                  <Link href={`/anime/${slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm border-2 border-border">
                      <AnimeImage
                        src={item.link?.image ?? ""}
                        alt={item.title ?? ""}
                        fill
                        sizes="144px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs font-semibold text-ink transition-colors group-hover:text-accent-text">
                      {item.title}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {sortedAnime.length > 0 ? (
        <AnimeGrid anime={sortedAnime} eagerCount={eagerCount} viewMode={viewMode} />
      ) : (
        <div className="card-shell my-8">
          <div className="card-core p-8 text-center">
            <p className="font-display text-base font-bold text-ink">
              Tidak ditemukan anime &quot;{filterQuery || genreFilter}&quot;
            </p>
            <p className="mt-1 text-xs text-ink-muted">Coba ubah kata kunci filter atau genre di atas.</p>
          </div>
        </div>
      )}

      {pagination &&
        !filterQuery &&
        genreFilter === "all" &&
        sortBy === "catalog" &&
        (hasNumbers ? <Pagination pagination={pagination} /> : <PaginationBar pagination={pagination} />)}
    </section>
  );
};

export default AnimeListing;

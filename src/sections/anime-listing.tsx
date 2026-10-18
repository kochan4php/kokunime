"use client";

import AnimeGrid from "@/components/cards/anime-grid";
import Pagination from "@/sections/pagination";
import PaginationBar from "@/sections/pagination/bar";
import { SearchIcon } from "@/components/icons";
import SectionHeader from "@/components/section-header";
import { Anime, PaginationInfo } from "@/interfaces";
import { buildItemListJsonLd, safeJsonLd } from "@/lib/seo";
import { animeSlug } from "@/utils/endpoint-slug";
import { fuzzyScore } from "@/utils/fuzzy";
import { JSX, useMemo, useState } from "react";

interface AnimeListingProps {
  chip: string;
  title: string;
  anime: Anime[];
  pagination?: PaginationInfo | null;
  eagerCount?: number;
}

const AnimeListing = ({ chip, title, anime, pagination, eagerCount = 0 }: AnimeListingProps): JSX.Element => {
  const [filterQuery, setFilterQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const hasNumbers = (pagination?.total_page ?? 0) > 0;

  const jsonLdItems = useMemo(
    () =>
      anime
        .map((item) => ({ title: item.title ?? "", slug: animeSlug(item?.link?.endpoint) }))
        .filter((item): item is { title: string; slug: string } => Boolean(item.slug)),
    [anime],
  );

  const filteredAnime = useMemo(() => {
    const q = filterQuery.trim();
    if (!q) return anime;
    // Fuzzy filter + re-rank: prefix hits first, subsequence matches still land.
    return anime
      .map((item) => ({ item, score: fuzzyScore(q, item.title) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [anime, filterQuery]);

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
            {filteredAnime.length} Anime
          </span>
        }
        description={`Daftar anime ${title} lengkap dengan link download batch & episode subtitle Indonesia — update tiap hari di Kokunime.`}
        aside={
          <>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-sm border-2 border-border bg-surface p-0.5 shadow-[2px_2px_0_0_var(--border)]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
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
                onClick={() => setViewMode("list")}
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
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter di halaman ini..."
                  aria-label="Filter anime di halaman ini"
                  className="h-10 w-full rounded-sm border-2 border-border bg-surface pl-9 pr-8 text-xs text-ink shadow-[2px_2px_0_0_var(--border)] outline-none transition-all placeholder:text-ink-muted focus:border-accent"
                />
                {filterQuery && (
                  <button
                    type="button"
                    onClick={() => setFilterQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </>
        }
      />

      {/* Card titles render as h3; this hidden h2 bridges the h1 → h3 gap so
          the heading outline stays valid (axe heading-order). */}
      <h2 className="sr-only">Daftar anime {title}</h2>

      {filteredAnime.length > 0 ? (
        <AnimeGrid anime={filteredAnime} eagerCount={eagerCount} viewMode={viewMode} />
      ) : (
        <div className="card-shell my-8">
          <div className="card-core p-8 text-center">
            <p className="font-display text-base font-bold text-ink">Tidak ditemukan anime &quot;{filterQuery}&quot;</p>
            <p className="mt-1 text-xs text-ink-muted">Coba ubah kata kunci filter di atas.</p>
          </div>
        </div>
      )}

      {pagination &&
        !filterQuery &&
        (hasNumbers ? <Pagination pagination={pagination} /> : <PaginationBar pagination={pagination} />)}
    </section>
  );
};

export default AnimeListing;

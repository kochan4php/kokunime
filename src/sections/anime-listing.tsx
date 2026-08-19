"use client";

import AnimeGrid from "@/components/cards/anime-grid";
import Pagination from "@/sections/pagination";
import PaginationBar from "@/sections/pagination/bar";
import { SearchIcon } from "@/components/icons";
import { Anime, PaginationInfo } from "@/interfaces";
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

  const filteredAnime = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return anime;
    return anime.filter((item) => item.title.toLowerCase().includes(q));
  }, [anime, filterQuery]);

  return (
    <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {chip}
            </span>
            <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-muted">
              {filteredAnime.length} Anime
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">{title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Tampilan Grid"
              title="Tampilan Grid"
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-accent text-(--accent-ink) shadow-xs font-bold" : "text-ink-muted hover:text-ink"
              }`}
            >
              ⊞
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="Tampilan List"
              title="Tampilan List"
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === "list" ? "bg-accent text-(--accent-ink) shadow-xs font-bold" : "text-ink-muted hover:text-ink"
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
                className="h-9 w-full rounded-2xl border border-border bg-surface pl-9 pr-8 text-xs text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent hover:border-accent/60"
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
        </div>
      </div>

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

"use client";

import AnimeGrid from "@/components/cards/anime-grid";
import Pagination from "@/sections/pagination";
import Reveal from "@/components/reveal";
import { SearchIcon } from "@/components/icons";
import { Anime, PaginationInfo } from "@/interfaces";
import { JSX, useMemo, useState } from "react";

interface LatestGridProps {
  anime: Anime[];
  pagination: PaginationInfo | null;
  basePath?: string;
}

const LatestGrid = ({ anime, pagination, basePath }: LatestGridProps): JSX.Element => {
  const [query, setQuery] = useState("");

  const filteredAnime = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return anime;
    return anime.filter((item) => item.title.toLowerCase().includes(q));
  }, [anime, query]);

  return (
    <section id="update-now" className="container scroll-mt-28 px-4 py-16 md:py-24">
      <Reveal>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Katalog
            </span>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
              Update Terbaru
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-60">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter di halaman ini..."
                aria-label="Filter anime di halaman ini"
                className="h-9 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-xs text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent hover:border-accent/60"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="hidden font-mono text-xs uppercase tracking-widest text-ink-muted lg:block">
              Hal {pagination?.current_page ?? 1} / {pagination?.total_page ?? 1}
            </p>
          </div>
        </div>
      </Reveal>

      {filteredAnime.length > 0 ? (
        <AnimeGrid anime={filteredAnime} eagerCount={6} />
      ) : (
        <div className="card-shell my-8">
          <div className="card-core p-8 text-center">
            <p className="font-display text-base font-bold text-ink">Tidak ditemukan anime &quot;{query}&quot;</p>
            <p className="mt-1 text-xs text-ink-muted">Coba ubah kata kunci filter di atas.</p>
          </div>
        </div>
      )}

      {!query && <Pagination pagination={pagination} basePath={basePath} />}
    </section>
  );
};

export default LatestGrid;

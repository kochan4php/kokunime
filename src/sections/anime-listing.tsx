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
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "ongoing">("all");
  const hasNumbers = (pagination?.total_page ?? 0) > 0;

  const filteredAnime = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    return anime.filter((item) => {
      const matchQuery = !q || item.title.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && /complete|tamat/i.test(item.release || item.title)) ||
        (statusFilter === "ongoing" && !/complete|tamat/i.test(item.release || item.title));
      return matchQuery && matchStatus;
    });
  }, [anime, filterQuery, statusFilter]);

  return (
    <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {chip}
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">{title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                statusFilter === "all"
                  ? "border border-accent/40 bg-accent/15 text-accent"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                statusFilter === "completed"
                  ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-500"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("ongoing")}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                statusFilter === "ongoing"
                  ? "border border-amber-500/40 bg-amber-500/15 text-amber-500"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              Ongoing
            </button>
          </div>

          {anime.length > 3 && (
            <div className="relative w-full sm:w-56">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter di halaman ini..."
                aria-label="Filter anime di halaman ini"
                className="h-9 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-xs text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent hover:border-accent/60"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {filteredAnime.length > 0 ? (
        <AnimeGrid anime={filteredAnime} eagerCount={eagerCount} />
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

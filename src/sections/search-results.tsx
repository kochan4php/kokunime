"use client";

import AnimeGrid from "@/components/cards/anime-grid";
import EmptyState from "@/components/anime/empty-state";
import Reveal from "@/components/reveal";
import { Anime } from "@/interfaces";
import { JSX, useMemo, useState } from "react";

interface SearchResultsProps {
  anime: Anime[];
}

type SortOrder = "default" | "asc" | "desc";

const SearchResults = ({ anime }: SearchResultsProps): JSX.Element => {
  const [sortBy, setSortBy] = useState<SortOrder>("default");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    anime.forEach((item) => {
      item.genres?.forEach((g) => {
        if (g) set.add(g.trim());
      });
    });
    return Array.from(set).sort();
  }, [anime]);

  const filteredAnime = useMemo(() => {
    let result = anime;
    if (selectedGenre !== "all") {
      result = result.filter((item) =>
        item.genres?.some((g) => g.trim().toLowerCase() === selectedGenre.toLowerCase()),
      );
    }
    if (sortBy === "default") return result;
    return [...result].sort((a, b) => {
      const cmp = a.title.localeCompare(b.title, "id", { sensitivity: "base" });
      return sortBy === "asc" ? cmp : -cmp;
    });
  }, [anime, selectedGenre, sortBy]);

  if (anime.length === 0) {
    return (
      <Reveal>
        <EmptyState />
      </Reveal>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-ink-muted">
            Ditemukan <strong className="text-ink">{filteredAnime.length}</strong> anime
            {selectedGenre !== "all" && ` (filter: ${selectedGenre})`}
          </span>

          <div className="flex flex-wrap items-center gap-3">
            {anime.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider">Urutkan:</span>
                <button
                  type="button"
                  onClick={() => setSortBy("default")}
                  className={`rounded-full px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                    sortBy === "default"
                      ? "bg-accent/15 font-semibold text-accent border border-accent/40"
                      : "bg-surface text-ink-muted hover:text-ink border border-border"
                  }`}
                >
                  Relevansi
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("asc")}
                  className={`rounded-full px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                    sortBy === "asc"
                      ? "bg-accent/15 font-semibold text-accent border border-accent/40"
                      : "bg-surface text-ink-muted hover:text-ink border border-border"
                  }`}
                >
                  A - Z
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("desc")}
                  className={`rounded-full px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                    sortBy === "desc"
                      ? "bg-accent/15 font-semibold text-accent border border-accent/40"
                      : "bg-surface text-ink-muted hover:text-ink border border-border"
                  }`}
                >
                  Z - A
                </button>
              </div>
            )}

            {/* View mode toggle */}
            <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Tampilan Grid Poster"
                className={`rounded-full px-2.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                  viewMode === "grid" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                }`}
              >
                ⊞ Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                title="Tampilan List Kompak"
                className={`rounded-full px-2.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                  viewMode === "list" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                }`}
              >
                ☰ List
              </button>
            </div>
          </div>
        </div>

        {allGenres.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">Genre:</span>
            <button
              type="button"
              onClick={() => setSelectedGenre("all")}
              className={`rounded-full px-2.5 py-0.5 font-mono text-xs transition-all ${
                selectedGenre === "all"
                  ? "bg-accent/15 font-semibold text-accent border border-accent/40"
                  : "bg-surface text-ink-muted hover:text-ink border border-border"
              }`}
            >
              Semua ({anime.length})
            </button>
            {allGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-2.5 py-0.5 font-mono text-xs transition-all ${
                  selectedGenre === genre
                    ? "bg-accent/15 font-semibold text-accent border border-accent/40"
                    : "bg-surface text-ink-muted hover:text-ink border border-border"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimeGrid anime={filteredAnime} eagerCount={Math.min(filteredAnime.length, 6)} viewMode={viewMode} />
    </div>
  );
};

export default SearchResults;

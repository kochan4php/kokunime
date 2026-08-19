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
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreLogic, setGenreLogic] = useState<"AND" | "OR">("OR");
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

  const toggleGenre = (genre: string) => {
    if (genre === "all") {
      setSelectedGenres([]);
      return;
    }
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const filteredAnime = useMemo(() => {
    let result = anime;
    if (selectedGenres.length > 0) {
      result = result.filter((item) => {
        const itemGenres = (item.genres || []).map((g) => g.toLowerCase());
        if (genreLogic === "AND") {
          return selectedGenres.every((g) => itemGenres.includes(g.toLowerCase()));
        }
        return selectedGenres.some((g) => itemGenres.includes(g.toLowerCase()));
      });
    }
    if (sortBy === "default") return result;
    return [...result].sort((a, b) => {
      const cmp = a.title.localeCompare(b.title, "id", { sensitivity: "base" });
      return sortBy === "asc" ? cmp : -cmp;
    });
  }, [anime, selectedGenres, genreLogic, sortBy]);

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
            {selectedGenres.length > 0 && ` (filter: ${selectedGenres.join(genreLogic === "AND" ? " + " : " / ")})`}
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
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">Genre:</span>
                <button
                  type="button"
                  onClick={() => toggleGenre("all")}
                  className={`rounded-full px-2.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                    selectedGenres.length === 0
                      ? "bg-accent/15 font-semibold text-accent border border-accent/40"
                      : "bg-surface text-ink-muted hover:text-ink border border-border"
                  }`}
                >
                  Semua ({anime.length})
                </button>
              </div>

              {selectedGenres.length > 1 && (
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[10px] text-ink-muted">Logika:</span>
                  <div className="flex items-center rounded-full border border-border bg-surface p-0.5">
                    <button
                      type="button"
                      onClick={() => setGenreLogic("OR")}
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold cursor-pointer transition-all ${
                        genreLogic === "OR" ? "bg-accent text-(--accent-ink)" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      OR (Salah Satu)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenreLogic("AND")}
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold cursor-pointer transition-all ${
                        genreLogic === "AND" ? "bg-accent text-(--accent-ink)" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      AND (Semua)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {allGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-accent/15 font-semibold text-accent border border-accent/40"
                        : "bg-surface text-ink-muted hover:text-ink border border-border"
                    }`}
                  >
                    {isSelected ? `✓ ${genre}` : genre}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimeGrid anime={filteredAnime} eagerCount={Math.min(filteredAnime.length, 6)} viewMode={viewMode} />
    </div>
  );
};

export default SearchResults;

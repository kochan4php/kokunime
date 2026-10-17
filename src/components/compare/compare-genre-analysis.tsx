"use client";

import { AnimeDetail } from "@/interfaces";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface CompareGenreAnalysisProps {
  animeA: AnimeDetail;
  animeB: AnimeDetail;
}

// Shared vs exclusive genres between the two titles.
const CompareGenreAnalysis = ({ animeA, animeB }: CompareGenreAnalysisProps): JSX.Element => {
  const { t } = useTranslation();

  const genresA = animeA.genre?.map((g) => g.name) || [];
  const genresB = animeB.genre?.map((g) => g.name) || [];
  const sharedGenres = genresA.filter((g) => genresB.includes(g));
  const uniqueGenresA = genresA.filter((g) => !genresB.includes(g));
  const uniqueGenresB = genresB.filter((g) => !genresA.includes(g));

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-4">
        <h4 className="font-display text-sm sm:text-base font-bold text-ink">🎭 {t("compare.genre_analysis")}</h4>

        {/* Shared Genres */}
        {sharedGenres.length > 0 && (
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-bold text-ink block">
              🤝 {t("compare.shared_genres")} ({sharedGenres.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sharedGenres.map((g) => (
                <span
                  key={g}
                  className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-1 font-mono text-xs font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
                >
                  ✓ {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unique Genres Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-sm border-2 border-border bg-surface space-y-1.5">
            <span className="font-mono text-xs font-bold text-accent block">
              🔴 {t("compare.unique_genres_a")} ({animeA.title}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {uniqueGenresA.length > 0 ? (
                uniqueGenresA.map((g) => (
                  <span
                    key={g}
                    className="rounded-sm border border-border bg-accent/15 px-2 py-0.5 font-mono text-xs font-bold text-accent"
                  >
                    {g}
                  </span>
                ))
              ) : (
                <span className="text-xs text-ink-muted italic">{t("compare.no_exclusive")}</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-sm border-2 border-border bg-surface space-y-1.5">
            <span className="font-mono text-xs font-bold text-accent block">
              🔵 {t("compare.unique_genres_b")} ({animeB.title}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {uniqueGenresB.length > 0 ? (
                uniqueGenresB.map((g) => (
                  <span
                    key={g}
                    className="rounded-sm border border-border bg-accent/15 px-2 py-0.5 font-mono text-xs font-bold text-accent"
                  >
                    {g}
                  </span>
                ))
              ) : (
                <span className="text-xs text-ink-muted italic">{t("compare.no_exclusive")}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareGenreAnalysis;

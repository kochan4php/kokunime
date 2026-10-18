"use client";

import { AnimeDetail } from "@/interfaces";
import { buildGenreSets, seriesMark } from "@/utils/compare";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface CompareGenreAnalysisProps {
  animes: AnimeDetail[];
}

// Shared vs exclusive genres across the compared titles.
const CompareGenreAnalysis = ({ animes }: CompareGenreAnalysisProps): JSX.Element => {
  const { t } = useTranslation();

  const { shared, uniques } = buildGenreSets(animes.map((anime) => anime.genre?.map((genre) => genre.name) ?? []));

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-4">
        <h4 className="font-display text-sm sm:text-base font-bold text-ink">🎭 {t("compare.genre_analysis")}</h4>

        {/* Shared Genres */}
        {shared.length > 0 && (
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-bold text-ink block">
              🤝 {t("compare.shared_genres")} ({shared.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {shared.map((genre) => (
                <span
                  key={genre}
                  className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-1 font-mono text-xs font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
                >
                  ✓ {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unique Genres Grid */}
        <div className={`grid grid-cols-1 gap-4 pt-2 ${animes.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {animes.map((anime, index) => {
            const uniqueGenres = uniques[index] ?? [];
            return (
              <div
                key={`${anime.title}-${index}`}
                className="p-3.5 rounded-sm border-2 border-border bg-surface space-y-1.5"
              >
                <span className="font-mono text-xs font-bold text-accent-text block">
                  {seriesMark(index)} {t("compare.unique_genres")} ({anime.title}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueGenres.length > 0 ? (
                    uniqueGenres.map((genre) => (
                      <span
                        key={genre}
                        className="rounded-sm border border-border bg-accent/15 px-2 py-0.5 font-mono text-xs font-bold text-accent-text"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-ink-muted italic">{t("compare.no_exclusive")}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompareGenreAnalysis;

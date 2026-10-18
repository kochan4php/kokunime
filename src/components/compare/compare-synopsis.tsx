"use client";

import { AnimeDetail } from "@/interfaces";
import { seriesMark } from "@/utils/compare";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

export const CompareSynopsis = ({ animes }: { animes: AnimeDetail[] }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={`grid grid-cols-1 gap-6 ${animes.length > 2 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
      {animes.map((anime, index) => (
        <div key={`${anime.title}-${index}`} className="card-shell">
          <div className="card-core p-5 sm:p-6 space-y-3">
            <h4 className="font-display text-sm sm:text-base font-bold text-ink">
              📖 {t("compare.synopsis")} {seriesMark(index)}{" "}
              <span className="text-xs font-bold text-ink-muted">{anime.title}</span>
            </h4>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed whitespace-pre-line">
              {anime.synopsis || "Sinopsis tidak tersedia."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

"use client";

import { AnimeDetail } from "@/interfaces";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

export const CompareSynopsis = ({ animeA, animeB }: { animeA: AnimeDetail; animeB: AnimeDetail }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card-shell">
        <div className="card-core p-5 sm:p-6 space-y-3">
          <h4 className="font-display text-sm sm:text-base font-bold text-ink">📖 {t("compare.synopsis_a")}</h4>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed whitespace-pre-line">
            {animeA.synopsis || "Sinopsis tidak tersedia."}
          </p>
        </div>
      </div>

      <div className="card-shell">
        <div className="card-core p-5 sm:p-6 space-y-3">
          <h4 className="font-display text-sm sm:text-base font-bold text-ink">📖 {t("compare.synopsis_b")}</h4>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed whitespace-pre-line">
            {animeB.synopsis || "Sinopsis tidak tersedia."}
          </p>
        </div>
      </div>
    </div>
  );
};

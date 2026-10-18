"use client";

import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

export const CompareLoadingCard = (): JSX.Element => {
  const { t, language } = useTranslation();
  return (
    <div className="card-shell animate-pulse">
      <div className="card-core p-8 text-center space-y-3">
        <span className="inline-block text-3xl animate-spin">⏳</span>
        <h3 className="font-display text-base font-bold text-ink">{t("compare.loading_msg")}</h3>
        <p className="text-xs text-ink-muted max-w-md mx-auto">
          {language === "en"
            ? "Fetching rating scores, studios, episodes, duration, and complete synopses in real-time."
            : "Mengambil skor rating, studio animasi, episode, durasi, dan sinopsis lengkap kedua anime secara langsung."}
        </p>
      </div>
    </div>
  );
};

export const CompareEmptyState = ({ hasA, hasB }: { hasA: boolean; hasB: boolean }): JSX.Element => {
  const { t, language } = useTranslation();
  return (
    <div className="card-shell">
      <div className="card-core p-10 text-center space-y-4">
        <span className="text-4xl">⚖️</span>
        <h3 className="font-display text-lg font-bold text-ink">
          {!hasA && !hasB
            ? t("compare.empty_prompt")
            : !hasA
              ? language === "en"
                ? "Select Anime A to Complete Comparison"
                : "Pilih Anime Pertama (A) untuk Melengkapi Komparasi"
              : language === "en"
                ? "Select Anime B to Complete Comparison"
                : "Pilih Anime Kedua (B) untuk Melengkapi Komparasi"}
        </h3>
        <p className="max-w-md mx-auto text-xs text-ink-muted leading-relaxed">
          {language === "en"
            ? "Use the search boxes or click a Quick Example above to compare rating scores, total episodes, genres, studios, synopses, and download links instantly."
            : "Gunakan kotak pencarian atau klik salah satu Contoh Cepat di atas untuk membandingkan skor rating, total episode, genre, studio, sinopsis, dan mirror unduhan secara instan."}
        </p>
      </div>
    </div>
  );
};

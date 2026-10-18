"use client";

import AnimeImage from "@/components/cards/anime-image";
import { AnimeDetail } from "@/interfaces";
import { seriesMark } from "@/utils/compare";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { JSX } from "react";

interface CompareAnimeCardProps {
  anime: AnimeDetail;
  slug: string;
  side: "a" | "b" | "c";
}

const SIDE_LABELS = {
  a: "compare.anime_a",
  b: "compare.anime_b",
  c: "compare.anime_c",
} as const;

const SIDE_DETAIL_LABELS = {
  a: "compare.open_detail_a",
  b: "compare.open_detail_b",
  c: "compare.open_detail_c",
} as const;

// Header card for one side of the comparison dashboard.
const CompareAnimeCard = ({ anime, slug, side }: CompareAnimeCardProps): JSX.Element => {
  const { t } = useTranslation();
  const dot = seriesMark(side === "a" ? 0 : side === "b" ? 1 : 2);

  return (
    <div className="card-shell overflow-hidden">
      <div className="card-core p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="relative aspect-[3/4] w-28 sm:w-32 shrink-0 overflow-hidden rounded-sm border-2 border-border bg-surface-muted shadow-[4px_4px_0_0_var(--border)]">
            {anime.image && (
              <AnimeImage fill sizes="(max-width: 640px) 112px, 128px" src={anime.image} alt={anime.title ?? ""} />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <span className="chip text-[10px]">
              {dot} {t(SIDE_LABELS[side])}
            </span>
            <h3 className="font-display text-base sm:text-lg font-extrabold text-ink leading-snug line-clamp-2">
              {anime.title}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="rounded-sm border-2 border-border bg-nb-yellow px-2 py-0.5 font-bold text-nb-ink">
                ⭐ {anime.score || "N/A"}
              </span>
              <span className="rounded-sm border border-border bg-surface-muted px-2 py-0.5 text-ink-muted">
                {anime.status || "N/A"}
              </span>
              <span className="rounded-sm border border-border bg-surface-muted px-2 py-0.5 text-ink-muted">
                {anime.total_episode || "?"} Ep
              </span>
            </div>
            <div className="pt-2">
              <Link
                href={`/anime/${slug}`}
                className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-accent px-3.5 py-1.5 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
              >
                <span>{t(SIDE_DETAIL_LABELS[side])}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareAnimeCard;

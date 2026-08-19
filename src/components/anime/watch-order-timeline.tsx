"use client";

import { AnimeDetail } from "@/interfaces";
import { JSX, useMemo } from "react";
import Link from "next/link";

interface WatchOrderTimelineProps {
  anime: AnimeDetail;
}

export const WatchOrderTimeline = ({ anime }: WatchOrderTimelineProps): JSX.Element | null => {
  const title = anime.title || "";

  // Extract franchise base name and potential seasons / movies / OVAs
  const franchiseInfo = useMemo(() => {
    const clean = title.replace(/\s*(batch|sub\s*indo|subtitle\s*indonesia|\(.*?\)|\[.*?\])/gi, "").trim();
    const hasNumberedSeason = /season\s*\d+|s\d+|\b2nd\b|\b3rd\b|\b4th\b|\bfinal\b|movie|ova/i.test(clean);

    if (!hasNumberedSeason && !anime.season?.name) {
      return null;
    }

    const baseName = clean
      .replace(
        /\s*(season\s*\d+|s\d+|\b2nd\s*season|\b3rd\s*season|\b4th\s*season|\bfinal\s*season|movie|ova|\bpart\s*\d+).*/i,
        "",
      )
      .trim();

    return {
      baseName: baseName || clean,
      currentSeason: anime.season?.name || "Rilis Utama",
    };
  }, [title, anime.season]);

  if (!franchiseInfo) return null;

  return (
    <div id="watch-order" className="mt-12 rounded-3xl border border-border bg-surface p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/15 text-sm font-bold text-accent">
            ⏳
          </span>
          <h3 className="font-display text-lg font-bold text-ink">Urutan Menonton (Watch Order)</h3>
        </div>
        <Link
          href={`/search/${encodeURIComponent(franchiseInfo.baseName)}`}
          className="font-mono text-xs font-semibold text-accent hover:underline"
        >
          Cari Semua Seri {franchiseInfo.baseName} →
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="relative rounded-2xl border border-border/70 bg-surface-solid p-4 min-w-0">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span className="rounded-full bg-surface px-2 py-0.5 font-bold">1. Season 1 / Prekuel</span>
            <span>Utama</span>
          </div>
          <p className="mt-2 font-display text-sm font-bold text-ink line-clamp-1 break-words">{franchiseInfo.baseName}</p>
          <span className="mt-1 block text-xs text-ink-muted">Mulai tonton dari awal cerita.</span>
        </div>

        <div className="relative rounded-2xl border-2 border-accent bg-accent/5 p-4 shadow-md min-w-0">
          <div className="flex items-center justify-between text-xs font-mono text-accent">
            <span className="rounded-full bg-accent/20 px-2 py-0.5 font-bold">2. Halaman Ini</span>
            <span>⭐ Sedang Dibuka</span>
          </div>
          <p className="mt-2 font-display text-sm font-bold text-ink line-clamp-1 break-words">{title}</p>
          <span className="mt-1 block text-xs text-ink-muted">{franchiseInfo.currentSeason}</span>
        </div>

        <div className="relative rounded-2xl border border-border/70 bg-surface-solid p-4 min-w-0">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span className="rounded-full bg-surface px-2 py-0.5 font-bold">3. Sekuel / Movie</span>
            <span>Lanjutan</span>
          </div>
          <p className="mt-2 font-display text-sm font-bold text-ink line-clamp-1 break-words">Kelanjutan Cerita</p>
          <Link
            href={`/search/${encodeURIComponent(franchiseInfo.baseName)}`}
            className="mt-1 inline-block text-xs font-semibold text-accent hover:underline"
          >
            Lihat seri lainnya →
          </Link>
        </div>
      </div>
    </div>
  );
};

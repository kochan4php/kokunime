"use client";

import { HistoryItem, getHistory, clearAllHistory, subscribeHistory } from "@/utils/history";
import AnimeImage from "@/components/cards/anime-image";
import Link from "next/link";
import { JSX, useSyncExternalStore } from "react";

const EMPTY_HISTORY: HistoryItem[] = [];

const HomeHistoryStrip = (): JSX.Element | null => {
  const history = useSyncExternalStore(subscribeHistory, getHistory, () => EMPTY_HISTORY);

  if (history.length === 0) return null;

  return (
    <section className="container px-4 pt-6 md:pt-8">
      <div className="card-shell">
        <div className="card-core p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <h3 className="font-display text-sm font-bold tracking-tight text-ink md:text-base">Terakhir Dilihat</h3>
            </div>
            <button
              type="button"
              onClick={() => clearAllHistory()}
              className="font-mono text-[11px] text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              Hapus Riwayat
            </button>
          </div>

          <div className="flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {history.slice(0, 10).map((item) => (
              <Link
                key={item.slug}
                href={`/anime/${item.slug}`}
                className="group flex w-32 shrink-0 snap-start flex-col gap-2 sm:w-36"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-surface-muted">
                  {item.image ? (
                    <AnimeImage
                      fill
                      sizes="144px"
                      src={item.image}
                      alt={item.title}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <h4 className="line-clamp-2 text-xs font-semibold leading-tight text-ink transition-colors group-hover:text-accent">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHistoryStrip;

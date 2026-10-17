"use client";

import AnimeImage from "@/components/cards/anime-image";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";

interface TrendingEntry {
  slug: string;
  title: string;
  image?: string;
  count: number;
}

// "Sedang Populer" rail on the home page. Renders nothing until /api/trending
// returns real data (no Redis / no views yet = hidden).
const TrendingRail = (): JSX.Element | null => {
  const [items, setItems] = useState<TrendingEntry[]>([]);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/trending");
        if (!res.ok) return;
        const data = (await res.json()) as { items?: TrendingEntry[] };
        if (active && Array.isArray(data.items)) setItems(data.items);
      } catch {
        // Rail stays hidden.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="container px-4 pt-8 md:pt-12" aria-labelledby="trending-title">
      <div className="mb-4 flex items-center gap-2">
        <h2 id="trending-title" className="font-display text-lg font-extrabold tracking-tight text-ink md:text-xl">
          🔥 Sedang Populer
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">7 hari terakhir</span>
      </div>
      <div className="nb-cycle flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <Link
            key={item.slug}
            href={`/anime/${item.slug}`}
            className="card-shell group block w-32 shrink-0 snap-start sm:w-36"
          >
            <div className="card-core">
              <div className="relative aspect-[3/4] w-full border-b-2 border-border">
                <span className="absolute left-1.5 top-1.5 z-10 rounded-sm border-2 border-border bg-nb-pink px-1.5 font-mono text-[10px] font-bold text-[#0a0a0a]">
                  #{index + 1}
                </span>
                <AnimeImage
                  fill
                  sizes="144px"
                  src={item.image as string}
                  alt={item.title}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />
              </div>
              <div className="p-2.5">
                <h3 className="line-clamp-2 text-[11px] font-semibold leading-snug group-hover:underline decoration-2 underline-offset-2">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendingRail;

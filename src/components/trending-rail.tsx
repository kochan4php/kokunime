"use client";

import AnimeImage from "@/components/cards/anime-image";
import SectionHeader from "@/components/section-header";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";

interface TrendingEntry {
  slug: string;
  title: string;
  image?: string;
  count: number;
}

// "Sedang Populer" chart on the home page: view counts ranked with big
// numerals (editorial top-N). Renders nothing until /api/trending returns real
// data (no Redis / no views yet = hidden).
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
        // Chart stays hidden.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="container px-4 pt-10 md:pt-14" aria-labelledby="trending-title">
      <SectionHeader
        kicker="Trending"
        title="🔥 Sedang Populer"
        titleId="trending-title"
        tone="pink"
        className="mb-6"
        badge={<span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">7 hari terakhir</span>}
      />
      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.slice(0, 9).map((item, index) => (
          <li key={item.slug}>
            <Link
              href={`/anime/${item.slug}`}
              className="group flex items-center gap-3 border-2 border-border bg-surface-solid p-2.5 shadow-[3px_3px_0_0_var(--border)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span
                aria-hidden="true"
                className="w-9 shrink-0 text-center font-display text-3xl font-black leading-none"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="relative block h-16 w-12 shrink-0 overflow-hidden border-2 border-border bg-surface-muted">
                <AnimeImage fill sizes="48px" src={item.image as string} alt="" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-extrabold tracking-tight decoration-2 underline-offset-2 group-hover:underline">
                  {item.title}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wide text-ink-muted">
                  {item.count} kunjungan
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default TrendingRail;

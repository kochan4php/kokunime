"use client";

import { Season } from "@/interfaces";
import { endpointSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { JSX, useMemo, useState } from "react";

interface SeasonsExplorerProps {
  groups: Record<string, Season[]>;
  years: string[];
}

const SEASON_META: Record<string, { icon: string; name: string; months: string; color: string; gradient: string }> = {
  winter: {
    icon: "❄️",
    name: "Winter (Musim Dingin)",
    months: "Januari - Maret",
    color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    gradient: "from-sky-500/20 to-blue-500/10 border-sky-500/30",
  },
  spring: {
    icon: "🌸",
    name: "Spring (Musim Semi)",
    months: "April - Juni",
    color: "text-pink-400 border-pink-500/30 bg-pink-500/10",
    gradient: "from-pink-500/20 to-rose-500/10 border-pink-500/30",
  },
  summer: {
    icon: "☀️",
    name: "Summer (Musim Panas)",
    months: "Juli - September",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    gradient: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  },
  fall: {
    icon: "🍁",
    name: "Fall (Musim Gugur)",
    months: "Oktober - Desember",
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    gradient: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
  },
};

const getSeasonInfo = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("winter") || lower.includes("dingin")) return SEASON_META.winter;
  if (lower.includes("spring") || lower.includes("semi")) return SEASON_META.spring;
  if (lower.includes("summer") || lower.includes("panas")) return SEASON_META.summer;
  if (lower.includes("fall") || lower.includes("autumn") || lower.includes("gugur")) return SEASON_META.fall;
  return {
    icon: "📅",
    name,
    months: "Musim Rilis",
    color: "text-accent border-accent/30 bg-accent/10",
    gradient: "from-accent/20 to-accent-2/10 border-accent/30",
  };
};

export const SeasonsExplorer = ({ groups, years }: SeasonsExplorerProps): JSX.Element => {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const displayedYears = useMemo(() => {
    if (selectedYear !== "all") {
      return [selectedYear];
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return years;

    return years.filter((yr) => {
      if (yr.includes(q)) return true;
      const yrSeasons = groups[yr] || [];
      return yrSeasons.some((s) => s.name.toLowerCase().includes(q));
    });
  }, [years, groups, selectedYear, searchQuery]);

  return (
    <div className="space-y-12">
      {/* 4 Seasons Overview Guide */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-ink flex items-center gap-2">
              <span>🗓️</span>
              <span>4 Siklus Musim Anime</span>
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">Panduan kalender jadwal rilis anime Jepang setiap tahun.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(SEASON_META).map(([key, meta]) => (
            <div
              key={key}
              className={`rounded-3xl border bg-gradient-to-br ${meta.gradient} p-4 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{meta.icon}</span>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${meta.color}`}>
                  {meta.months}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-ink mt-3">{meta.name}</h3>
              <p className="font-mono text-xs text-ink-muted mt-0.5">Kuartal {key === "winter" ? "Q1" : key === "spring" ? "Q2" : key === "summer" ? "Q3" : "Q4"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Year Filter Pills & Quick Search */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => {
                setSelectedYear("all");
                setSearchQuery("");
              }}
              className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedYear === "all"
                  ? "bg-accent text-(--accent-ink) font-bold"
                  : "border border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
              }`}
            >
              Semua Tahun ({years.length})
            </button>
            {years.slice(0, 10).map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => {
                  setSelectedYear(yr);
                  setSearchQuery("");
                }}
                className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedYear === yr
                    ? "bg-accent text-(--accent-ink) font-bold"
                    : "border border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setSelectedYear("all");
              }}
              placeholder="Cari tahun atau musim..."
              aria-label="Cari musim anime"
              className="h-10 w-full rounded-2xl border border-border bg-surface-solid pl-9 pr-8 text-xs text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent focus:bg-surface"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-xs">
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Season Groups by Year */}
        <div className="space-y-10 pt-4">
          {displayedYears.length > 0 ? (
            displayedYears.map((year) => {
              const seasonsInYear = groups[year] || [];
              if (seasonsInYear.length === 0) return null;

              return (
                <div key={year} className="rounded-3xl border border-border/80 bg-surface/30 p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl font-black text-ink">{year}</span>
                      <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-muted">
                        {seasonsInYear.length} Musim Rilis
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {seasonsInYear.map((season) => {
                      const slug = endpointSlug(season.endpoint, "seasons");
                      if (!slug) return null;

                      const meta = getSeasonInfo(season.name);

                      return (
                        <Link
                          key={slug}
                          href={`/seasons/${slug}`}
                          className="group relative flex items-center justify-between rounded-2xl border border-border bg-surface-solid p-3.5 transition-all duration-200 hover:border-accent hover:bg-accent/5 hover:shadow-lg active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-xl group-hover:scale-110 transition-transform">
                              {meta.icon}
                            </span>
                            <div className="min-w-0">
                              <h4 className="font-display text-sm font-bold text-ink truncate group-hover:text-accent transition-colors">
                                {season.name}
                              </h4>
                              <p className="font-mono text-[11px] text-ink-muted mt-0.5">{meta.months}</p>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-ink-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-accent shrink-0">
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-border bg-surface-solid p-8 text-center">
              <span className="text-3xl">📅</span>
              <p className="font-display text-base font-bold text-ink mt-2">Musim rilis tidak ditemukan</p>
              <p className="text-xs text-ink-muted mt-1">Coba gunakan kata kunci tahun atau musim yang lain.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SeasonsExplorer;

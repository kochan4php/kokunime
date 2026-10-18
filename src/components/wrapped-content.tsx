"use client";

import MainLayout from "@/layouts/main-layout";
import MiniBarChart, { MiniBarDatum } from "@/components/mini-bar-chart";
import SectionHeader from "@/components/section-header";
import { BookmarkItem, getBookmarks, subscribeBookmarks } from "@/utils/bookmarks";
import { getHistory, HistoryItem, subscribeHistory } from "@/utils/history";
import { getProgressList, ProgressEntry, subscribeProgress } from "@/utils/progress";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useMemo, useState, useSyncExternalStore } from "react";

const SERVER_EMPTY: never[] = [];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const WrappedContent = (): JSX.Element => {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, getBookmarks, () => SERVER_EMPTY as BookmarkItem[]);
  const history = useSyncExternalStore(subscribeHistory, getHistory, () => SERVER_EMPTY as HistoryItem[]);
  const progress = useSyncExternalStore(subscribeProgress, getProgressList, () => SERVER_EMPTY as ProgressEntry[]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const bookmark of bookmarks) years.add(new Date(bookmark.addedAt).getFullYear());
    for (const item of history) years.add(new Date(item.viewedAt).getFullYear());
    for (const entry of progress) years.add(new Date(entry.updatedAt).getFullYear());
    return [...years].sort((a, b) => b - a);
  }, [bookmarks, history, progress]);

  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const activeYear = availableYears.includes(year) ? year : (availableYears[0] ?? new Date().getFullYear());

  const wrapped = useMemo(() => {
    const yearBookmarks = bookmarks.filter((b) => new Date(b.addedAt).getFullYear() === activeYear);
    const yearHistory = history.filter((h) => new Date(h.viewedAt).getFullYear() === activeYear);
    const yearProgress = progress.filter((p) => new Date(p.updatedAt).getFullYear() === activeYear);

    const months: MiniBarDatum[] = MONTHS_SHORT.map((label) => ({ label, value: 0 }));
    const bump = (ts: number) => {
      const month = new Date(ts).getMonth();
      const bucket = months[month];
      if (bucket) bucket.value++;
    };
    for (const bookmark of yearBookmarks) bump(bookmark.addedAt);
    for (const item of yearHistory) bump(item.viewedAt);
    for (const entry of yearProgress) bump(entry.updatedAt);

    const rated = yearBookmarks.filter((b) => typeof b.rating === "number" && b.rating >= 1);
    const avgRating =
      rated.length > 0 ? (rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
    const topRated = [...rated].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5);

    const folderCounts = new Map<string, number>();
    for (const bookmark of yearBookmarks) {
      if (bookmark.folder?.trim())
        folderCounts.set(bookmark.folder.trim(), (folderCounts.get(bookmark.folder.trim()) ?? 0) + 1);
    }
    const topFolder = [...folderCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      yearBookmarks,
      yearHistory,
      yearProgress,
      months,
      avgRating,
      topRated,
      topFolder,
      epsMarked: yearProgress.reduce((sum, entry) => sum + entry.watched.length, 0),
      hasData: yearBookmarks.length + yearHistory.length + yearProgress.length > 0,
    };
  }, [activeYear, bookmarks, history, progress]);

  const shareSummary = async (): Promise<void> => {
    const lines = [
      `🎁 Kokunime Wrapped ${activeYear}`,
      `🔖 ${wrapped.yearBookmarks.length} anime tersimpan`,
      `🕘 ${wrapped.yearHistory.length} kunjungan`,
      `📺 ${wrapped.epsMarked} episode ditandai`,
      `⭐ Rating rata-rata: ${wrapped.avgRating}`,
      wrapped.topFolder ? `📁 Folder favorit: ${wrapped.topFolder}` : null,
      `${window.location.origin}/wrapped`,
    ].filter(Boolean);
    const text = lines.join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: `Kokunime Wrapped ${activeYear}`, text });
      } else {
        await navigator.clipboard.writeText(text);
        showToast("Ringkasan Wrapped disalin ke clipboard");
      }
    } catch {
      // User cancelled the share sheet — nothing to do.
    }
  };

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-16 md:pt-10">
        <SectionHeader
          kicker="Rekap tahunan"
          title={`Wrapped ${activeYear}`}
          titleAs="h1"
          tone="purple"
          description="Rekap perjalanan nontonmu tahun ini — dihitung dari data lokal perangkat, tanpa server."
          aside={
            <>
              {availableYears.length > 1 && (
                <select
                  value={activeYear}
                  onChange={(event) => setYear(Number(event.target.value))}
                  aria-label="Pilih tahun"
                  className="h-10 cursor-pointer rounded-sm border-2 border-border bg-surface px-3 font-mono text-xs text-ink outline-none focus:border-accent"
                >
                  {availableYears.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              <button type="button" onClick={() => void shareSummary()} className="btn-primary">
                Bagikan 🎁
              </button>
            </>
          }
        />

        {!wrapped.hasData ? (
          <div className="card-shell mt-8">
            <div className="card-core p-10 text-center md:p-16">
              <p className="text-3xl">🎁</p>
              <h2 className="mt-4 font-display text-xl font-bold text-ink">Belum ada aktivitas di {activeYear}</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                Simpan anime, tandai episode, dan kembali lagi — Wrapped akan terisi otomatis.
              </p>
              <Link href="/" className="btn-primary mt-6">
                Mulai Nonton
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="card-shell lg:col-span-2">
              <div className="card-core p-5">
                <h2 className="font-display text-base font-bold text-ink">Aktivitas per Bulan</h2>
                <div className="mt-4">
                  <MiniBarChart
                    data={wrapped.months}
                    ariaLabel={`Grafik aktivitas bulanan tahun ${activeYear}`}
                    barClassName="bg-nb-pink"
                  />
                </div>
              </div>
            </div>

            <div className="card-shell">
              <div className="card-core flex h-full flex-col justify-between gap-4 p-5">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">Anime tersimpan</span>
                    <span className="font-display text-2xl font-extrabold text-ink">
                      {wrapped.yearBookmarks.length}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">Episode ditandai</span>
                    <span className="font-display text-2xl font-extrabold text-ink">{wrapped.epsMarked}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">Kunjungan</span>
                    <span className="font-display text-2xl font-extrabold text-ink">{wrapped.yearHistory.length}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">Rating rata-rata</span>
                    <span className="font-display text-2xl font-extrabold text-ink">⭐ {wrapped.avgRating}</span>
                  </div>
                  {wrapped.topFolder && (
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">Folder favorit</span>
                      <span className="min-w-0 truncate font-mono text-sm font-bold text-ink">
                        📁 {wrapped.topFolder}
                      </span>
                    </div>
                  )}
                </div>
                <Link href="/stats" className="btn-secondary justify-center">
                  Statistik Lengkap →
                </Link>
              </div>
            </div>

            {wrapped.topRated.length > 0 && (
              <div className="card-shell lg:col-span-3">
                <div className="card-core p-5">
                  <h2 className="font-display text-base font-bold text-ink">Rating Tertinggi {activeYear}</h2>
                  <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {wrapped.topRated.map((bookmark, index) => (
                      <li key={bookmark.slug}>
                        <Link
                          href={`/anime/${bookmark.slug}`}
                          className="flex items-center justify-between gap-2 rounded-sm border-2 border-border bg-surface px-3 py-2 shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5"
                        >
                          <span className="min-w-0 truncate text-xs font-bold text-ink">
                            {index + 1}. {bookmark.title}
                          </span>
                          <span className="shrink-0 rounded-sm border border-border bg-nb-yellow px-1.5 font-mono text-[10px] font-bold">
                            ⭐ {bookmark.rating}/10
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default WrappedContent;

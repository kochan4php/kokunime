"use client";

import MainLayout from "@/layouts/main-layout";
import MiniBarChart, { MiniBarDatum } from "@/components/mini-bar-chart";
import SectionHeader from "@/components/section-header";
import { getBookmarks, subscribeBookmarks, BookmarkItem } from "@/utils/bookmarks";
import { getHistory, subscribeHistory, HistoryItem } from "@/utils/history";
import { getProgressList, subscribeProgress, ProgressEntry } from "@/utils/progress";
import Link from "next/link";
import { JSX, useMemo, useSyncExternalStore } from "react";

const SERVER_EMPTY: never[] = [];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// Rough watch-time estimate: episodes are ~24 minutes on average.
const MINUTES_PER_EPISODE = 24;

const formatWatchTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} m`;
  const hours = minutes / 60;
  if (hours < 100) return `${hours.toFixed(1)} jam`;
  return `${Math.round(hours)} jam`;
};

const dayKey = (ts: number): string => {
  const date = new Date(ts);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const StatsContent = (): JSX.Element => {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, getBookmarks, () => SERVER_EMPTY as BookmarkItem[]);
  const history = useSyncExternalStore(subscribeHistory, getHistory, () => SERVER_EMPTY as HistoryItem[]);
  const progress = useSyncExternalStore(subscribeProgress, getProgressList, () => SERVER_EMPTY as ProgressEntry[]);

  const stats = useMemo(() => {
    const months: MiniBarDatum[] = [];
    const now = new Date();
    const buckets = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      buckets.set(key, 0);
      months.push({ label: MONTHS_SHORT[date.getMonth()] ?? "", value: 0 });
    }

    const bump = (ts: number) => {
      const date = new Date(ts);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    };
    for (const bookmark of bookmarks) bump(bookmark.addedAt);
    for (const item of history) bump(item.viewedAt);
    for (const entry of progress) bump(entry.updatedAt);

    let index = 0;
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = months[index];
      if (month) month.value = buckets.get(`${date.getFullYear()}-${date.getMonth()}`) ?? 0;
      index++;
    }

    const ratingCounts: MiniBarDatum[] = Array.from({ length: 10 }, (_, i) => ({ label: String(i + 1), value: 0 }));
    let ratingSum = 0;
    let ratingCount = 0;
    for (const bookmark of bookmarks) {
      if (typeof bookmark.rating === "number" && bookmark.rating >= 1 && bookmark.rating <= 10) {
        const bucket = ratingCounts[bookmark.rating - 1];
        if (bucket) bucket.value++;
        ratingSum += bookmark.rating;
        ratingCount++;
      }
    }

    const folderCounts = new Map<string, number>();
    for (const bookmark of bookmarks) {
      if (bookmark.folder?.trim())
        folderCounts.set(bookmark.folder.trim(), (folderCounts.get(bookmark.folder.trim()) ?? 0) + 1);
    }
    const topFolders = [...folderCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

    const totalWatched = progress.reduce((sum, entry) => sum + entry.watched.length, 0);
    const completedSeries = progress.filter((entry) => entry.total && entry.watched.length >= entry.total).length;

    // Streak: consecutive days (ending today or yesterday) with any activity.
    const activeDays = new Set<string>();
    for (const bookmark of bookmarks) activeDays.add(dayKey(bookmark.addedAt));
    for (const item of history) activeDays.add(dayKey(item.viewedAt));
    for (const entry of progress) activeDays.add(dayKey(entry.updatedAt));
    let streak = 0;
    const cursor = new Date();
    if (!activeDays.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
    while (activeDays.has(dayKey(cursor.getTime()))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    const genreCounts = new Map<string, number>();
    for (const bookmark of bookmarks) {
      for (const genre of bookmark.genres ?? []) {
        if (genre) genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
      }
    }
    const topGenres: MiniBarDatum[] = [...genreCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value]) => ({ label, value }));

    return {
      months,
      ratingCounts,
      topFolders,
      topGenres,
      totalWatched,
      watchMinutes: totalWatched * MINUTES_PER_EPISODE,
      completedSeries,
      streak,
      avgRating: ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : "—",
      hasData: bookmarks.length + history.length + progress.length > 0,
    };
  }, [bookmarks, history, progress]);

  const kpis = [
    { label: "Anime Tersimpan", value: String(bookmarks.length), icon: "🔖", bg: "bg-nb-yellow" },
    { label: "Episode Ditandai", value: String(stats.totalWatched), icon: "📺", bg: "bg-nb-cyan" },
    { label: "Series Tamat", value: String(stats.completedSeries), icon: "✅", bg: "bg-nb-lime" },
    { label: "Rata-rata Rating", value: stats.avgRating, icon: "⭐", bg: "bg-nb-pink" },
    {
      label: "Streak Hari Ini",
      value: `${stats.streak} hari`,
      icon: "🔥",
      bg: "bg-nb-orange",
    },
    { label: "Riwayat Dilihat", value: String(history.length), icon: "🕘", bg: "bg-nb-teal" },
    { label: "Estimasi Waktu Tonton", value: formatWatchTime(stats.watchMinutes), icon: "⏱", bg: "bg-nb-purple" },
  ];

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-16 md:pt-10">
        <SectionHeader
          kicker="Statistik lokal"
          title="Statistik Saya"
          titleAs="h1"
          tone="pink"
          className="mb-8"
          description="Dihitung langsung dari data di perangkat ini — bookmark, riwayat, dan progres menonton. Tidak ada yang dikirim ke server."
          aside={
            <>
              <Link href="/wrapped" className="btn-secondary">
                🎁 Wrapped
              </Link>
              <Link href="/bookmarks" className="btn-primary">
                Buka Tersimpan
              </Link>
            </>
          }
        />

        {!stats.hasData ? (
          <div className="card-shell mt-8">
            <div className="card-core p-10 text-center md:p-16">
              <p className="text-3xl">📊</p>
              <h2 className="mt-4 font-display text-xl font-bold text-ink">Belum ada data untuk dihitung</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                Simpan beberapa anime dan tandai episode yang sudah ditonton — statistik akan terisi otomatis.
              </p>
              <Link href="/" className="btn-primary mt-6">
                Jelajahi Katalog
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="card-shell">
                  <div className="card-core flex h-full flex-col gap-2 p-3.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border text-base ${kpi.bg}`}
                    >
                      {kpi.icon}
                    </span>
                    <span className="font-display text-xl font-extrabold text-ink">{kpi.value}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">{kpi.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="card-shell">
                <div className="card-core p-5">
                  <h2 className="font-display text-base font-bold text-ink">Aktivitas 12 Bulan Terakhir</h2>
                  <p className="mt-1 text-xs text-ink-muted">Bookmark baru, kunjungan, dan update progres per bulan.</p>
                  <div className="mt-4">
                    <MiniBarChart
                      data={stats.months}
                      ariaLabel="Grafik aktivitas per bulan selama 12 bulan terakhir"
                      barClassName="bg-nb-cyan"
                    />
                  </div>
                </div>
              </div>

              <div className="card-shell">
                <div className="card-core p-5">
                  <h2 className="font-display text-base font-bold text-ink">Distribusi Rating</h2>
                  <p className="mt-1 text-xs text-ink-muted">Sebaran rating personal 1–10 untuk anime tersimpan.</p>
                  <div className="mt-4">
                    <MiniBarChart
                      data={stats.ratingCounts}
                      ariaLabel="Grafik distribusi rating 1 sampai 10"
                      barClassName="bg-nb-yellow"
                    />
                  </div>
                </div>
              </div>

              <div className="card-shell">
                <div className="card-core p-5">
                  <h2 className="font-display text-base font-bold text-ink">Distribusi Genre</h2>
                  <p className="mt-1 text-xs text-ink-muted">Genre teratas dari anime yang kamu simpan.</p>
                  {stats.topGenres.length === 0 ? (
                    <p className="mt-3 text-sm text-ink-muted">
                      Belum ada data genre. Genre mulai tercatat untuk bookmark yang dibuat setelah fitur ini aktif.
                    </p>
                  ) : (
                    <div className="mt-4">
                      <MiniBarChart
                        data={stats.topGenres}
                        ariaLabel="Grafik distribusi genre dari anime tersimpan"
                        barClassName="bg-nb-teal"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="card-shell lg:col-span-2">
                <div className="card-core p-5">
                  <h2 className="font-display text-base font-bold text-ink">Folder Terbanyak</h2>
                  {stats.topFolders.length === 0 ? (
                    <p className="mt-2 text-sm text-ink-muted">
                      Belum ada folder. Atur folder lewat tombol ✎ pada kartu tersimpan, atau seret kartu ke nama
                      folder.
                    </p>
                  ) : (
                    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {stats.topFolders.map(([name, count]) => (
                        <li
                          key={name}
                          className="flex items-center justify-between gap-2 rounded-sm border-2 border-border bg-surface px-3 py-2 shadow-[2px_2px_0_0_var(--border)]"
                        >
                          <span className="min-w-0 truncate font-mono text-xs font-bold text-ink">📁 {name}</span>
                          <span className="shrink-0 rounded-sm border border-border bg-nb-lime px-1.5 font-mono text-[10px] font-bold">
                            {count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </MainLayout>
  );
};

export default StatsContent;

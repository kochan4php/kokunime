"use client";

import MainLayout from "@/layouts/main-layout";
import CardAnime from "@/components/cards/card-anime";
import {
  BookmarkItem,
  BookmarkStatus,
  clearAllBookmarks,
  exportBookmarksJson,
  exportBookmarksMalXml,
  getBookmarks,
  getStorageUsageStats,
  importBookmarksJson,
  restoreBookmarks,
  subscribeBookmarks,
  updateBookmarkUserMeta,
} from "@/utils/bookmarks";
import { HistoryItem, clearAllHistory, getHistory, subscribeHistory } from "@/utils/history";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useEffect, useMemo, useState, useSyncExternalStore } from "react";

const SERVER_BOOKMARKS: BookmarkItem[] = [];
const SERVER_HISTORY: HistoryItem[] = [];

const itemTime = (item: BookmarkItem | HistoryItem): number => ("addedAt" in item ? item.addedAt : item.viewedAt);

const BookmarksPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "history">("bookmarks");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | BookmarkStatus>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "title" | "rating">("recent");
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.startsWith("#sync=")) {
      try {
        const raw = decodeURIComponent(atob(hash.replace("#sync=", "")));
        const items = JSON.parse(raw);
        if (Array.isArray(items) && items.length > 0) {
          const current = getBookmarks();
          const merged = [...items, ...current.filter((c) => !items.some((i) => i.slug === c.slug))];
          localStorage.setItem("kokunime_bookmarks", JSON.stringify(merged));
          window.location.hash = "";
          alert(`Berhasil mensinkronkan ${items.length} anime dari cloud link!`);
          window.location.reload();
        }
      } catch {}
    }
  }, []);

  const copySyncLink = () => {
    try {
      const saved = localStorage.getItem("kokunime_bookmarks") || "[]";
      const b64 = btoa(encodeURIComponent(saved));
      const url = `${window.location.origin}/bookmarks#sync=${b64}`;
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      });
    } catch {}
  };

  const bookmarks = useSyncExternalStore(subscribeBookmarks, getBookmarks, () => SERVER_BOOKMARKS);

  const history = useSyncExternalStore(subscribeHistory, getHistory, () => SERVER_HISTORY);

  const folders = useMemo(() => {
    const set = new Set<string>();
    bookmarks.forEach((b) => {
      if (b.folder?.trim()) set.add(b.folder.trim());
    });
    return Array.from(set);
  }, [bookmarks]);

  const allItems =
    activeTab === "bookmarks"
      ? bookmarks.filter((b) => {
          const matchStatus = statusFilter === "all" || b.status === statusFilter;
          const matchFolder = folderFilter === "all" || b.folder === folderFilter;
          return matchStatus && matchFolder;
        })
      : history;

  const items = allItems.filter((item) => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return true;
    const searchTerms = q.split(/\s+/).filter(Boolean);
    const searchableText =
      `${item.title} ${(item as { notes?: string }).notes || ""} ${(item as { folder?: string }).folder || ""} ${item.slug}`.toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
  });

  const sortedItems = useMemo(() => {
    const list = [...items];
    if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title, "id"));
    else if (sortBy === "rating")
      list.sort((a, b) => ((b as BookmarkItem).rating ?? 0) - ((a as BookmarkItem).rating ?? 0));
    else if (sortBy === "oldest") list.sort((a, b) => itemTime(a) - itemTime(b));
    else list.sort((a, b) => itemTime(b) - itemTime(a));
    return list;
  }, [items, sortBy]);

  const storageStats = useMemo(() => {
    if (typeof window === "undefined") return { bytesUsed: 0, formattedUsed: "0 B", percentage: 0 };
    return getStorageUsageStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarks, history]);

  const handleClear = () => {
    if (activeTab === "bookmarks") {
      if (window.confirm("Hapus semua anime tersimpan?")) {
        const snapshot = getBookmarks();
        clearAllBookmarks();
        if (snapshot.length > 0) {
          showToast(`${snapshot.length} anime dihapus dari Tersimpan`, {
            actionLabel: "Urungkan",
            onAction: () => restoreBookmarks(snapshot),
          });
        }
      }
    } else {
      if (window.confirm("Hapus semua riwayat terakhir?")) {
        clearAllHistory();
      }
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const count = await importBookmarksJson(file);
    alert(count > 0 ? `Berhasil mengimpor ${count} anime baru!` : "Semua anime dari file backup sudah ada di daftar.");
    e.target.value = "";
  };

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("bookmarks");
                  setFilterQuery("");
                }}
                className={`rounded-sm border-2 border-border px-4 py-1.5 font-display text-sm font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                  activeTab === "bookmarks"
                    ? "bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                    : "bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                Tersimpan ({bookmarks.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("history");
                  setFilterQuery("");
                }}
                className={`rounded-sm border-2 border-border px-4 py-1.5 font-display text-sm font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                  activeTab === "history"
                    ? "bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                    : "bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                Riwayat Terakhir ({history.length})
              </button>
            </div>
            <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">
              {activeTab === "bookmarks" ? "Anime Tersimpan" : "Riwayat Terakhir Dilihat"}
            </h1>

            {activeTab === "bookmarks" && bookmarks.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`rounded-sm border-2 px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                    statusFilter === "all"
                      ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  Semua ({bookmarks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("watching")}
                  className={`rounded-sm border-2 px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                    statusFilter === "watching"
                      ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  📺 Sedang Nonton ({bookmarks.filter((b) => b.status === "watching").length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("plan")}
                  className={`rounded-sm border-2 px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                    statusFilter === "plan"
                      ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  📌 Rencana ({bookmarks.filter((b) => b.status === "plan").length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("completed")}
                  className={`rounded-sm border-2 px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                    statusFilter === "completed"
                      ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  ✓ Selesai ({bookmarks.filter((b) => b.status === "completed").length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("dropped")}
                  className={`rounded-sm border-2 px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                    statusFilter === "dropped"
                      ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  ⛔ Drop ({bookmarks.filter((b) => b.status === "dropped").length})
                </button>
              </div>
            )}
            {activeTab === "bookmarks" && (folders.length > 0 || bookmarks.length > 0) && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] text-ink-muted">Folder:</span>
                <button
                  type="button"
                  onClick={() => setFolderFilter("all")}
                  className={`rounded-sm border-2 px-2.5 py-0.5 font-mono text-[10px] transition-all cursor-pointer ${
                    folderFilter === "all"
                      ? "border-border bg-accent text-(--accent-ink) font-bold shadow-[2px_2px_0_0_var(--border)]"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  Semua
                </button>
                {folders.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFolderFilter(f)}
                    className={`rounded-sm border-2 px-2.5 py-0.5 font-mono text-[10px] transition-all cursor-pointer ${
                      folderFilter === f
                        ? "border-border bg-accent text-(--accent-ink) font-bold shadow-[2px_2px_0_0_var(--border)]"
                        : "border-border bg-surface text-ink-muted hover:text-ink"
                    }`}
                  >
                    📁 {f}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-sm border-2 border-border bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Tampilan Grid"
                title="Tampilan Grid"
                className={`flex h-7 w-7 items-center justify-center rounded-sm text-xs transition-all cursor-pointer ${
                  viewMode === "grid" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                }`}
              >
                ⊞
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Tampilan List"
                title="Tampilan List"
                className={`flex h-7 w-7 items-center justify-center rounded-sm text-xs transition-all cursor-pointer ${
                  viewMode === "list" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                }`}
              >
                ☰
              </button>
            </div>

            {allItems.length > 3 && (
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter daftar..."
                aria-label="Filter anime di daftar ini"
                className="h-8 rounded-sm border-2 border-border bg-surface px-3 text-xs text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent"
              />
            )}
            {activeTab === "bookmarks" && bookmarks.length > 1 && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Urutkan daftar tersimpan"
                title="Urutkan daftar tersimpan"
                className="h-8 cursor-pointer rounded-sm border-2 border-border bg-surface px-2 font-mono text-xs text-ink-muted outline-none transition-all focus:border-accent"
              >
                <option value="recent">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title">Judul A-Z</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            )}
            {activeTab === "bookmarks" && (
              <>
                <span
                  title={`Penggunaan penyimpanan lokal: ${storageStats.formattedUsed} (~${storageStats.percentage}%)`}
                  className="hidden md:inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-ink-muted"
                >
                  <span>💾 {storageStats.formattedUsed}</span>
                </span>
                <button
                  type="button"
                  onClick={copySyncLink}
                  title="Salin tautan sinkronisasi cloud untuk memindahkan bookmark ke perangkat lain"
                  className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer cursor-pointer"
                >
                  {shareCopied ? "✓ Link Disalin" : "☁️ Sync Cloud"}
                </button>
                <button
                  type="button"
                  onClick={exportBookmarksJson}
                  title="Export backup bookmark ke file JSON"
                  className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  Export .json
                </button>
                <button
                  type="button"
                  onClick={exportBookmarksMalXml}
                  title="Export daftar tontonan ke format XML MyAnimeList"
                  className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  Export MAL .xml
                </button>
                <label
                  title="Import backup bookmark dari file JSON, AniList JSON, atau MyAnimeList XML"
                  className="cursor-pointer rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  Import JSON / MAL XML
                  <input type="file" accept=".json,.xml" onChange={handleImport} className="hidden" />
                </label>
              </>
            )}
            {allItems.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:bg-nb-red hover:text-nb-ink active:translate-y-0 active:shadow-none cursor-pointer"
              >
                Hapus Semua
              </button>
            )}
          </div>
        </div>

        {/* List/grid item titles render as h3; hidden h2 keeps the outline
            valid (axe heading-order) without changing the visual design. */}
        <h2 className="sr-only">{activeTab === "bookmarks" ? "Anime tersimpan" : "Riwayat tontonan"}</h2>

        {sortedItems.length > 0 ? (
          viewMode === "list" ? (
            <div className="mt-8 flex flex-col gap-2">
              {sortedItems.map((item) => {
                const bookmark = activeTab === "bookmarks" ? (item as BookmarkItem) : null;
                return (
                  <div
                    key={item.slug}
                    className="group relative flex items-center justify-between gap-2.5 sm:gap-3.5 rounded-sm border-2 border-border bg-surface-solid p-2 sm:p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--border)]"
                  >
                    <Link href={`/anime/${item.slug}`} className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                      <div className="relative h-13 w-10 sm:h-16 sm:w-12 shrink-0 overflow-hidden rounded-sm bg-surface-muted border-2 border-border">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-1 font-display text-xs sm:text-[13px] font-bold text-ink transition-colors group-hover:text-accent">
                          {item.title}
                        </h3>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-ink-muted">
                          {activeTab === "bookmarks" ? (
                            <>
                              {bookmark?.status === "watching" && (
                                <span className="rounded-sm border border-border bg-nb-teal px-1.5 font-bold text-nb-ink">
                                  📺 Nonton
                                </span>
                              )}
                              {bookmark?.status === "plan" && (
                                <span className="rounded-sm border border-border bg-nb-yellow px-1.5 font-bold text-nb-ink">
                                  📌 Rencana
                                </span>
                              )}
                              {bookmark?.status === "completed" && (
                                <span className="rounded-sm border border-border bg-nb-lime px-1.5 font-bold text-nb-ink">
                                  ✓ Selesai
                                </span>
                              )}
                              {bookmark?.status === "dropped" && (
                                <span className="rounded-sm border border-border bg-nb-red px-1.5 font-bold text-nb-ink">
                                  ⛔ Drop
                                </span>
                              )}
                              {bookmark?.rating && <span>• ⭐ {bookmark.rating}/10</span>}
                              {bookmark?.folder && <span>• 📁 {bookmark.folder}</span>}
                            </>
                          ) : (
                            <span>{item.release || "Dilihat"}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/anime/${item.slug}`}
                        className="rounded-sm border-2 border-border bg-accent px-2.5 py-1 font-mono text-[11px] font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_0_var(--border)]"
                      >
                        Buka →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="nb-cycle mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-5 lg:gap-3.5 xl:grid-cols-6 2xl:grid-cols-6">
              {sortedItems.map((item, index) => {
                const bookmark = activeTab === "bookmarks" ? (item as BookmarkItem) : null;
                return (
                  <div key={item.slug} className="group relative flex flex-col">
                    <CardAnime
                      path={`/anime/${item.slug}`}
                      src={item.image as string}
                      title={item.title}
                      meta={
                        activeTab === "bookmarks"
                          ? `${bookmark?.rating ? `⭐ ${bookmark.rating}/10 • ` : ""}${
                              bookmark?.folder ? `📁 ${bookmark.folder} • ` : ""
                            }${
                              bookmark?.status === "watching"
                                ? "📺 Sedang Nonton"
                                : bookmark?.status === "completed"
                                  ? "✓ Selesai"
                                  : bookmark?.status === "dropped"
                                    ? "⛔ Drop"
                                    : "📌 Tersimpan"
                            }`
                          : item.release || "Dilihat"
                      }
                      eager={index < 5}
                      priority={index === 0}
                    />
                    {activeTab === "bookmarks" && bookmark && (
                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 px-1 text-[11px] text-ink-muted">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const rate = prompt(
                              `Beri rating (1-10) untuk ${item.title}:`,
                              bookmark.rating?.toString() || "",
                            );
                            if (rate !== null) {
                              const num = parseInt(rate, 10);
                              if (!isNaN(num) && num >= 1 && num <= 10) {
                                updateBookmarkUserMeta(item.slug, { rating: num });
                              } else if (rate === "") {
                                updateBookmarkUserMeta(item.slug, { rating: undefined });
                              }
                            }
                          }}
                          className="hover:text-accent font-mono transition-colors cursor-pointer"
                          title="Beri rating personal (1-10)"
                        >
                          {bookmark.rating ? `⭐ ${bookmark.rating}/10` : "☆ Nilai"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const fName = prompt(`Nama folder/kategori untuk ${item.title}:`, bookmark.folder || "");
                            if (fName !== null) {
                              updateBookmarkUserMeta(item.slug, { folder: fName.trim() || undefined });
                            }
                          }}
                          className="hover:text-accent font-mono transition-colors cursor-pointer truncate max-w-[80px]"
                          title={bookmark.folder ? `Folder: ${bookmark.folder}` : "Atur folder"}
                        >
                          {bookmark.folder ? `📁 ${bookmark.folder}` : "+ Folder"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const note = prompt(`Catatan pribadi untuk ${item.title}:`, bookmark.notes || "");
                            if (note !== null) {
                              updateBookmarkUserMeta(item.slug, { notes: note.trim() });
                            }
                          }}
                          className="hover:text-accent font-mono transition-colors cursor-pointer truncate max-w-[70px]"
                          title={bookmark.notes ? `Catatan: ${bookmark.notes}` : "Tambah catatan pribadi"}
                        >
                          {bookmark.notes ? `📝 ${bookmark.notes}` : "+ Note"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="card-shell mt-10">
            <div className="card-core flex flex-col items-center justify-center p-12 text-center md:p-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm border-2 border-border bg-nb-yellow text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2 className="mt-6 font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
                {activeTab === "bookmarks" ? "Belum ada anime tersimpan" : "Belum ada riwayat tontonan"}
              </h2>
              <p className="mt-2 max-w-sm text-sm text-ink-muted">
                {activeTab === "bookmarks"
                  ? "Klik tombol bookmark pada anime mana saja untuk menyimpannya ke daftar ini secara offline."
                  : "Anime yang Anda buka akan otomatis tercatat di sini."}
              </p>
              <Link href="/" className="btn-primary mt-6">
                Jelajahi Katalog
              </Link>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default BookmarksPage;

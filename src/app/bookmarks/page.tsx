"use client";

import MainLayout from "@/layouts/main-layout";
import CardAnime from "@/components/cards/card-anime";
import BookmarkMetaDialog from "@/components/bookmark-meta-dialog";
import BookmarkListRow from "@/components/bookmarks/bookmark-list-row";
import {
  BookmarkItem,
  BookmarkStatus,
  clearAllBookmarks,
  exportBookmarksJson,
  exportBookmarksMalXml,
  getBookmarks,
  getStorageUsageStats,
  importBookmarksJson,
  removeBookmark,
  restoreBookmarks,
  subscribeBookmarks,
  updateBookmarkUserMeta,
} from "@/utils/bookmarks";
import {
  HistoryItem,
  clearAllHistory,
  getHistory,
  removeHistory,
  restoreHistory,
  subscribeHistory,
} from "@/utils/history";
import {
  ProgressEntry,
  getProgressList,
  mergeProgressEntries,
  nextEpisodeFromProgress,
  subscribeProgress,
} from "@/utils/progress";
import { decodeSyncPayload, encodeSyncPayload } from "@/utils/sync-codec";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

const SERVER_BOOKMARKS: BookmarkItem[] = [];
const SERVER_HISTORY: HistoryItem[] = [];
const SERVER_PROGRESS: ProgressEntry[] = [];

const itemTime = (item: BookmarkItem | HistoryItem): number => ("addedAt" in item ? item.addedAt : item.viewedAt);

const BookmarksPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "history">("bookmarks");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | BookmarkStatus>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "title" | "rating">("recent");
  const [shareCopied, setShareCopied] = useState(false);
  const [metaDialogSlug, setMetaDialogSlug] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [bulkFolderChoice, setBulkFolderChoice] = useState("");
  const [bulkNewFolder, setBulkNewFolder] = useState<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Share-link import: gzip-compressed bookmark + progress payload appended as
  // #sync=.... Merge is confirm-gated and additive (undo-safe), replacing the
  // old alert+reload flow. Legacy uncompressed links still decode.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash.startsWith("#sync=")) return;

    void (async () => {
      const payload = await decodeSyncPayload(hash.slice("#sync=".length));
      const incomingBookmarks = Array.isArray(payload?.b) ? (payload.b as BookmarkItem[]) : [];
      const incomingProgress = Array.isArray(payload?.p) ? (payload.p as ProgressEntry[]) : [];
      if (incomingBookmarks.length === 0 && incomingProgress.length === 0) return;

      window.history.replaceState(null, "", window.location.pathname);
      const accepted = window.confirm(
        `Tautan sinkronisasi berisi ${incomingBookmarks.length} bookmark dan ${incomingProgress.length} data progres. Gabungkan dengan data di perangkat ini?`,
      );
      if (!accepted) return;

      if (incomingBookmarks.length > 0) restoreBookmarks(incomingBookmarks);
      const mergedProgress = mergeProgressEntries(incomingProgress);
      showToast(`Sinkron selesai: ${incomingBookmarks.length} bookmark, ${mergedProgress} data progres`);
    })();
  }, []);

  const copySyncLink = () => {
    void (async () => {
      try {
        const token = await encodeSyncPayload({ v: 1, b: getBookmarks(), p: getProgressList() });
        await navigator.clipboard.writeText(`${window.location.origin}/bookmarks#sync=${token}`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
        showToast("Tautan sync (bookmark + progres) disalin");
      } catch {
        showToast("Gagal menyalin tautan sync");
      }
    })();
  };

  const bookmarks = useSyncExternalStore(subscribeBookmarks, getBookmarks, () => SERVER_BOOKMARKS);

  const history = useSyncExternalStore(subscribeHistory, getHistory, () => SERVER_HISTORY);

  const progressList = useSyncExternalStore(subscribeProgress, getProgressList, () => SERVER_PROGRESS);

  // slug → next unwatched episode, for the "▶ Eps N" continue chips.
  const nextEpisodes = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of progressList) {
      const next = nextEpisodeFromProgress(entry);
      if (next !== null) map.set(entry.slug, next);
    }
    return map;
  }, [progressList]);

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

  const metaDialogItem = useMemo(
    () => (metaDialogSlug ? (bookmarks.find((b) => b.slug === metaDialogSlug) ?? null) : null),
    [bookmarks, metaDialogSlug],
  );

  const switchTab = (tab: "bookmarks" | "history") => {
    setActiveTab(tab);
    setFilterQuery("");
    setSelectMode(false);
    setSelectedSlugs([]);
  };

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
        const snapshot = getHistory();
        clearAllHistory();
        if (snapshot.length > 0) {
          showToast(`${snapshot.length} riwayat dihapus`, {
            actionLabel: "Urungkan",
            onAction: () => restoreHistory(snapshot),
          });
        }
      }
    }
  };

  const handleRemoveItem = (item: BookmarkItem | HistoryItem) => {
    if (activeTab === "bookmarks") {
      const snapshot = getBookmarks().find((b) => b.slug === item.slug);
      removeBookmark(item.slug);
      if (snapshot) {
        showToast(`${item.title} dihapus`, {
          actionLabel: "Urungkan",
          onAction: () => restoreBookmarks([snapshot]),
        });
      }
    } else {
      const snapshot = getHistory().filter((h) => h.slug === item.slug);
      removeHistory(item.slug);
      showToast(`${item.title} dihapus dari riwayat`, {
        actionLabel: "Urungkan",
        onAction: () => restoreHistory(snapshot),
      });
    }
  };

  // Folder assignment (drag & drop, bulk bar). Keeps a snapshot of the previous
  // folder per slug so the toast's undo restores exactly what changed.
  const assignFolder = (folder: string | undefined, slugs: string[]) => {
    if (slugs.length === 0) return;
    const previous = getBookmarks()
      .filter((b) => slugs.includes(b.slug))
      .map((b) => ({ slug: b.slug, folder: b.folder ?? null }));
    for (const slug of slugs) updateBookmarkUserMeta(slug, { folder: folder ?? null });
    showToast(folder ? `${slugs.length} anime dipindah ke 📁 ${folder}` : `Folder dihapus dari ${slugs.length} anime`, {
      actionLabel: "Urungkan",
      onAction: () => {
        for (const entry of previous) updateBookmarkUserMeta(entry.slug, { folder: entry.folder });
      },
    });
  };

  const removeSelected = () => {
    const snapshot = getBookmarks().filter((b) => selectedSlugs.includes(b.slug));
    if (snapshot.length === 0) return;
    if (!window.confirm(`Hapus ${snapshot.length} anime terpilih?`)) return;
    const remaining = getBookmarks().filter((b) => !selectedSlugs.includes(b.slug));
    clearAllBookmarks();
    restoreBookmarks(remaining);
    showToast(`${snapshot.length} anime dihapus`, {
      actionLabel: "Urungkan",
      onAction: () => restoreBookmarks(snapshot),
    });
    setSelectedSlugs([]);
  };

  const toggleSelected = (slug: string) => {
    setSelectedSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const copyMarkdown = (source: BookmarkItem[]) => {
    void (async () => {
      if (source.length === 0) return;
      const origin = window.location.origin;
      const lines = source.map((b) => {
        const bits = [
          b.rating ? ` ⭐ ${b.rating}/10` : "",
          b.folder ? ` 📁 ${b.folder}` : "",
          b.status ? ` (${b.status})` : "",
        ].join("");
        return `- [${b.title}](${origin}/anime/${b.slug})${bits}`;
      });
      try {
        await navigator.clipboard.writeText(lines.join("\n"));
        showToast(`${lines.length} judul disalin sebagai Markdown`);
      } catch {
        showToast("Gagal menyalin ke clipboard");
      }
    })();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const count = await importBookmarksJson(file);
    alert(count > 0 ? `Berhasil mengimpor ${count} anime baru!` : "Semua anime dari file backup sudah ada di daftar.");
    e.target.value = "";
  };

  const onTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("input,textarea,select,dialog,button")) {
      touchStartRef.current = null;
      return;
    }
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const touch = e.changedTouches[0];
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 60) return;
    switchTab(dx < 0 ? "history" : "bookmarks");
  };

  return (
    <MainLayout>
      <section
        className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Print-only header: the interactive chrome is hidden when printing. */}
        <div className="hidden print:block">
          <h1 className="font-display text-2xl font-extrabold">
            Kokunime — {activeTab === "bookmarks" ? "Anime Tersimpan" : "Riwayat Tontonan"}
          </h1>
          <p className="mt-1 text-sm">
            {sortedItems.length} judul • dicetak {new Date().toLocaleDateString("id-ID")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchTab("bookmarks")}
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
                onClick={() => switchTab("history")}
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
                <span className="font-mono text-[10px] text-ink-muted">
                  {dragOverFolder !== null ? "Lepaskan ke folder tujuan ↓" : "Folder:"}
                </span>
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
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverFolder(f);
                    }}
                    onDragLeave={() => setDragOverFolder((prev) => (prev === f ? null : prev))}
                    onDrop={(e) => {
                      e.preventDefault();
                      const slug = e.dataTransfer.getData("text/plain");
                      setDragOverFolder(null);
                      if (slug) assignFolder(f, [slug]);
                    }}
                    title={`Filter folder ${f} — lepaskan kartu ke sini untuk memindahkan`}
                    className={`rounded-sm border-2 px-2.5 py-0.5 font-mono text-[10px] transition-all cursor-pointer ${
                      dragOverFolder === f
                        ? "border-border bg-nb-lime font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
                        : folderFilter === f
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
                  onClick={() => {
                    setSelectMode((prev) => !prev);
                    setSelectedSlugs([]);
                  }}
                  aria-pressed={selectMode}
                  title="Pilih beberapa anime untuk aksi massal"
                  className={`rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs font-semibold shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer ${
                    selectMode ? "bg-accent text-(--accent-ink) font-bold" : "bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  ☑ Pilih
                </button>
                <button
                  type="button"
                  onClick={copySyncLink}
                  title="Salin tautan sinkronisasi (bookmark + progres menonton) untuk perangkat lain"
                  className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  {shareCopied ? "✓ Link Disalin" : "☁️ Sync Cloud"}
                </button>
                <button
                  type="button"
                  onClick={() => copyMarkdown(bookmarks)}
                  title="Salin seluruh daftar tersimpan sebagai Markdown"
                  className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  Salin MD
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  title="Cetak daftar tontonan"
                  className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  Cetak 🖨
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
              {sortedItems.map((item) => (
                <BookmarkListRow
                  key={item.slug}
                  item={item}
                  bookmark={activeTab === "bookmarks" ? (item as BookmarkItem) : null}
                  isBookmarkTab={activeTab === "bookmarks"}
                  selectMode={selectMode}
                  selected={selectedSlugs.includes(item.slug)}
                  nextEpisode={nextEpisodes.get(item.slug)}
                  onToggleSelected={toggleSelected}
                  onRemove={handleRemoveItem}
                  onEditMeta={setMetaDialogSlug}
                />
              ))}
            </div>
          ) : (
            <div className="nb-cycle mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-5 lg:gap-3.5 xl:grid-cols-6 2xl:grid-cols-6">
              {sortedItems.map((item, index) => {
                const bookmark = activeTab === "bookmarks" ? (item as BookmarkItem) : null;
                return (
                  <div
                    key={item.slug}
                    draggable={activeTab === "bookmarks"}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", item.slug);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    className="group relative flex flex-col"
                  >
                    {nextEpisodes.has(item.slug) && (
                      <Link
                        href={`/anime/${item.slug}#ep-${nextEpisodes.get(item.slug)}`}
                        title={`Lanjut menonton episode ${nextEpisodes.get(item.slug)}`}
                        className="absolute left-1.5 top-1.5 z-10 rounded-sm border-2 border-border bg-nb-lime px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-transform hover:-translate-y-0.5"
                      >
                        ▶ {nextEpisodes.get(item.slug)}
                      </Link>
                    )}
                    {selectMode && activeTab === "bookmarks" && (
                      <label className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border-2 border-border bg-surface-solid shadow-[2px_2px_0_0_var(--border)]">
                        <input
                          type="checkbox"
                          checked={selectedSlugs.includes(item.slug)}
                          onChange={() => toggleSelected(item.slug)}
                          aria-label={`Pilih ${item.title}`}
                          className="h-3.5 w-3.5 cursor-pointer accent-(--accent)"
                        />
                      </label>
                    )}
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
                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 px-1 text-[11px] text-ink-muted print:hidden">
                        <span
                          className="min-w-0 truncate"
                          title={bookmark.notes ? `Catatan: ${bookmark.notes}` : undefined}
                        >
                          {bookmark.notes ? `📝 ${bookmark.notes}` : bookmark.folder ? `📁 ${bookmark.folder}` : ""}
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setMetaDialogSlug(item.slug);
                            }}
                            className="hover:text-accent font-mono transition-colors cursor-pointer"
                            title="Edit rating, folder & catatan"
                            aria-label={`Edit detail ${item.title}`}
                          >
                            ✎ Atur
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveItem(item);
                            }}
                            className="hover:text-accent font-mono transition-colors cursor-pointer"
                            title="Hapus dari Tersimpan"
                            aria-label={`Hapus ${item.title}`}
                          >
                            ✕
                          </button>
                        </span>
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

        {/* Bulk action bar (selection mode) */}
        {selectMode && activeTab === "bookmarks" && selectedSlugs.length > 0 && (
          <div className="fixed bottom-4 left-1/2 z-[60] flex w-[min(94vw,42rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-sm border-2 border-border bg-surface-solid px-3 py-2 shadow-[4px_4px_0_0_var(--border)] print:hidden">
            <span className="font-mono text-xs font-bold text-ink">{selectedSlugs.length} dipilih</span>
            <select
              value={bulkFolderChoice}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "__new__") {
                  setBulkNewFolder("");
                  return;
                }
                setBulkNewFolder(null);
                setBulkFolderChoice("");
                if (value === "__none__") assignFolder(undefined, selectedSlugs);
                else if (value) assignFolder(value, selectedSlugs);
              }}
              aria-label="Pindahkan item terpilih ke folder"
              className="h-8 cursor-pointer rounded-sm border-2 border-border bg-surface px-2 font-mono text-xs text-ink outline-none focus:border-accent"
            >
              <option value="">Pindah ke folder…</option>
              <option value="__none__">— Tanpa folder —</option>
              {folders.map((f) => (
                <option key={f} value={f}>
                  📁 {f}
                </option>
              ))}
              <option value="__new__">＋ Folder baru…</option>
            </select>
            {bulkNewFolder !== null && (
              <span className="flex items-center gap-1">
                <input
                  type="text"
                  value={bulkNewFolder}
                  onChange={(e) => setBulkNewFolder(e.target.value)}
                  placeholder="Nama folder"
                  aria-label="Nama folder baru"
                  className="h-8 w-32 rounded-sm border-2 border-border bg-surface px-2 font-mono text-xs text-ink outline-none focus:border-accent"
                />
                <button
                  type="button"
                  disabled={!bulkNewFolder.trim()}
                  onClick={() => {
                    assignFolder(bulkNewFolder.trim(), selectedSlugs);
                    setBulkNewFolder(null);
                  }}
                  className="h-8 rounded-sm border-2 border-border bg-accent px-2 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] disabled:opacity-50 cursor-pointer"
                >
                  OK
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => copyMarkdown(bookmarks.filter((b) => selectedSlugs.includes(b.slug)))}
              className="h-8 rounded-sm border-2 border-border bg-surface px-2.5 font-mono text-xs font-semibold text-ink-muted transition-all hover:text-ink cursor-pointer"
            >
              Salin MD
            </button>
            <button
              type="button"
              onClick={removeSelected}
              className="h-8 rounded-sm border-2 border-border bg-surface px-2.5 font-mono text-xs font-semibold text-ink-muted transition-all hover:bg-nb-red hover:text-nb-ink cursor-pointer"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectMode(false);
                setSelectedSlugs([]);
              }}
              className="h-8 rounded-sm border-2 border-border bg-surface px-2.5 font-mono text-xs font-semibold text-ink-muted transition-all hover:text-ink cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}

        <BookmarkMetaDialog item={metaDialogItem} folders={folders} onClose={() => setMetaDialogSlug(null)} />
      </section>
    </MainLayout>
  );
};

export default BookmarksPage;

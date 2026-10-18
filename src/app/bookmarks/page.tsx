"use client";

import MainLayout from "@/layouts/main-layout";
import BookmarkMetaDialog from "@/components/bookmark-meta-dialog";
import SectionHeader from "@/components/section-header";
import BookmarksBulkBar from "@/components/bookmarks/bookmarks-bulk-bar";
import BookmarksDayList from "@/components/bookmarks/bookmarks-day-list";
import BookmarksFolderBar from "@/components/bookmarks/bookmarks-folder-bar";
import BookmarksGridView from "@/components/bookmarks/bookmarks-grid-view";
import BookmarksStatusFilters from "@/components/bookmarks/bookmarks-status-filters";
import BookmarksToolbar from "@/components/bookmarks/bookmarks-toolbar";
import EmptyState from "@/components/empty-state";
import { CollectionTab, SortBy, useCollectionData } from "@/hooks/use-collection-data";
import {
  BookmarkItem,
  BookmarkStatus,
  clearAllBookmarks,
  exportBookmarksJson,
  exportBookmarksMalXml,
  getBookmarks,
  importBookmarksJson,
  removeBookmark,
  restoreBookmarks,
  updateBookmarkUserMeta,
} from "@/utils/bookmarks";
import { HistoryItem, clearAllHistory, getHistory, removeHistory, restoreHistory } from "@/utils/history";
import { ProgressEntry, getProgressList, mergeProgressEntries } from "@/utils/progress";
import { dayKey } from "@/utils/collection-format";
import { decodeSyncPayload, encodeSyncPayload } from "@/utils/sync-codec";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useEffect, useMemo, useRef, useState } from "react";

const BookmarksPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<CollectionTab>("bookmarks");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | BookmarkStatus>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [shareCopied, setShareCopied] = useState(false);
  const [metaDialogSlug, setMetaDialogSlug] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const { bookmarks, history, nextEpisodes, folders, allItems, sortedItems, storageStats } = useCollectionData(
    activeTab,
    statusFilter,
    folderFilter,
    filterQuery,
    sortBy,
  );

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

  const metaDialogItem = useMemo(
    () => (metaDialogSlug ? (bookmarks.find((b) => b.slug === metaDialogSlug) ?? null) : null),
    [bookmarks, metaDialogSlug],
  );

  const switchTab = (tab: CollectionTab) => {
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

  const removeDayRange = (timestamp: number) => {
    const key = dayKey(timestamp);
    const snapshot = getHistory().filter((entry) => dayKey(entry.viewedAt) === key);
    if (snapshot.length === 0) return;
    for (const entry of snapshot) removeHistory(entry.slug);
    showToast(`${snapshot.length} riwayat dihapus`, {
      actionLabel: "Urungkan",
      onAction: () => restoreHistory(snapshot),
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
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Kokunime — {activeTab === "bookmarks" ? "Anime Tersimpan" : "Riwayat Tontonan"}
          </h1>
          <p className="mt-1 text-sm">
            {sortedItems.length} judul • dicetak {new Date().toLocaleDateString("id-ID")}
          </p>
        </div>

        <div className="print:hidden">
          <SectionHeader
            kicker="Koleksi pribadi"
            title={activeTab === "bookmarks" ? "Anime Tersimpan" : "Riwayat Terakhir Dilihat"}
            titleAs="h1"
            tone="purple"
            badge={
              <>
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
              </>
            }
            description={
              activeTab === "bookmarks"
                ? "Daftar tontonan tersimpan di perangkat ini — bisa diekspor ke JSON, MAL XML, atau tautan sinkron."
                : "Jejak judul yang terakhir kamu buka di perangkat ini."
            }
            aside={
              <BookmarksToolbar
                activeTab={activeTab}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                allItemsCount={allItems.length}
                bookmarksCount={bookmarks.length}
                filterQuery={filterQuery}
                onFilterQueryChange={setFilterQuery}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                storageStats={storageStats}
                selectMode={selectMode}
                onToggleSelectMode={() => {
                  setSelectMode((prev) => !prev);
                  setSelectedSlugs([]);
                }}
                shareCopied={shareCopied}
                onCopySyncLink={copySyncLink}
                onCopyMarkdownAll={() => copyMarkdown(bookmarks)}
                onExportJson={exportBookmarksJson}
                onExportMalXml={exportBookmarksMalXml}
                onImport={handleImport}
                onClear={handleClear}
              />
            }
          />

          {activeTab === "bookmarks" && bookmarks.length > 0 && (
            <BookmarksStatusFilters
              bookmarks={bookmarks}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          )}
          {activeTab === "bookmarks" && (folders.length > 0 || bookmarks.length > 0) && (
            <BookmarksFolderBar
              folders={folders}
              folderFilter={folderFilter}
              dragOverFolder={dragOverFolder}
              onFolderFilterChange={setFolderFilter}
              onDragOverFolderChange={setDragOverFolder}
              onDropSlug={(folder, slug) => assignFolder(folder, [slug])}
            />
          )}
        </div>

        {/* List/grid item titles render as h3; hidden h2 keeps the outline
            valid (axe heading-order) without changing the visual design. */}
        <h2 className="sr-only">{activeTab === "bookmarks" ? "Anime tersimpan" : "Riwayat tontonan"}</h2>

        {sortedItems.length > 0 ? (
          viewMode === "list" ? (
            <BookmarksDayList
              items={sortedItems}
              activeTab={activeTab}
              selectMode={selectMode}
              selectedSlugs={selectedSlugs}
              nextEpisodes={nextEpisodes}
              onToggleSelected={toggleSelected}
              onRemove={handleRemoveItem}
              onEditMeta={setMetaDialogSlug}
              onRemoveDay={removeDayRange}
            />
          ) : (
            <BookmarksGridView
              items={sortedItems}
              activeTab={activeTab}
              selectMode={selectMode}
              selectedSlugs={selectedSlugs}
              nextEpisodes={nextEpisodes}
              onToggleSelected={toggleSelected}
              onRemove={handleRemoveItem}
              onEditMeta={setMetaDialogSlug}
            />
          )
        ) : (
          <EmptyState
            className="mt-10"
            icon={
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
            }
            title={activeTab === "bookmarks" ? "Belum ada anime tersimpan" : "Belum ada riwayat tontonan"}
            message={
              activeTab === "bookmarks"
                ? "Klik tombol bookmark pada anime mana saja untuk menyimpannya ke daftar ini secara offline."
                : "Anime yang Anda buka akan otomatis tercatat di sini."
            }
          >
            <Link href="/" className="btn-primary">
              Jelajahi Katalog
            </Link>
          </EmptyState>
        )}

        {/* Bulk action bar (selection mode) */}
        {selectMode && activeTab === "bookmarks" && selectedSlugs.length > 0 && (
          <BookmarksBulkBar
            selectedSlugs={selectedSlugs}
            folders={folders}
            onAssignFolder={assignFolder}
            onCopyMarkdownSelected={() => copyMarkdown(bookmarks.filter((b) => selectedSlugs.includes(b.slug)))}
            onRemoveSelected={removeSelected}
            onCancel={() => {
              setSelectMode(false);
              setSelectedSlugs([]);
            }}
          />
        )}

        <BookmarkMetaDialog item={metaDialogItem} folders={folders} onClose={() => setMetaDialogSlug(null)} />
      </section>
    </MainLayout>
  );
};

export default BookmarksPage;

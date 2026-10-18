"use client";

import MainLayout from "@/layouts/main-layout";
import BookmarkMetaDialog from "@/components/bookmark-meta-dialog";
import SectionHeader from "@/components/section-header";
import BookmarksBulkBar from "@/components/bookmarks/bookmarks-bulk-bar";
import BookmarksDayList from "@/components/bookmarks/bookmarks-day-list";
import BookmarksFolderBar from "@/components/bookmarks/bookmarks-folder-bar";
import BookmarksGridView from "@/components/bookmarks/bookmarks-grid-view";
import BookmarksQueueView from "@/components/bookmarks/bookmarks-queue-view";
import BookmarksStatusFilters from "@/components/bookmarks/bookmarks-status-filters";
import BookmarksToolbar from "@/components/bookmarks/bookmarks-toolbar";
import CollectionCheckerDialog from "@/components/bookmarks/collection-checker-dialog";
import EmptyState from "@/components/empty-state";
import { useSyncLink } from "@/hooks/use-sync-link";
import { CollectionTab, SortBy, useCollectionData } from "@/hooks/use-collection-data";
import {
  BookmarkItem,
  BookmarkStatus,
  exportBookmarksJson,
  exportBookmarksMalXml,
  getFolderOrder,
  setFolderOrder,
} from "@/utils/bookmarks";
import {
  addBookmarksToQueue,
  assignBookmarksToFolder,
  clearCollectionTab,
  copyBookmarksMarkdown,
  exportBookmarksSubsetIcs,
  exportBookmarksSubsetJson,
  importBookmarksFromFile,
  removeBookmarksSubset,
  removeCollection,
  removeCollectionItem,
  removeHistoryDay,
  setBookmarksRating,
} from "@/utils/collection-actions";
import { addCollection, renameCollection } from "@/utils/collections";
import { HistoryItem } from "@/utils/history";
import { exportShareCard } from "@/utils/share-card";
import { showToast } from "@/utils/toast";
import { getQueue, subscribeQueue, type QueueItem } from "@/utils/watch-queue";
import Link from "next/link";
import { JSX, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

const SERVER_EMPTY_QUEUE: QueueItem[] = [];

const BookmarksPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<CollectionTab>("bookmarks");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | BookmarkStatus>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [metaDialogSlug, setMetaDialogSlug] = useState<string | null>(null);
  const [checkerOpen, setCheckerOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [folderOrder, setFolderOrderState] = useState<string[]>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const queue = useSyncExternalStore(subscribeQueue, getQueue, () => SERVER_EMPTY_QUEUE);
  const { shareCopied, copySyncLink } = useSyncLink();

  const { bookmarks, history, nextEpisodes, folders, allItems, sortedItems, storageStats } = useCollectionData(
    activeTab,
    statusFilter,
    folderFilter,
    filterQuery,
    sortBy,
    folderOrder,
  );

  // Folder order is persisted locally; read it after mount so SSR and the
  // first client render agree (no hydration mismatch).
  useEffect(() => setFolderOrderState(getFolderOrder()), []);

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
    if (activeTab === "queue") return;
    clearCollectionTab(activeTab);
  };

  const handleRemoveItem = (item: BookmarkItem | HistoryItem) => {
    if (activeTab === "queue") return;
    removeCollectionItem(activeTab, item);
  };

  const reorderFolder = (from: string, to: string) => {
    if (from === to) return;
    const order = [...folders];
    const fromIndex = order.indexOf(from);
    const toIndex = order.indexOf(to);
    if (fromIndex === -1 || toIndex === -1) return;
    order.splice(fromIndex, 1);
    order.splice(toIndex, 0, from);
    setFolderOrder(order);
    setFolderOrderState(order);
    showToast(`Folder ${from} dipindah`);
  };

  // PNG card for one folder: count, average rating, top-rated titles.
  const shareFolderCard = async (folder: string): Promise<void> => {
    const items = bookmarks.filter((b) => b.folder === folder);
    const rated = items.filter((b) => typeof b.rating === "number");
    const average =
      rated.length > 0 ? (rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
    const shorten = (title: string) => (title.length > 26 ? `${title.slice(0, 26)}…` : title);
    const result = await exportShareCard(
      {
        kicker: "Folder koleksi",
        title: folder,
        accent: "#c4a1ff",
        rows: [
          { label: "Isi", value: `${items.length} anime` },
          { label: "Rating rata-rata", value: average },
          ...[...rated]
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 3)
            .map((b) => ({ label: "⭐", value: shorten(b.title) })),
        ],
        footer: "kokunime • data lokal perangkat",
      },
      `kokunime-folder-${folder.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.png`,
    );
    if (result === "downloaded") showToast("Kartu folder diunduh sebagai PNG");
    else if (result === "failed") showToast("Gagal membuat kartu PNG");
  };

  const toggleSelected = (slug: string) => {
    setSelectedSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  // Custom-collection handlers: keep the filter and its members consistent —
  // rename re-points every bookmark (see collections.ts) and delete keeps them.
  const createCollection = (name: string) => {
    const result = addCollection(name);
    if (result === "added") showToast(`Koleksi ${name} dibuat — isi lewat "Pindah ke folder…" atau seret kartu`);
    else if (result === "exists") showToast("Nama koleksi sudah ada");
    else showToast("Nama koleksi tidak boleh kosong");
  };

  const renameFolder = (from: string, to: string) => {
    const result = renameCollection(from, to);
    if (result === "renamed") {
      setFolderFilter(to);
      showToast(`Koleksi ${from} → ${to}`);
    } else if (result === "exists") showToast("Nama koleksi sudah dipakai");
    else if (result === "missing") showToast("Koleksi tidak ditemukan");
    else showToast("Nama koleksi tidak valid");
  };

  const deleteFolder = (name: string) => {
    if (folderFilter === name) setFolderFilter("all");
    removeCollection(name);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importBookmarksFromFile(file);
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
    const tabs: CollectionTab[] = ["bookmarks", "queue", "history"];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = Math.min(tabs.length - 1, Math.max(0, currentIndex + (dx < 0 ? 1 : -1)));
    switchTab(tabs[nextIndex] ?? "bookmarks");
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
            Kokunime —{" "}
            {activeTab === "bookmarks"
              ? "Anime Tersimpan"
              : activeTab === "queue"
                ? "Antrean Tonton"
                : "Riwayat Tontonan"}
          </h1>
          <p className="mt-1 text-sm">
            {activeTab === "queue" ? queue.length : sortedItems.length} judul • dicetak{" "}
            {new Date().toLocaleDateString("id-ID")}
          </p>
        </div>

        <div className="print:hidden">
          <SectionHeader
            kicker="Koleksi pribadi"
            title={
              activeTab === "bookmarks"
                ? "Anime Tersimpan"
                : activeTab === "queue"
                  ? "Antrean Tonton"
                  : "Riwayat Terakhir Dilihat"
            }
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
                  onClick={() => switchTab("queue")}
                  className={`rounded-sm border-2 border-border px-4 py-1.5 font-display text-sm font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                    activeTab === "queue"
                      ? "bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                      : "bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  Antrean ({queue.length})
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
                : activeTab === "queue"
                  ? "Urutan tontonan berikutnya — seret atau pakai ▲/▼ untuk mengatur, lalu mulai dari atas."
                  : "Jejak judul yang terakhir kamu buka di perangkat ini."
            }
            aside={
              activeTab === "queue" ? undefined : (
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
                  onOpenChecker={() => setCheckerOpen(true)}
                  shareCopied={shareCopied}
                  onCopySyncLink={copySyncLink}
                  onCopyMarkdownAll={() => void copyBookmarksMarkdown(bookmarks)}
                  onExportJson={exportBookmarksJson}
                  onExportMalXml={exportBookmarksMalXml}
                  onImport={handleImport}
                  onClear={handleClear}
                />
              )
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
              onDropSlug={(folder, slug) => assignBookmarksToFolder(folder, [slug])}
              onReorderFolder={reorderFolder}
              onShareFolder={(folder) => void shareFolderCard(folder)}
              onCreateCollection={createCollection}
              onRenameFolder={renameFolder}
              onDeleteFolder={deleteFolder}
            />
          )}
        </div>

        {/* List/grid item titles render as h3; hidden h2 keeps the outline
            valid (axe heading-order) without changing the visual design. */}
        <h2 className="sr-only">
          {activeTab === "bookmarks"
            ? "Anime tersimpan"
            : activeTab === "queue"
              ? "Antrean tonton"
              : "Riwayat tontonan"}
        </h2>

        {activeTab === "queue" ? (
          <BookmarksQueueView />
        ) : sortedItems.length > 0 ? (
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
              onRemoveDay={removeHistoryDay}
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
            onAssignFolder={assignBookmarksToFolder}
            onCopyMarkdownSelected={() =>
              void copyBookmarksMarkdown(bookmarks.filter((b) => selectedSlugs.includes(b.slug)))
            }
            onRemoveSelected={() => {
              if (removeBookmarksSubset(selectedSlugs)) setSelectedSlugs([]);
            }}
            onAddToQueue={() => addBookmarksToQueue(selectedSlugs, () => switchTab("queue"))}
            onExportSelectedJson={() => exportBookmarksSubsetJson(selectedSlugs)}
            onExportIcsSelected={() => exportBookmarksSubsetIcs(selectedSlugs)}
            onSetRating={(rating) => setBookmarksRating(selectedSlugs, rating)}
            onCancel={() => {
              setSelectMode(false);
              setSelectedSlugs([]);
            }}
          />
        )}

        <BookmarkMetaDialog item={metaDialogItem} folders={folders} onClose={() => setMetaDialogSlug(null)} />
        <CollectionCheckerDialog open={checkerOpen} onClose={() => setCheckerOpen(false)} bookmarks={bookmarks} />
      </section>
    </MainLayout>
  );
};

export default BookmarksPage;

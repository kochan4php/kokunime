"use client";

import { CollectionTab, SortBy } from "@/hooks/use-collection-data";
import { ChangeEvent, JSX } from "react";

interface BookmarksToolbarProps {
  activeTab: CollectionTab;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  allItemsCount: number;
  bookmarksCount: number;
  filterQuery: string;
  onFilterQueryChange: (value: string) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  storageStats: { formattedUsed: string; percentage: number };
  selectMode: boolean;
  onToggleSelectMode: () => void;
  onOpenChecker: () => void;
  shareCopied: boolean;
  onCopySyncLink: () => void;
  onCopyMarkdownAll: () => void;
  onExportJson: () => void;
  onExportMalXml: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const actionButtonClass =
  "rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer";

// Right-hand control cluster of the bookmarks page: view mode, filter, sort,
// storage badge, sync/export/import and clear.
const BookmarksToolbar = ({
  activeTab,
  viewMode,
  onViewModeChange,
  allItemsCount,
  bookmarksCount,
  filterQuery,
  onFilterQueryChange,
  sortBy,
  onSortByChange,
  storageStats,
  selectMode,
  onToggleSelectMode,
  onOpenChecker,
  shareCopied,
  onCopySyncLink,
  onCopyMarkdownAll,
  onExportJson,
  onExportMalXml,
  onImport,
  onClear,
}: BookmarksToolbarProps): JSX.Element => (
  <div className="flex flex-wrap items-center gap-2">
    {/* View Mode Toggle */}
    <div className="flex items-center gap-1 rounded-sm border-2 border-border bg-surface p-0.5">
      <button
        type="button"
        onClick={() => onViewModeChange("grid")}
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
        onClick={() => onViewModeChange("list")}
        aria-label="Tampilan List"
        title="Tampilan List"
        className={`flex h-7 w-7 items-center justify-center rounded-sm text-xs transition-all cursor-pointer ${
          viewMode === "list" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
        }`}
      >
        ☰
      </button>
    </div>

    {allItemsCount > 3 && (
      <input
        type="text"
        value={filterQuery}
        onChange={(e) => onFilterQueryChange(e.target.value)}
        placeholder="Filter daftar..."
        aria-label="Filter anime di daftar ini"
        className="h-8 rounded-sm border-2 border-border bg-surface px-3 text-xs text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent"
      />
    )}
    {activeTab === "bookmarks" && bookmarksCount > 1 && (
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as SortBy)}
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
          onClick={onOpenChecker}
          title="Periksa judul duplikat dan tautan yang mati"
          className={actionButtonClass}
        >
          🩺 Cek
        </button>
        <button
          type="button"
          onClick={onToggleSelectMode}
          aria-pressed={selectMode}
          title="Pilih beberapa anime untuk aksi massal"
          className={`rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs font-semibold shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer ${
            selectMode ? "bg-accent text-(--accent-ink) font-bold" : "bg-surface text-ink-muted hover:text-ink"
          }`}
        >
          ☑ Pilih
        </button>
        <button
          type="button"
          onClick={onCopySyncLink}
          title="Salin tautan sinkronisasi v3 (bookmark, progres, riwayat, antrean, pengaturan, koleksi) untuk perangkat lain"
          className={actionButtonClass}
        >
          {shareCopied ? "✓ Link Disalin" : "☁️ Sync Cloud"}
        </button>
        <button
          type="button"
          onClick={onCopyMarkdownAll}
          title="Salin seluruh daftar tersimpan sebagai Markdown"
          className={actionButtonClass}
        >
          Salin MD
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          title="Cetak daftar tontonan"
          className={actionButtonClass}
        >
          Cetak 🖨
        </button>
        <button
          type="button"
          onClick={onExportJson}
          title="Export backup bookmark ke file JSON"
          className={actionButtonClass}
        >
          Export .json
        </button>
        <button
          type="button"
          onClick={onExportMalXml}
          title="Export daftar tontonan ke format XML MyAnimeList"
          className={actionButtonClass}
        >
          Export MAL .xml
        </button>
        <label
          title="Import backup bookmark dari file JSON, AniList JSON, atau MyAnimeList XML"
          className={`cursor-pointer ${actionButtonClass}`}
        >
          Import JSON / MAL XML
          <input type="file" accept=".json,.xml" onChange={onImport} className="hidden" />
        </label>
      </>
    )}
    {allItemsCount > 0 && (
      <button
        type="button"
        onClick={onClear}
        className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-red hover:text-nb-ink active:translate-y-0 active:shadow-none cursor-pointer"
      >
        Hapus Semua
      </button>
    )}
  </div>
);

export default BookmarksToolbar;

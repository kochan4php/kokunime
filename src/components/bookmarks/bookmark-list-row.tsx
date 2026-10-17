"use client";

import { BookmarkItem } from "@/utils/bookmarks";
import { HistoryItem } from "@/utils/history";
import Link from "next/link";
import { JSX } from "react";

interface BookmarkListRowProps {
  item: BookmarkItem | HistoryItem;
  bookmark: BookmarkItem | null;
  isBookmarkTab: boolean;
  selectMode: boolean;
  selected: boolean;
  nextEpisode?: number | undefined;
  onToggleSelected: (slug: string) => void;
  onRemove: (item: BookmarkItem | HistoryItem) => void;
  onEditMeta: (slug: string) => void;
}

// One saved/history entry in list view: drag, multi-select, meta edit, actions.
const BookmarkListRow = ({
  item,
  bookmark,
  isBookmarkTab,
  selectMode,
  selected,
  nextEpisode,
  onToggleSelected,
  onRemove,
  onEditMeta,
}: BookmarkListRowProps): JSX.Element => (
  <div
    key={item.slug}
    draggable={isBookmarkTab}
    onDragStart={(e) => {
      e.dataTransfer.setData("text/plain", item.slug);
      e.dataTransfer.effectAllowed = "move";
    }}
    className="density-row group relative flex items-center justify-between gap-2.5 sm:gap-3.5 rounded-sm border-2 border-border bg-surface-solid p-2 sm:p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--border)]"
  >
    {selectMode && isBookmarkTab && (
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelected(item.slug)}
        aria-label={`Pilih ${item.title}`}
        className="h-4 w-4 shrink-0 cursor-pointer accent-(--accent)"
      />
    )}
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
          {isBookmarkTab ? (
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
                <span className="rounded-sm border border-border bg-nb-red px-1.5 font-bold text-nb-ink">⛔ Drop</span>
              )}
              {bookmark?.rating && <span>• ⭐ {bookmark.rating}/10</span>}
              {bookmark?.folder && <span>• 📁 {bookmark.folder}</span>}
              {bookmark?.notes && <span className="truncate">• 📝 {bookmark.notes}</span>}
            </>
          ) : (
            <span>{item.release || "Dilihat"}</span>
          )}
        </div>
      </div>
    </Link>
    <div className="flex items-center gap-2 shrink-0">
      {nextEpisode !== undefined && (
        <Link
          href={`/anime/${item.slug}#ep-${nextEpisode}`}
          title={`Lanjut menonton episode ${nextEpisode}`}
          className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-1 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          ▶ Eps {nextEpisode}
        </Link>
      )}
      {isBookmarkTab && (
        <button
          type="button"
          onClick={() => onEditMeta(item.slug)}
          title="Edit rating, folder & catatan"
          aria-label={`Edit detail ${item.title}`}
          className="rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[11px] text-ink-muted transition-all hover:text-ink cursor-pointer"
        >
          ✎
        </button>
      )}
      <button
        type="button"
        onClick={() => onRemove(item)}
        title={isBookmarkTab ? "Hapus dari Tersimpan" : "Hapus dari riwayat"}
        aria-label={`Hapus ${item.title}`}
        className="rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[11px] text-ink-muted transition-all hover:bg-nb-red hover:text-nb-ink cursor-pointer print:hidden"
      >
        ✕
      </button>
      <Link
        href={`/anime/${item.slug}`}
        className="rounded-sm border-2 border-border bg-accent px-2.5 py-1 font-mono text-[11px] font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_0_var(--border)]"
      >
        Buka →
      </Link>
    </div>
  </div>
);

export default BookmarkListRow;

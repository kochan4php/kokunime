"use client";

import {
  BookmarkStatus,
  getBookmarks,
  isBookmarked,
  subscribeBookmarks,
  toggleBookmark,
  updateBookmarkStatus,
} from "@/utils/bookmarks";
import { JSX, useState, useSyncExternalStore } from "react";

interface BookmarkButtonProps {
  slug: string;
  title: string;
  image?: string;
  release?: string;
  className?: string;
  showLabel?: boolean;
  dropdownPlacement?: "top" | "bottom";
}

const BookmarkButton = ({
  slug,
  title,
  image,
  release,
  className = "",
  showLabel = false,
  dropdownPlacement = "bottom",
}: BookmarkButtonProps): JSX.Element => {
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const active = useSyncExternalStore(
    subscribeBookmarks,
    () => isBookmarked(slug),
    () => false,
  );

  const currentItem = useSyncExternalStore(
    subscribeBookmarks,
    () => getBookmarks().find((b) => b.slug === slug),
    () => undefined,
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowActive = toggleBookmark({ slug, title, image, release });
    if (isNowActive && showLabel) {
      setShowStatusPicker(true);
    } else {
      setShowStatusPicker(false);
    }
  };

  const handleSelectStatus = (status: BookmarkStatus) => {
    updateBookmarkStatus(slug, status);
    setShowStatusPicker(false);
  };

  const statusLabel =
    currentItem?.status === "watching"
      ? "📺 Sedang Nonton"
      : currentItem?.status === "plan"
        ? "📌 Rencana Nonton"
        : currentItem?.status === "completed"
          ? "✓ Selesai Nonton"
          : "Tersimpan";

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        aria-label={active ? `Hapus ${title} dari tersimpan` : `Simpan ${title}`}
        title={active ? "Hapus dari tersimpan" : "Simpan anime"}
        className={`inline-flex items-center justify-center gap-2 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
          active
            ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_var(--glow-accent)]"
            : "border-border bg-surface text-ink-muted hover:border-accent hover:text-accent hover:bg-surface-muted"
        } ${showLabel ? "px-4 py-2 text-sm font-semibold" : "h-9 w-9 p-0"} ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
        {showLabel && <span>{active ? statusLabel : "Simpan"}</span>}
      </button>

      {showLabel && active && (
        <button
          type="button"
          onClick={() => setShowStatusPicker((prev) => !prev)}
          title="Ubah status nonton"
          className="ml-1 rounded-full border border-border bg-surface px-2 py-2 text-xs text-ink-muted hover:border-accent hover:text-accent transition-all cursor-pointer"
        >
          ▼
        </button>
      )}

      {showStatusPicker && active && (
        <div
          className={`absolute left-0 z-50 flex flex-col gap-1 rounded-2xl border border-border bg-surface-solid/95 p-2 shadow-2xl backdrop-blur-md min-w-40 ${
            dropdownPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <span className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">Status Nonton</span>
          <button
            type="button"
            onClick={() => handleSelectStatus("watching")}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-ink hover:bg-accent/15 hover:text-accent transition-colors text-left cursor-pointer"
          >
            <span>📺</span>
            <span>Sedang Nonton</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectStatus("plan")}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-ink hover:bg-accent/15 hover:text-accent transition-colors text-left cursor-pointer"
          >
            <span>📌</span>
            <span>Rencana Nonton</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectStatus("completed")}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-ink hover:bg-accent/15 hover:text-accent transition-colors text-left cursor-pointer"
          >
            <span>✓</span>
            <span>Selesai Nonton</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BookmarkButton;

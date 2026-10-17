"use client";

import { BookmarkItem, BookmarkStatus } from "@/utils/bookmarks";
import { JSX } from "react";

interface BookmarksStatusFiltersProps {
  bookmarks: BookmarkItem[];
  statusFilter: "all" | BookmarkStatus;
  onStatusFilterChange: (status: "all" | BookmarkStatus) => void;
}

const chipClass = (active: boolean): string =>
  `rounded-sm border-2 px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
    active
      ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
      : "border-border bg-surface text-ink-muted hover:text-ink"
  }`;

// Status chips (Semua / Sedang Nonton / ...) with live counts.
const BookmarksStatusFilters = ({
  bookmarks,
  statusFilter,
  onStatusFilterChange,
}: BookmarksStatusFiltersProps): JSX.Element => (
  <div className="mt-3 flex flex-wrap items-center gap-1.5">
    <button type="button" onClick={() => onStatusFilterChange("all")} className={chipClass(statusFilter === "all")}>
      Semua ({bookmarks.length})
    </button>
    <button
      type="button"
      onClick={() => onStatusFilterChange("watching")}
      className={chipClass(statusFilter === "watching")}
    >
      📺 Sedang Nonton ({bookmarks.filter((b) => b.status === "watching").length})
    </button>
    <button type="button" onClick={() => onStatusFilterChange("plan")} className={chipClass(statusFilter === "plan")}>
      📌 Rencana ({bookmarks.filter((b) => b.status === "plan").length})
    </button>
    <button
      type="button"
      onClick={() => onStatusFilterChange("completed")}
      className={chipClass(statusFilter === "completed")}
    >
      ✓ Selesai ({bookmarks.filter((b) => b.status === "completed").length})
    </button>
    <button
      type="button"
      onClick={() => onStatusFilterChange("dropped")}
      className={chipClass(statusFilter === "dropped")}
    >
      ⛔ Drop ({bookmarks.filter((b) => b.status === "dropped").length})
    </button>
  </div>
);

export default BookmarksStatusFilters;

"use client";

import { JSX } from "react";

interface BookmarksFolderBarProps {
  folders: string[];
  folderFilter: string;
  dragOverFolder: string | null;
  onFolderFilterChange: (folder: string) => void;
  onDragOverFolderChange: (folder: string | null) => void;
  onDropSlug: (folder: string, slug: string) => void;
}

const folderChipClass = (active: boolean, dragOver: boolean): string =>
  `rounded-sm border-2 px-2.5 py-0.5 font-mono text-[10px] transition-all cursor-pointer ${
    dragOver
      ? "border-border bg-nb-lime font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
      : active
        ? "border-border bg-accent text-(--accent-ink) font-bold shadow-[2px_2px_0_0_var(--border)]"
        : "border-border bg-surface text-ink-muted hover:text-ink"
  }`;

// Folder filter chips; dropping a card (text/plain slug) onto a chip moves it.
const BookmarksFolderBar = ({
  folders,
  folderFilter,
  dragOverFolder,
  onFolderFilterChange,
  onDragOverFolderChange,
  onDropSlug,
}: BookmarksFolderBarProps): JSX.Element => (
  <div className="mt-2 flex flex-wrap items-center gap-1.5">
    <span className="font-mono text-[10px] text-ink-muted">
      {dragOverFolder !== null ? "Lepaskan ke folder tujuan ↓" : "Folder:"}
    </span>
    <button
      type="button"
      onClick={() => onFolderFilterChange("all")}
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
        onClick={() => onFolderFilterChange(f)}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOverFolderChange(f);
        }}
        onDragLeave={() => {
          if (dragOverFolder === f) onDragOverFolderChange(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          const slug = e.dataTransfer.getData("text/plain");
          onDragOverFolderChange(null);
          if (slug) onDropSlug(f, slug);
        }}
        title={`Filter folder ${f} — lepaskan kartu ke sini untuk memindahkan`}
        className={folderChipClass(folderFilter === f, dragOverFolder === f)}
      >
        📁 {f}
      </button>
    ))}
  </div>
);

export default BookmarksFolderBar;

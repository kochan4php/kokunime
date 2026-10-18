"use client";

import { JSX } from "react";

interface BookmarksFolderBarProps {
  folders: string[];
  folderFilter: string;
  dragOverFolder: string | null;
  onFolderFilterChange: (folder: string) => void;
  onDragOverFolderChange: (folder: string | null) => void;
  onDropSlug: (folder: string, slug: string) => void;
  onReorderFolder?: ((from: string, to: string) => void) | undefined;
  onShareFolder?: ((folder: string) => void) | undefined;
}

const folderChipClass = (active: boolean, dragOver: boolean): string =>
  `rounded-sm border-2 px-2.5 py-0.5 font-mono text-[10px] transition-all cursor-pointer ${
    dragOver
      ? "border-border bg-nb-lime font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
      : active
        ? "border-border bg-accent text-(--accent-ink) font-bold shadow-[2px_2px_0_0_var(--border)]"
        : "border-border bg-surface text-ink-muted hover:text-ink"
  }`;

// Folder filter chips; dropping a card (text/plain slug) onto a chip moves it,
// dragging one chip onto another reorders the row (order is persisted).
const BookmarksFolderBar = ({
  folders,
  folderFilter,
  dragOverFolder,
  onFolderFilterChange,
  onDragOverFolderChange,
  onDropSlug,
  onReorderFolder,
  onShareFolder,
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
        draggable={Boolean(onReorderFolder)}
        onDragStart={(e) => {
          if (!onReorderFolder) return;
          e.dataTransfer.setData("application/x-kokunime-folder", f);
          e.dataTransfer.effectAllowed = "move";
        }}
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
          onDragOverFolderChange(null);
          const draggedFolder = e.dataTransfer.getData("application/x-kokunime-folder");
          if (draggedFolder && onReorderFolder) {
            onReorderFolder(draggedFolder, f);
            return;
          }
          const slug = e.dataTransfer.getData("text/plain");
          if (slug) onDropSlug(f, slug);
        }}
        title={`Filter folder ${f} — seret untuk mengurutkan, lepas kartu ke sini untuk memindahkan`}
        className={folderChipClass(folderFilter === f, dragOverFolder === f) + " active:cursor-grabbing"}
      >
        📁 {f}
      </button>
    ))}
    {folderFilter !== "all" && onShareFolder && (
      <button
        type="button"
        onClick={() => onShareFolder(folderFilter)}
        title={`Unduh kartu PNG untuk folder ${folderFilter}`}
        className="rounded-sm border-2 border-border bg-nb-purple px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
      >
        🖼️ Kartu folder
      </button>
    )}
  </div>
);

export default BookmarksFolderBar;

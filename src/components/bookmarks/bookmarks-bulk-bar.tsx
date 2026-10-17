"use client";

import { JSX, useState } from "react";

interface BookmarksBulkBarProps {
  selectedSlugs: string[];
  folders: string[];
  onAssignFolder: (folder: string | undefined, slugs: string[]) => void;
  onCopyMarkdownSelected: () => void;
  onRemoveSelected: () => void;
  onCancel: () => void;
}

// Floating bulk-action bar shown while selection mode has picks.
const BookmarksBulkBar = ({
  selectedSlugs,
  folders,
  onAssignFolder,
  onCopyMarkdownSelected,
  onRemoveSelected,
  onCancel,
}: BookmarksBulkBarProps): JSX.Element => {
  const [bulkFolderChoice, setBulkFolderChoice] = useState("");
  const [bulkNewFolder, setBulkNewFolder] = useState<string | null>(null);

  return (
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
          if (value === "__none__") onAssignFolder(undefined, selectedSlugs);
          else if (value) onAssignFolder(value, selectedSlugs);
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
              onAssignFolder(bulkNewFolder.trim(), selectedSlugs);
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
        onClick={onCopyMarkdownSelected}
        className="h-8 rounded-sm border-2 border-border bg-surface px-2.5 font-mono text-xs font-semibold text-ink-muted transition-all hover:text-ink cursor-pointer"
      >
        Salin MD
      </button>
      <button
        type="button"
        onClick={onRemoveSelected}
        className="h-8 rounded-sm border-2 border-border bg-surface px-2.5 font-mono text-xs font-semibold text-ink-muted transition-all hover:bg-nb-red hover:text-nb-ink cursor-pointer"
      >
        Hapus
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="h-8 rounded-sm border-2 border-border bg-surface px-2.5 font-mono text-xs font-semibold text-ink-muted transition-all hover:text-ink cursor-pointer"
      >
        Batal
      </button>
    </div>
  );
};

export default BookmarksBulkBar;

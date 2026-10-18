"use client";

import { MAX_COLLECTION_NAME } from "@/utils/collections";
import { JSX, useEffect, useRef, useState } from "react";

interface BookmarksFolderBarProps {
  folders: string[];
  folderFilter: string;
  dragOverFolder: string | null;
  onFolderFilterChange: (folder: string) => void;
  onDragOverFolderChange: (folder: string | null) => void;
  onDropSlug: (folder: string, slug: string) => void;
  onReorderFolder?: ((from: string, to: string) => void) | undefined;
  onShareFolder?: ((folder: string) => void) | undefined;
  onCreateCollection?: ((name: string) => void) | undefined;
  onRenameFolder?: ((from: string, to: string) => void) | undefined;
  onDeleteFolder?: ((folder: string) => void) | undefined;
}

const folderChipClass = (active: boolean, dragOver: boolean): string =>
  `rounded-sm border-2 px-2.5 py-0.5 font-mono text-[10px] transition-all cursor-pointer ${
    dragOver
      ? "border-border bg-nb-lime font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
      : active
        ? "border-border bg-accent text-(--accent-ink) font-bold shadow-[2px_2px_0_0_var(--border)]"
        : "border-border bg-surface text-ink-muted hover:text-ink"
  }`;

const actionChipClass =
  "rounded-sm border-2 border-border px-2.5 py-0.5 font-mono text-[10px] font-bold transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer";

// Folder filter chips; dropping a card (text/plain slug) onto a chip moves it,
// dragging one chip onto another reorders the row (order is persisted). The
// collection registry keeps empty/renamed groups alive, so "+ Koleksi" and the
// rename/delete chips for the active one live here too.
const BookmarksFolderBar = ({
  folders,
  folderFilter,
  dragOverFolder,
  onFolderFilterChange,
  onDragOverFolderChange,
  onDropSlug,
  onReorderFolder,
  onShareFolder,
  onCreateCollection,
  onRenameFolder,
  onDeleteFolder,
}: BookmarksFolderBarProps): JSX.Element => {
  const [editor, setEditor] = useState<{ mode: "create" | "rename"; value: string } | null>(null);
  const editorInputRef = useRef<HTMLInputElement | null>(null);

  // Focus the inline editor when it opens (user-triggered, so no autofocus attr).
  useEffect(() => {
    if (editor) editorInputRef.current?.focus();
  }, [editor?.mode]);

  const submitEditor = () => {
    if (!editor) return;
    const name = editor.value.trim().slice(0, MAX_COLLECTION_NAME);
    if (!name) return;
    if (editor.mode === "create") onCreateCollection?.(name);
    else onRenameFolder?.(folderFilter, name);
    setEditor(null);
  };

  return (
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
      {onCreateCollection && editor?.mode !== "create" && (
        <button
          type="button"
          onClick={() => setEditor({ mode: "create", value: "" })}
          title="Buat koleksi baru (bisa diisi nanti)"
          className={`${actionChipClass} bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]`}
        >
          ＋ Koleksi
        </button>
      )}
      {onRenameFolder && folderFilter !== "all" && editor?.mode !== "rename" && (
        <button
          type="button"
          onClick={() => setEditor({ mode: "rename", value: folderFilter })}
          title={`Ganti nama koleksi ${folderFilter}`}
          className={`${actionChipClass} bg-nb-purple text-nb-ink shadow-[2px_2px_0_0_var(--border)]`}
        >
          ✏️ Ganti nama
        </button>
      )}
      {onDeleteFolder && folderFilter !== "all" && (
        <button
          type="button"
          onClick={() => onDeleteFolder(folderFilter)}
          title={`Hapus koleksi ${folderFilter} (anime tetap tersimpan)`}
          className={`${actionChipClass} bg-surface text-ink-muted hover:bg-nb-red hover:text-nb-ink`}
        >
          🗑️ Hapus
        </button>
      )}
      {editor && (
        <span className="flex items-center gap-1">
          <input
            type="text"
            ref={editorInputRef}
            value={editor.value}
            maxLength={MAX_COLLECTION_NAME}
            onChange={(e) => setEditor({ ...editor, value: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitEditor();
              if (e.key === "Escape") setEditor(null);
            }}
            placeholder={editor.mode === "create" ? "Nama koleksi baru" : "Nama koleksi"}
            aria-label={editor.mode === "create" ? "Nama koleksi baru" : `Nama baru untuk koleksi ${folderFilter}`}
            className="h-7 w-36 rounded-sm border-2 border-border bg-surface px-2 font-mono text-[11px] text-ink outline-none focus:border-accent"
          />
          <button
            type="button"
            disabled={!editor.value.trim()}
            onClick={submitEditor}
            className="h-7 rounded-sm border-2 border-border bg-accent px-2 font-mono text-[10px] font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] disabled:opacity-50 cursor-pointer"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => setEditor(null)}
            className="h-7 rounded-sm border-2 border-border bg-surface px-2 font-mono text-[10px] font-semibold text-ink-muted transition-all hover:text-ink cursor-pointer"
          >
            Batal
          </button>
        </span>
      )}
      {folderFilter !== "all" && onShareFolder && (
        <button
          type="button"
          onClick={() => onShareFolder(folderFilter)}
          title={`Unduh kartu PNG untuk folder ${folderFilter}`}
          className={`${actionChipClass} bg-nb-purple text-nb-ink shadow-[2px_2px_0_0_var(--border)]`}
        >
          🖼️ Kartu folder
        </button>
      )}
    </div>
  );
};

export default BookmarksFolderBar;

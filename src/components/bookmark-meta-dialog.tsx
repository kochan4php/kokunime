"use client";

import { BookmarkItem, updateBookmarkUserMeta } from "@/utils/bookmarks";
import { buildWeeklyReminderIcs } from "@/utils/ics";
import { showToast } from "@/utils/toast";
import { JSX, useEffect, useRef, useState } from "react";

interface BookmarkMetaDialogProps {
  item: BookmarkItem | null;
  folders: string[];
  onClose: () => void;
}

// Accessible replacement for the old window.prompt() flow: one modal for
// rating (1-10), folder (with existing-folder suggestions) and notes.
const BookmarkMetaDialog = ({ item, folders, onClose }: BookmarkMetaDialogProps): JSX.Element | null => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [folder, setFolder] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (item) {
      setRating(item.rating ?? null);
      setFolder(item.folder ?? "");
      setNotes(item.notes ?? "");
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [item]);

  if (!item) return null;

  const save = (): void => {
    updateBookmarkUserMeta(item.slug, {
      rating,
      folder: folder.trim() ? folder.trim() : null,
      notes: notes.trim() ? notes.trim() : null,
    });
    showToast("Detail tersimpan");
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label={`Detail ${item.title}`}
      className="m-auto w-[min(92vw,26rem)] rounded-sm border-2 border-border bg-surface-solid p-0 text-ink shadow-[6px_6px_0_0_var(--border)] backdrop:bg-black/50"
    >
      <div className="p-4 sm:p-5">
        <h2 className="line-clamp-2 font-display text-base font-bold">{item.title}</h2>

        <fieldset className="mt-4">
          <legend className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">Rating (1-10)</legend>
          <div className="mt-2 flex flex-wrap gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(rating === value ? null : value)}
                aria-pressed={rating === value}
                aria-label={`Beri rating ${value}`}
                className={`h-7 w-7 rounded-sm border-2 font-mono text-[11px] font-bold transition-all cursor-pointer ${
                  rating !== null && value <= rating
                    ? "border-border bg-nb-yellow shadow-[2px_2px_0_0_var(--border)]"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4">
          <label
            htmlFor="bookmark-folder"
            className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted"
          >
            Folder
          </label>
          <input
            id="bookmark-folder"
            type="text"
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
            list="bookmark-folder-options"
            placeholder="Misal: Musim Ini, Rewatch..."
            className="mt-2 w-full rounded-sm border-2 border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <datalist id="bookmark-folder-options">
            {folders.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div className="mt-4">
          <label
            htmlFor="bookmark-notes"
            className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted"
          >
            Catatan
          </label>
          <textarea
            id="bookmark-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Pikiran, progres, atau pengingat..."
            className="mt-2 w-full resize-y rounded-sm border-2 border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          {item && (
            <button
              type="button"
              onClick={() => {
                const blob = new Blob(
                  [
                    buildWeeklyReminderIcs([
                      { title: `Cek episode baru: ${item.title}`, url: `${window.location.origin}/anime/${item.slug}` },
                    ]),
                  ],
                  { type: "text/calendar;charset=utf-8" },
                );
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `kokunime-${item.slug}.ics`;
                anchor.click();
                URL.revokeObjectURL(url);
                showToast("Pengingat mingguan diunduh (.ics)");
              }}
              title="Unduh pengingat mingguan untuk judul ini (.ics)"
              className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
            >
              📅 Pengingat .ics
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted transition-all hover:text-ink cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-sm border-2 border-border bg-accent px-3 py-1.5 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default BookmarkMetaDialog;

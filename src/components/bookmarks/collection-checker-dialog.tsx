"use client";

import { BookmarkItem, getBookmarks, removeBookmark, restoreBookmarks } from "@/utils/bookmarks";
import { findDuplicateGroups } from "@/utils/duplicate-detector";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useEffect, useRef, useState } from "react";

interface CollectionCheckerDialogProps {
  open: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
}

const CHUNK_SIZE = 30;

interface LinkResult {
  slug: string;
  ok: boolean;
}

// "Check collection" dialog: local duplicate detection (title normalization)
// plus an opt-in batch dead-link check against the scraper API.
const CollectionCheckerDialog = ({ open, onClose, bookmarks }: CollectionCheckerDialogProps): JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [linkResults, setLinkResults] = useState<LinkResult[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setLinkResults(null);
      setProgress(0);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const duplicateGroups = findDuplicateGroups(bookmarks).sort((a, b) => b.items.length - a.items.length);

  const removeDuplicates = (group: BookmarkItem[]) => {
    // Keep the newest save; remove the rest (undo restores them).
    const sorted = [...group].sort((a, b) => b.addedAt - a.addedAt);
    const removal = sorted.slice(1);
    if (removal.length === 0) return;
    const snapshot = getBookmarks().filter((b) => removal.some((r) => r.slug === b.slug));
    for (const item of removal) removeBookmark(item.slug);
    showToast(`${removal.length} duplikat dihapus`, {
      actionLabel: "Urungkan",
      onAction: () => restoreBookmarks(snapshot),
    });
  };

  const checkLinks = () => {
    void (async () => {
      setIsChecking(true);
      setProgress(0);
      setLinkResults(null);
      const slugs = bookmarks.map((b) => b.slug);
      const results: LinkResult[] = [];
      try {
        for (let index = 0; index < slugs.length; index += CHUNK_SIZE) {
          const chunk = slugs.slice(index, index + CHUNK_SIZE);
          const response = await fetch(`/api/check-links?slugs=${chunk.map(encodeURIComponent).join(",")}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as { results?: LinkResult[] };
          results.push(...(data.results ?? []));
          setProgress(Math.min(slugs.length, index + chunk.length));
        }
        const dead = results.filter((result) => !result.ok);
        setLinkResults(results);
        showToast(
          dead.length === 0
            ? `Semua ${results.length} tautan masih hidup ✓`
            : `${dead.length} tautan bermasalah dari ${results.length} diperiksa`,
        );
      } catch {
        showToast("Gagal memeriksa tautan — coba lagi nanti");
      } finally {
        setIsChecking(false);
      }
    })();
  };

  const deadResults = (linkResults ?? []).filter((result) => !result.ok);
  const titleOf = (slug: string) => bookmarks.find((b) => b.slug === slug)?.title ?? slug;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label="Pemeriksa koleksi"
      className="m-auto w-[min(94vw,32rem)] rounded-sm border-2 border-border bg-surface-solid p-0 text-ink shadow-[6px_6px_0_0_var(--border)] backdrop:bg-black/50"
    >
      <div className="max-h-[min(85vh,40rem)] overflow-y-auto p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg font-bold">🩺 Pemeriksa Koleksi</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pemeriksa koleksi"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-border bg-surface text-sm font-bold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:text-ink"
          >
            ✕
          </button>
        </div>

        <section className="mt-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">
            Judul duplikat ({duplicateGroups.length} grup)
          </h3>
          {duplicateGroups.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">Tidak ada judul yang terdeteksi duplikat. ✓</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2">
              {duplicateGroups.map((group) => (
                <li key={group.key} className="rounded-sm border-2 border-border bg-nb-yellow/30 px-3 py-2">
                  <ul className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <li key={item.slug} className="flex items-center justify-between gap-2">
                        <Link
                          href={`/anime/${item.slug}`}
                          className="min-w-0 truncate text-xs font-bold text-ink underline decoration-2 underline-offset-2"
                        >
                          {item.title}
                        </Link>
                        <span className="shrink-0 font-mono text-[10px] text-ink-muted">
                          {new Date(item.addedAt).toLocaleDateString("id-ID")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => removeDuplicates(group.items)}
                    className="mt-2 cursor-pointer rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:bg-nb-red hover:text-nb-ink"
                  >
                    Simpan terbaru, hapus sisanya
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-5">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">Tautan mati</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Memeriksa ulang {bookmarks.length} judul ke sumber katalog. Hasilnya di-cache, jadi pemeriksaan berulang
            tidak membebani server.
          </p>
          <button
            type="button"
            onClick={checkLinks}
            disabled={isChecking || bookmarks.length === 0}
            className="mt-2 cursor-pointer rounded-sm border-2 border-border bg-nb-cyan px-3 py-1.5 font-mono text-xs font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:cursor-wait disabled:opacity-60"
          >
            {isChecking ? `Memeriksa… ${progress}/${bookmarks.length}` : "🔍 Periksa tautan"}
          </button>

          {linkResults !== null && (
            <div className="mt-3" role="status" aria-live="polite">
              {deadResults.length === 0 ? (
                <p className="text-sm font-bold text-ink">Semua {linkResults.length} tautan masih hidup ✓</p>
              ) : (
                <>
                  <p className="text-sm font-bold text-ink">{deadResults.length} judul tidak dapat ditemukan lagi:</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {deadResults.map((result) => (
                      <li
                        key={result.slug}
                        className="flex items-center justify-between gap-2 rounded-sm border-2 border-border bg-surface px-2.5 py-1.5"
                      >
                        <span className="min-w-0 truncate text-xs font-bold text-ink">{titleOf(result.slug)}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const snapshot = getBookmarks().find((b) => b.slug === result.slug);
                            removeBookmark(result.slug);
                            setLinkResults((prev) =>
                              prev ? prev.filter((entry) => entry.slug !== result.slug) : prev,
                            );
                            if (snapshot) {
                              showToast(`${snapshot.title} dihapus`, {
                                actionLabel: "Urungkan",
                                onAction: () => restoreBookmarks([snapshot]),
                              });
                            }
                          }}
                          className="shrink-0 cursor-pointer rounded-sm border-2 border-border bg-surface px-2 py-0.5 font-mono text-[11px] font-bold text-ink-muted transition-all hover:bg-nb-red hover:text-nb-ink"
                        >
                          Hapus
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </dialog>
  );
};

export default CollectionCheckerDialog;

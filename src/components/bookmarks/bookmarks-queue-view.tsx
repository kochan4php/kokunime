"use client";

import AnimeImage from "@/components/cards/anime-image";
import {
  QueueItem,
  clearQueue,
  getQueue,
  moveQueueItem,
  removeFromQueue,
  restoreQueueItem,
  subscribeQueue,
} from "@/utils/watch-queue";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useRef, useState, useSyncExternalStore } from "react";

const SERVER_EMPTY: QueueItem[] = [];

const iconButtonClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-border bg-surface font-mono text-xs font-bold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer";

// Watch queue: an ordered "up next" list managed on the bookmarks page.
// Reorder by drag & drop or with the ▲/▼ buttons (keyboard path), then start
// from the top item.
const BookmarksQueueView = (): JSX.Element => {
  const queue = useSyncExternalStore(subscribeQueue, getQueue, () => SERVER_EMPTY);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const handleRemove = (index: number) => {
    const item = queue[index];
    if (!item) return;
    removeFromQueue(item.slug);
    showToast(`${item.title} keluar dari antrean`, {
      actionLabel: "Urungkan",
      onAction: () => restoreQueueItem(item, index),
    });
  };

  const handleClearAll = () => {
    const snapshot = getQueue();
    if (snapshot.length === 0) return;
    if (!window.confirm(`Kosongkan antrean (${snapshot.length} anime)?`)) return;
    clearQueue();
    showToast(`${snapshot.length} anime dikeluarkan dari antrean`, {
      actionLabel: "Urungkan",
      onAction: () => snapshot.forEach((item, index) => restoreQueueItem(item, index)),
    });
  };

  const commitDrop = (target: number) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    setDragIndex(null);
    setDragOverIndex(null);
    if (from === null || from === target) return;
    moveQueueItem(from, target);
  };

  if (queue.length === 0) {
    return (
      <div className="card-shell mt-10">
        <div className="card-core p-10 text-center md:p-14">
          <p className="text-3xl" aria-hidden="true">
            📋
          </p>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">Antrean masih kosong</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Pilih beberapa anime di tab <strong>Tersimpan</strong> (mode pilih), lalu tekan <strong>＋ Antrean</strong>{" "}
            untuk menyusun urutan tontonan berikutnya.
          </p>
        </div>
      </div>
    );
  }

  const first = queue[0];

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        {first && (
          <Link href={`/anime/${first.slug}`} className="btn-primary">
            ▶ Mulai — {first.title.length > 34 ? `${first.title.slice(0, 34)}…` : first.title}
          </Link>
        )}
        <span className="font-mono text-xs font-bold text-ink-muted">{queue.length} anime dalam antrean</span>
        <button type="button" onClick={handleClearAll} className={iconButtonClass + " w-auto px-3"}>
          Kosongkan
        </button>
      </div>

      <ol className="mt-4 flex flex-col gap-2.5" aria-label="Urutan antrean tonton">
        {queue.map((item, index) => (
          <li
            key={item.slug}
            draggable
            onDragStart={(e) => {
              dragIndexRef.current = index;
              setDragIndex(index);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", item.slug);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDragOverIndex(index);
            }}
            onDragLeave={() => setDragOverIndex((prev) => (prev === index ? null : prev))}
            onDrop={(e) => {
              e.preventDefault();
              commitDrop(index);
            }}
            onDragEnd={() => commitDrop(dragIndexRef.current ?? index)}
            className={`card-shell cursor-grab active:cursor-grabbing ${dragIndex === index ? "opacity-50" : ""} ${
              dragOverIndex === index && dragIndex !== index ? "ring-2 ring-accent" : ""
            }`}
          >
            <div className="card-core flex items-center gap-3 p-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-border bg-nb-yellow font-display text-sm font-black text-nb-ink">
                {index + 1}
              </span>
              <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm border-2 border-border bg-surface-muted">
                <AnimeImage src={item.image ?? ""} alt="" fill sizes="44px" className="object-cover" loading="lazy" />
              </div>
              <Link
                href={`/anime/${item.slug}`}
                className="min-w-0 flex-1 truncate font-display text-sm font-bold text-ink hover:text-accent-text hover:underline"
              >
                {item.title}
              </Link>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => moveQueueItem(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Naikkan ${item.title}`}
                  className={iconButtonClass}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveQueueItem(index, index + 1)}
                  disabled={index === queue.length - 1}
                  aria-label={`Turunkan ${item.title}`}
                  className={iconButtonClass}
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  aria-label={`Keluarkan ${item.title} dari antrean`}
                  className={iconButtonClass + " hover:text-red-600"}
                >
                  ✕
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default BookmarksQueueView;

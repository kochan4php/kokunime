"use client";

import CardAnime from "@/components/cards/card-anime";
import { CollectionTab } from "@/hooks/use-collection-data";
import { BookmarkItem } from "@/utils/bookmarks";
import { HistoryItem } from "@/utils/history";
import Link from "next/link";
import { JSX } from "react";

interface BookmarksGridViewProps {
  items: (BookmarkItem | HistoryItem)[];
  activeTab: CollectionTab;
  selectMode: boolean;
  selectedSlugs: string[];
  nextEpisodes: Map<string, number>;
  onToggleSelected: (slug: string) => void;
  onRemove: (item: BookmarkItem | HistoryItem) => void;
  onEditMeta: (slug: string) => void;
}

// Grid view: draggable cards, continue-watching chip, selection checkbox.
const BookmarksGridView = ({
  items,
  activeTab,
  selectMode,
  selectedSlugs,
  nextEpisodes,
  onToggleSelected,
  onRemove,
  onEditMeta,
}: BookmarksGridViewProps): JSX.Element => (
  <div className="nb-cycle mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-5 lg:gap-3.5 xl:grid-cols-6 2xl:grid-cols-6">
    {items.map((item, index) => {
      const bookmark = activeTab === "bookmarks" ? (item as BookmarkItem) : null;
      return (
        // biome-ignore lint/a11y/noStaticElementInteractions: drag is a mouse-only enhancement; card links stay keyboard reachable.
        <div
          key={item.slug}
          draggable={activeTab === "bookmarks"}
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", item.slug);
            e.dataTransfer.effectAllowed = "move";
          }}
          className="group relative flex flex-col"
        >
          {nextEpisodes.has(item.slug) && (
            <Link
              href={`/anime/${item.slug}#ep-${nextEpisodes.get(item.slug)}`}
              title={`Lanjut menonton episode ${nextEpisodes.get(item.slug)}`}
              className="absolute left-1.5 top-1.5 z-10 rounded-sm border-2 border-border bg-nb-lime px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-transform motion-safe:hover:-translate-y-0.5"
            >
              ▶ {nextEpisodes.get(item.slug)}
            </Link>
          )}
          {selectMode && activeTab === "bookmarks" && (
            <label className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border-2 border-border bg-surface-solid shadow-[2px_2px_0_0_var(--border)]">
              <input
                type="checkbox"
                checked={selectedSlugs.includes(item.slug)}
                onChange={() => onToggleSelected(item.slug)}
                aria-label={`Pilih ${item.title}`}
                className="h-3.5 w-3.5 cursor-pointer accent-(--accent)"
              />
            </label>
          )}
          <CardAnime
            path={`/anime/${item.slug}`}
            src={item.image as string}
            title={item.title}
            meta={
              activeTab === "bookmarks"
                ? `${bookmark?.rating ? `⭐ ${bookmark.rating}/10 • ` : ""}${
                    bookmark?.folder ? `📁 ${bookmark.folder} • ` : ""
                  }${
                    bookmark?.status === "watching"
                      ? "📺 Sedang Nonton"
                      : bookmark?.status === "completed"
                        ? "✓ Selesai"
                        : bookmark?.status === "dropped"
                          ? "⛔ Drop"
                          : "📌 Tersimpan"
                  }`
                : item.release || "Dilihat"
            }
            eager={index < 5}
            priority={index === 0}
          />
          {activeTab === "bookmarks" && bookmark && (
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 px-1 text-[11px] text-ink-muted print:hidden">
              <span className="min-w-0 truncate" title={bookmark.notes ? `Catatan: ${bookmark.notes}` : undefined}>
                {bookmark.notes ? `📝 ${bookmark.notes}` : bookmark.folder ? `📁 ${bookmark.folder}` : ""}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onEditMeta(item.slug);
                  }}
                  className="hover:text-accent-text font-mono transition-colors cursor-pointer"
                  title="Edit rating, folder & catatan"
                  aria-label={`Edit detail ${item.title}`}
                >
                  ✎ Atur
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove(item);
                  }}
                  className="hover:text-accent-text font-mono transition-colors cursor-pointer"
                  title="Hapus dari Tersimpan"
                  aria-label={`Hapus ${item.title}`}
                >
                  ✕
                </button>
              </span>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default BookmarksGridView;

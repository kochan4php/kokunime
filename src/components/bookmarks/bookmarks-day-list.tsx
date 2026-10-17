"use client";

import BookmarkListRow from "@/components/bookmarks/bookmark-list-row";
import { CollectionTab } from "@/hooks/use-collection-data";
import { dayKey, dayLabel, itemTime } from "@/utils/collection-format";
import { BookmarkItem } from "@/utils/bookmarks";
import { HistoryItem } from "@/utils/history";
import { Fragment, JSX } from "react";

interface BookmarksDayListProps {
  items: (BookmarkItem | HistoryItem)[];
  activeTab: CollectionTab;
  selectMode: boolean;
  selectedSlugs: string[];
  nextEpisodes: Map<string, number>;
  onToggleSelected: (slug: string) => void;
  onRemove: (item: BookmarkItem | HistoryItem) => void;
  onEditMeta: (slug: string) => void;
  onRemoveDay: (timestamp: number) => void;
}

// List view: history entries grouped by day with a per-day delete action.
const BookmarksDayList = ({
  items,
  activeTab,
  selectMode,
  selectedSlugs,
  nextEpisodes,
  onToggleSelected,
  onRemove,
  onEditMeta,
  onRemoveDay,
}: BookmarksDayListProps): JSX.Element => (
  <div className="mt-8 flex flex-col gap-2">
    {items.map((item, index) => {
      const previous = items[index - 1];
      const showDay = activeTab === "history" && (!previous || dayKey(itemTime(previous)) !== dayKey(itemTime(item)));
      return (
        <Fragment key={item.slug}>
          {showDay && (
            <div className="mt-5 mb-1 flex items-center justify-between gap-2 first:mt-0">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                📅 {dayLabel(itemTime(item))}
              </span>
              <button
                type="button"
                onClick={() => onRemoveDay(itemTime(item))}
                className="font-mono text-[10px] text-ink-muted transition-colors hover:text-nb-red cursor-pointer"
              >
                Hapus hari ini
              </button>
            </div>
          )}
          <BookmarkListRow
            item={item}
            bookmark={activeTab === "bookmarks" ? (item as BookmarkItem) : null}
            isBookmarkTab={activeTab === "bookmarks"}
            selectMode={selectMode}
            selected={selectedSlugs.includes(item.slug)}
            nextEpisode={nextEpisodes.get(item.slug)}
            onToggleSelected={onToggleSelected}
            onRemove={onRemove}
            onEditMeta={onEditMeta}
          />
        </Fragment>
      );
    })}
  </div>
);

export default BookmarksDayList;

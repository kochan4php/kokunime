"use client";

import { itemTime } from "@/utils/collection-format";
import {
  BookmarkItem,
  BookmarkStatus,
  getBookmarks,
  getStorageUsageStats,
  subscribeBookmarks,
} from "@/utils/bookmarks";
import { HistoryItem, getHistory, subscribeHistory } from "@/utils/history";
import { ProgressEntry, getProgressList, nextEpisodeFromProgress, subscribeProgress } from "@/utils/progress";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

const SERVER_BOOKMARKS: BookmarkItem[] = [];
const SERVER_HISTORY: HistoryItem[] = [];
const SERVER_PROGRESS: ProgressEntry[] = [];

export type CollectionTab = "bookmarks" | "history" | "queue";
export type SortBy = "recent" | "oldest" | "title" | "rating";

// Store subscriptions + derived lists for the bookmarks page.
export const useCollectionData = (
  activeTab: CollectionTab,
  statusFilter: "all" | BookmarkStatus,
  folderFilter: string,
  filterQuery: string,
  sortBy: SortBy,
  folderOrder: string[] = [],
) => {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, getBookmarks, () => SERVER_BOOKMARKS);
  const history = useSyncExternalStore(subscribeHistory, getHistory, () => SERVER_HISTORY);
  const progressList = useSyncExternalStore(subscribeProgress, getProgressList, () => SERVER_PROGRESS);

  // slug → next unwatched episode, for the "▶ Eps N" continue chips.
  const nextEpisodes = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of progressList) {
      const next = nextEpisodeFromProgress(entry);
      if (next !== null) map.set(entry.slug, next);
    }
    return map;
  }, [progressList]);

  // Folders follow the user's drag & drop order first, then A→Z for the rest.
  const folders = useMemo(() => {
    const set = new Set<string>();
    bookmarks.forEach((b) => {
      if (b.folder?.trim()) set.add(b.folder.trim());
    });
    return Array.from(set).sort((a, b) => {
      const indexA = folderOrder.indexOf(a);
      const indexB = folderOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b, "id");
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [bookmarks, folderOrder]);

  const isBookmarkTab = activeTab !== "history";
  const allItems = isBookmarkTab
    ? bookmarks.filter((b) => {
        const matchStatus = statusFilter === "all" || b.status === statusFilter;
        const matchFolder = folderFilter === "all" || b.folder === folderFilter;
        return matchStatus && matchFolder;
      })
    : history;

  const items = allItems.filter((item) => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return true;
    const searchTerms = q.split(/\s+/).filter(Boolean);
    const searchableText =
      `${item.title} ${(item as { notes?: string }).notes || ""} ${(item as { folder?: string }).folder || ""} ${item.slug}`.toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
  });

  const sortedItems = useMemo(() => {
    const list = [...items];
    if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title, "id"));
    else if (sortBy === "rating")
      list.sort((a, b) => ((b as BookmarkItem).rating ?? 0) - ((a as BookmarkItem).rating ?? 0));
    else if (sortBy === "oldest") list.sort((a, b) => itemTime(a) - itemTime(b));
    else list.sort((a, b) => itemTime(b) - itemTime(a));
    return list;
  }, [items, sortBy]);

  const storageStats = useMemo(() => {
    if (typeof window === "undefined") return { bytesUsed: 0, formattedUsed: "0 B", percentage: 0 };
    return getStorageUsageStats();
  }, [bookmarks, history]);

  // Compute localStorage stats after mount only: the server render has no
  // storage, so a value computed during hydration would mismatch the SSR text.
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => setStorageReady(true), []);

  return {
    bookmarks,
    history,
    nextEpisodes,
    folders,
    allItems,
    sortedItems,
    storageStats: storageReady ? storageStats : { bytesUsed: 0, formattedUsed: "0 B", percentage: 0 },
  };
};

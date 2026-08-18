export type BookmarkStatus = "watching" | "plan" | "completed";

export interface BookmarkItem {
  slug: string;
  title: string;
  image?: string;
  release?: string;
  status?: BookmarkStatus;
  rating?: number;
  notes?: string;
  folder?: string;
  addedAt: number;
}

const STORAGE_KEY = "kokunime_bookmarks";
const EVENT_NAME = "kokunime:bookmarks";

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const EMPTY_BOOKMARKS: BookmarkItem[] = [];
let cachedList: BookmarkItem[] = EMPTY_BOOKMARKS;
let lastRawData: string | null = null;

export const getBookmarks = (): BookmarkItem[] => {
  const storage = getStorage();
  if (!storage) return EMPTY_BOOKMARKS;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === lastRawData) {
      return cachedList;
    }
    lastRawData = raw;
    cachedList = raw ? (JSON.parse(raw) as BookmarkItem[]) : EMPTY_BOOKMARKS;
    return cachedList;
  } catch {
    return EMPTY_BOOKMARKS;
  }
};

export const isBookmarked = (slug: string): boolean => {
  if (!slug || typeof window === "undefined") return false;
  const list = getBookmarks();
  return list.some((item) => item.slug === slug);
};

export const toggleBookmark = (item: { slug: string; title: string; image?: string; release?: string }): boolean => {
  const storage = getStorage();
  if (!storage || !item.slug) return false;
  const list = [...getBookmarks()];
  const index = list.findIndex((i) => i.slug === item.slug);
  let nextBookmarked = false;

  if (index >= 0) {
    list.splice(index, 1);
    nextBookmarked = false;
  } else {
    list.unshift({
      slug: item.slug,
      title: item.title,
      image: item.image,
      release: item.release,
      addedAt: Date.now(),
    });
    nextBookmarked = true;
  }

  try {
    const serialized = JSON.stringify(list);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = list;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { slug: item.slug, bookmarked: nextBookmarked } }));
  } catch {}

  return nextBookmarked;
};

export const removeBookmark = (slug: string): void => {
  const storage = getStorage();
  if (!storage || !slug) return;
  const list = getBookmarks().filter((i) => i.slug !== slug);
  try {
    const serialized = JSON.stringify(list);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = list;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { slug, bookmarked: false } }));
  } catch {}
};

export const updateBookmarkStatus = (slug: string, status?: BookmarkStatus): void => {
  const storage = getStorage();
  if (!storage || !slug) return;
  const list = getBookmarks().map((item) => {
    if (item.slug === slug) {
      return { ...item, status };
    }
    return item;
  });
  try {
    const serialized = JSON.stringify(list);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = list;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { slug, status } }));
  } catch {}
};

export const updateBookmarkUserMeta = (
  slug: string,
  meta: { rating?: number; notes?: string; folder?: string },
): void => {
  const storage = getStorage();
  if (!storage || !slug) return;
  const list = getBookmarks().map((item) => {
    if (item.slug === slug) {
      return {
        ...item,
        ...(meta.rating !== undefined ? { rating: meta.rating } : {}),
        ...(meta.notes !== undefined ? { notes: meta.notes } : {}),
        ...(meta.folder !== undefined ? { folder: meta.folder } : {}),
      };
    }
    return item;
  });
  try {
    const serialized = JSON.stringify(list);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = list;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { slug, meta } }));
  } catch {}
};

export const clearAllBookmarks = (): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
    lastRawData = null;
    cachedList = EMPTY_BOOKMARKS;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { cleared: true } }));
  } catch {}
};

export const subscribeBookmarks = (listener: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handleEvent = () => {
    // Invalidate memory cache when external storage changes
    const storage = getStorage();
    const raw = storage?.getItem(STORAGE_KEY) ?? null;
    if (raw !== lastRawData) {
      lastRawData = raw;
      cachedList = raw ? (JSON.parse(raw) as BookmarkItem[]) : EMPTY_BOOKMARKS;
    }
    listener();
  };
  window.addEventListener(EVENT_NAME, handleEvent);
  window.addEventListener("storage", handleEvent);
  return () => {
    window.removeEventListener(EVENT_NAME, handleEvent);
    window.removeEventListener("storage", handleEvent);
  };
};

export const exportBookmarksJson = (): void => {
  if (typeof window === "undefined") return;
  const list = getBookmarks();
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kokunime-bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportBookmarksMalXml = (): void => {
  if (typeof window === "undefined") return;
  const list = getBookmarks();

  const entries = list
    .map((item) => {
      const malStatus =
        item.status === "watching" ? "Watching" : item.status === "completed" ? "Completed" : "Plan to Watch";
      const malScore = item.rating || 0;
      const malComments = item.notes ? `<![CDATA[${item.notes}]]>` : "";

      return `  <anime>
    <series_title><![CDATA[${item.title}]]></series_title>
    <my_score>${malScore}</my_score>
    <my_status>${malStatus}</my_status>
    <my_comments>${malComments}</my_comments>
  </anime>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Created by Kokunime
  Program: MyAnimeList Anime List XML Exporter
-->
<myanimelist>
  <myinfo>
    <user_export_type>1</user_export_type>
    <user_total_anime>${list.length}</user_total_anime>
  </myinfo>
${entries}
</myanimelist>`;

  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kokunime-mal-export-${new Date().toISOString().slice(0, 10)}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importBookmarksJson = async (file: File): Promise<number> => {
  const storage = getStorage();
  if (!storage) return 0;
  try {
    const text = await file.text();
    const imported = JSON.parse(text) as BookmarkItem[];
    if (!Array.isArray(imported)) return 0;

    const current = getBookmarks();
    const map = new Map<string, BookmarkItem>();
    current.forEach((item) => map.set(item.slug, item));
    let addedCount = 0;

    imported.forEach((item) => {
      if (item && item.slug && item.title) {
        if (!map.has(item.slug)) {
          addedCount++;
        }
        map.set(item.slug, {
          slug: item.slug,
          title: item.title,
          image: item.image,
          release: item.release,
          addedAt: item.addedAt || Date.now(),
        });
      }
    });

    const merged = Array.from(map.values()).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    const serialized = JSON.stringify(merged);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = merged;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    return addedCount;
  } catch {
    return 0;
  }
};

export const getStorageUsageStats = (): { bytesUsed: number; formattedUsed: string; percentage: number } => {
  const storage = getStorage();
  if (!storage) return { bytesUsed: 0, formattedUsed: "0 B", percentage: 0 };
  let bytes = 0;
  try {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        const val = storage.getItem(key) || "";
        bytes += (key.length + val.length) * 2;
      }
    }
  } catch {}

  const approxQuota = 5 * 1024 * 1024;
  const percentage = Math.min(100, (bytes / approxQuota) * 100);
  const formattedUsed =
    bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
      : bytes > 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${bytes} B`;

  return { bytesUsed: bytes, formattedUsed, percentage: parseFloat(percentage.toFixed(1)) };
};

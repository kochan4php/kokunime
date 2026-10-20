import { parseAniListJson, parseMalXml, serializeMalXml } from "@/utils/bookmark-parsers";
import { STORAGE_KEYS } from "@/utils/storage-keys";
import { showToast } from "@/utils/toast";
export type BookmarkStatus = "watching" | "plan" | "completed" | "dropped";

export interface BookmarkItem {
  slug: string;
  title: string;
  image?: string | undefined;
  release?: string | undefined;
  status?: BookmarkStatus | undefined;
  rating?: number | undefined;
  notes?: string | undefined;
  folder?: string | undefined;
  // Genres of the title at save time — powers the stats genre distribution.
  // Optional: bookmarks saved before this field simply have no genre data.
  genres?: string[] | undefined;
  addedAt: number;
}

const STORAGE_KEY = STORAGE_KEYS.bookmarks;
const EVENT_NAME = "kokunime:bookmarks";

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const EMPTY_BOOKMARKS: BookmarkItem[] = [];
let cachedList: BookmarkItem[] = EMPTY_BOOKMARKS;
let lastRawData: string | null = null;

// Optimistic writes are rolled back to storage truth if the quota is full:
// drop the in-memory cache so the next read reflects what actually persisted.
// There is no network queue here — every mutation is local-first.
const rollback = (): void => {
  lastRawData = null;
  cachedList = EMPTY_BOOKMARKS;
  showToast("Penyimpanan penuh — perubahan dibatalkan");
};

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

export const toggleBookmark = (item: {
  slug: string;
  title: string;
  image?: string | undefined;
  release?: string | undefined;
  genres?: string[] | undefined;
}): boolean => {
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
      genres: Array.isArray(item.genres) ? item.genres.slice(0, 8) : undefined,
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
  } catch {
    rollback();
    return isBookmarked(item.slug);
  }

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
  } catch {
    rollback();
  }
};

// Undo support: re-inserts previously removed items. Existing entries win, so
// a stale undo can never overwrite newer edits; order follows addedAt desc,
// the same ordering toggleBookmark/import maintain.
export const restoreBookmarks = (items: BookmarkItem[]): void => {
  const storage = getStorage();
  if (!storage || !Array.isArray(items) || items.length === 0) return;
  const bySlug = new Map(getBookmarks().map((item) => [item.slug, item]));
  for (const item of items) {
    if (!item?.slug || bySlug.has(item.slug)) continue;
    bySlug.set(item.slug, item);
  }
  const list = [...bySlug.values()].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
  try {
    const serialized = JSON.stringify(list);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = list;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { restored: items.length } }));
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
  meta: { rating?: number | null; notes?: string | null; folder?: string | null },
): void => {
  const storage = getStorage();
  if (!storage || !slug) return;
  const list = getBookmarks().map((item) => {
    if (item.slug === slug) {
      return {
        ...item,
        // null clears the field (undefined keeps it untouched).
        ...(meta.rating !== undefined ? { rating: meta.rating ?? undefined } : {}),
        ...(meta.notes !== undefined ? { notes: meta.notes ?? undefined } : {}),
        ...(meta.folder !== undefined ? { folder: meta.folder ?? undefined } : {}),
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

export const exportBookmarksJson = (items?: BookmarkItem[]): void => {
  if (typeof window === "undefined") return;
  const list = Array.isArray(items) ? items : getBookmarks();
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
  const xml = serializeMalXml(getBookmarks());

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
    let imported: BookmarkItem[] = [];

    if (file.name.endsWith(".xml") || text.trim().startsWith("<") || text.includes("<myanimelist>")) {
      imported = parseMalXml(text);
    } else {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].slug && parsed[0].title) {
          imported = parsed as BookmarkItem[];
        } else {
          imported = parseAniListJson(text);
        }
      } catch {
        imported = [];
      }
    }

    if (!Array.isArray(imported) || imported.length === 0) return 0;

    const current = getBookmarks();
    const map = new Map<string, BookmarkItem>();
    current.forEach((item) => {
      map.set(item.slug, item);
    });
    let addedCount = 0;

    imported.forEach((item) => {
      if (item && item.slug && item.title) {
        if (!map.has(item.slug)) {
          addedCount++;
        }
        const existing = map.get(item.slug);
        map.set(item.slug, {
          slug: item.slug,
          title: item.title,
          image: item.image || existing?.image,
          release: item.release || existing?.release,
          status: item.status || existing?.status,
          rating: item.rating ?? existing?.rating,
          notes: item.notes || existing?.notes,
          folder: item.folder || existing?.folder,
          addedAt: item.addedAt || existing?.addedAt || Date.now(),
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

// Folder chips keep a user-defined order (drag & drop on the bookmarks page).
export const getFolderOrder = (): string[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEYS.folderOrder);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

export const setFolderOrder = (order: string[]): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEYS.folderOrder, JSON.stringify(order.slice(0, 100)));
  } catch {}
};

// Appends unknown names (shape from a sync link / backup) after the current
// order; an existing user-defined order always wins.
export const mergeFolderOrder = (order: unknown): number => {
  if (!Array.isArray(order)) return 0;
  const current = getFolderOrder();
  const added = order
    .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
    .map((name) => name.trim())
    .filter((name) => !current.includes(name));
  if (added.length === 0) return 0;
  const merged = [...current, ...new Set(added)];
  setFolderOrder(merged);
  return merged.length - current.length;
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

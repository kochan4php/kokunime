import { STORAGE_KEYS } from "@/utils/storage-keys";

export interface QueueItem {
  slug: string;
  title: string;
  image?: string | undefined;
  addedAt: number;
}

const STORAGE_KEY = STORAGE_KEYS.watchQueue;
const EVENT_NAME = "kokunime:queue";
const MAX_ITEMS = 100;

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const EMPTY_QUEUE: QueueItem[] = [];
let cachedList: QueueItem[] = EMPTY_QUEUE;
let lastRawData: string | null = null;

const sanitizeItem = (raw: unknown): QueueItem | null => {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<QueueItem>;
  if (typeof candidate.slug !== "string" || !candidate.slug) return null;
  const item: QueueItem = {
    slug: candidate.slug,
    title: typeof candidate.title === "string" && candidate.title ? candidate.title : candidate.slug,
    addedAt:
      typeof candidate.addedAt === "number" && Number.isFinite(candidate.addedAt) ? candidate.addedAt : Date.now(),
  };
  if (typeof candidate.image === "string" && candidate.image) item.image = candidate.image;
  return item;
};

const persist = (list: QueueItem[]): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    const trimmed = list.slice(0, MAX_ITEMS);
    const serialized = JSON.stringify(trimmed);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = trimmed;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

export const getQueue = (): QueueItem[] => {
  const storage = getStorage();
  if (!storage) return EMPTY_QUEUE;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === lastRawData) return cachedList;
    lastRawData = raw;
    if (!raw) {
      cachedList = EMPTY_QUEUE;
      return cachedList;
    }
    const parsed = JSON.parse(raw) as unknown;
    cachedList = Array.isArray(parsed)
      ? parsed.map(sanitizeItem).filter((item): item is QueueItem => item !== null)
      : EMPTY_QUEUE;
    return cachedList;
  } catch {
    return EMPTY_QUEUE;
  }
};

export const isQueued = (slug: string): boolean => (slug ? getQueue().some((item) => item.slug === slug) : false);

// Appends new items at the end of the queue; already-queued slugs keep their
// position. Returns how many were actually added.
export const addToQueue = (items: { slug: string; title: string; image?: string | undefined }[]): number => {
  const list = [...getQueue()];
  const seen = new Set(list.map((item) => item.slug));
  let added = 0;
  for (const item of items) {
    if (!item.slug || seen.has(item.slug)) continue;
    const entry: QueueItem = { slug: item.slug, title: item.title || item.slug, addedAt: Date.now() };
    if (item.image) entry.image = item.image;
    list.push(entry);
    seen.add(item.slug);
    added++;
  }
  if (added > 0) persist(list);
  return added;
};

export const removeFromQueue = (slug: string): void => {
  const list = getQueue().filter((item) => item.slug !== slug);
  persist(list);
};

export const clearQueue = (): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
    lastRawData = null;
    cachedList = EMPTY_QUEUE;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

// Puts a removed item back at its old position (undo of a single remove).
export const restoreQueueItem = (item: QueueItem, index: number): void => {
  const sanitized = sanitizeItem(item);
  if (!sanitized) return;
  const list = [...getQueue()];
  if (list.some((entry) => entry.slug === sanitized.slug)) return;
  list.splice(Math.max(0, Math.min(index, list.length)), 0, sanitized);
  persist(list);
};

// Moves the item at `index` to `to` (drag & drop / arrow buttons). No-ops on
// out-of-range indices so a stray drop cannot corrupt the order.
export const moveQueueItem = (index: number, to: number): void => {
  const list = [...getQueue()];
  if (index < 0 || index >= list.length || to < 0 || to >= list.length || index === to) return;
  const [item] = list.splice(index, 1);
  if (!item) return;
  list.splice(to, 0, item);
  persist(list);
};

// Union-merge for share-link import: incoming items keep queue order, then
// local-only items follow in their existing order.
export const mergeQueueItems = (items: QueueItem[]): number => {
  const incoming = items.map(sanitizeItem).filter((item): item is QueueItem => item !== null);
  const merged = [...getQueue()];
  const seen = new Set(merged.map((item) => item.slug));
  let added = 0;
  for (const item of incoming) {
    if (seen.has(item.slug)) continue;
    merged.push(item);
    seen.add(item.slug);
    added++;
  }
  if (added > 0) persist(merged);
  return added;
};

export const subscribeQueue = (listener: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handleEvent = () => {
    getQueue();
    listener();
  };
  window.addEventListener(EVENT_NAME, handleEvent);
  window.addEventListener("storage", handleEvent);
  return () => {
    window.removeEventListener(EVENT_NAME, handleEvent);
    window.removeEventListener("storage", handleEvent);
  };
};

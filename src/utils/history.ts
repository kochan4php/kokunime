export interface HistoryItem {
  slug: string;
  title: string;
  image?: string;
  release?: string;
  viewedAt: number;
}

const STORAGE_KEY = "kokunime_history";
const EVENT_NAME = "kokunime:history";
const MAX_HISTORY = 30;

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const EMPTY_HISTORY: HistoryItem[] = [];
let cachedList: HistoryItem[] = EMPTY_HISTORY;
let lastRawData: string | null = null;

export const getHistory = (): HistoryItem[] => {
  const storage = getStorage();
  if (!storage) return EMPTY_HISTORY;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === lastRawData) {
      return cachedList;
    }
    lastRawData = raw;
    cachedList = raw ? (JSON.parse(raw) as HistoryItem[]) : EMPTY_HISTORY;
    return cachedList;
  } catch {
    return EMPTY_HISTORY;
  }
};

export const recordHistory = (item: {
  slug: string;
  title: string;
  image?: string;
  release?: string;
}): void => {
  const storage = getStorage();
  if (!storage || !item.slug) return;
  const list = getHistory().filter((i) => i.slug !== item.slug);
  list.unshift({
    slug: item.slug,
    title: item.title,
    image: item.image,
    release: item.release,
    viewedAt: Date.now(),
  });

  const trimmed = list.slice(0, MAX_HISTORY);
  try {
    const serialized = JSON.stringify(trimmed);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = trimmed;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

export const removeHistory = (slug: string): void => {
  const storage = getStorage();
  if (!storage || !slug) return;
  const list = getHistory().filter((i) => i.slug !== slug);
  try {
    const serialized = JSON.stringify(list);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = list;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

export const clearAllHistory = (): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
    lastRawData = null;
    cachedList = EMPTY_HISTORY;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

export const subscribeHistory = (listener: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handleEvent = () => {
    const storage = getStorage();
    const raw = storage?.getItem(STORAGE_KEY) ?? null;
    if (raw !== lastRawData) {
      lastRawData = raw;
      cachedList = raw ? (JSON.parse(raw) as HistoryItem[]) : EMPTY_HISTORY;
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

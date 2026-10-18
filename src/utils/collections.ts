import { getBookmarks, getFolderOrder, setFolderOrder, updateBookmarkUserMeta } from "@/utils/bookmarks";
import { STORAGE_KEYS } from "@/utils/storage-keys";

// Custom collections ("koleksi kustom"): the registry is a plain name list so a
// collection can exist while empty and can be renamed. Membership still lives
// in BookmarkItem.folder, so pre-existing bookmark files import unchanged — the
// folder bar simply unions both sources.
const STORAGE_KEY = STORAGE_KEYS.collections;
const EVENT_NAME = "kokunime:collections";
export const MAX_COLLECTION_NAME = 40;
const MAX_COLLECTIONS = 100;

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const EMPTY_COLLECTIONS: string[] = [];
let cachedList: string[] = EMPTY_COLLECTIONS;
let lastRawData: string | null = null;

const sanitize = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const names = value
    .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
    .map((name) => name.trim().slice(0, MAX_COLLECTION_NAME));
  return [...new Set(names)].slice(0, MAX_COLLECTIONS);
};

export const getCollections = (): string[] => {
  const storage = getStorage();
  if (!storage) return EMPTY_COLLECTIONS;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === lastRawData) return cachedList;
    lastRawData = raw;
    cachedList = raw ? sanitize(JSON.parse(raw)) : EMPTY_COLLECTIONS;
    return cachedList;
  } catch {
    return EMPTY_COLLECTIONS;
  }
};

const write = (names: string[]): void => {
  const storage = getStorage();
  if (!storage) return;
  const list = sanitize(names);
  try {
    const raw = JSON.stringify(list);
    storage.setItem(STORAGE_KEY, raw);
    lastRawData = raw;
    cachedList = list;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

export const addCollection = (name: string): "added" | "exists" | "invalid" => {
  const trimmed = name.trim().slice(0, MAX_COLLECTION_NAME);
  if (!trimmed) return "invalid";
  const list = getCollections();
  if (list.includes(trimmed)) return "exists";
  write([...list, trimmed]);
  return "added";
};

// Additive merge for sync links / imports: unknown names are appended.
export const mergeCollections = (names: unknown): number => {
  const list = getCollections();
  const added = sanitize(names).filter((name) => !list.includes(name));
  if (added.length > 0) write([...list, ...added]);
  return added.length;
};

// Renames the registry entry, every bookmark that used the old name, and the
// drag-&-drop order slot — nothing keeps pointing at a name that is gone.
export const renameCollection = (from: string, to: string): "renamed" | "exists" | "invalid" | "missing" => {
  const source = from.trim();
  const target = to.trim().slice(0, MAX_COLLECTION_NAME);
  if (!target || target === source) return "invalid";

  const list = getCollections();
  const affected = getBookmarks().filter((item) => item.folder === source);
  const listed = list.includes(source);
  if (!listed && affected.length === 0) return "missing";
  if (list.includes(target)) return "exists";

  write(listed ? list.map((name) => (name === source ? target : name)) : [...list, target]);
  for (const item of affected) updateBookmarkUserMeta(item.slug, { folder: target });

  const order = getFolderOrder();
  if (order.includes(source)) setFolderOrder(order.map((name) => (name === source ? target : name)));
  return "renamed";
};

export const removeCollectionName = (name: string): void => {
  write(getCollections().filter((entry) => entry !== name));
};

export const subscribeCollections = (listener: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handleEvent = () => {
    const storage = getStorage();
    const raw = storage?.getItem(STORAGE_KEY) ?? null;
    if (raw !== lastRawData) {
      lastRawData = raw;
      cachedList = raw ? sanitize(JSON.parse(raw)) : EMPTY_COLLECTIONS;
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

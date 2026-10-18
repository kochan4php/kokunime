import { STORAGE_KEYS } from "@/utils/storage-keys";

// Personal tags: the visitor's own labels across anime (e.g. "rewatch",
// "favorit istri", "nonton bareng"). Stored locally only — never sent anywhere.
// One map keeps rename/merge cheap: tag → slugs.
interface TagStore {
  [tag: string]: { slugs: string[]; at: number };
}

const STORAGE_KEY = STORAGE_KEYS.tags;
const MAX_TAGS = 200;
const MAX_SLUGS_PER_TAG = 500;
const MAX_TAG_LENGTH = 24;

let store: TagStore = {};
let hydrated = false;
let version = 0;
let storageListenerAttached = false;
let listeners: Set<() => void> = new Set();

interface TagSummary {
  tag: string;
  count: number;
  at: number;
}

export const normalizeTag = (raw: string): string =>
  raw.trim().replace(/^#+/, "").trim().replace(/\s+/g, " ").toLowerCase().slice(0, MAX_TAG_LENGTH);

const emit = (): void => {
  version += 1;
  for (const listener of listeners) listener();
};

// Components subscribe to this counter and derive their own view with useMemo:
// a getSnapshot that builds a fresh array on every call makes React loop.
export const getTagsVersion = (): number => version;

// Export/import and other tabs replace storage wholesale: resync instead of
// serving a stale in-memory store.
const ensureStorageListener = (): void => {
  if (typeof window === "undefined" || storageListenerAttached) return;
  storageListenerAttached = true;
  window.addEventListener("storage", () => {
    hydrated = false;
    hydrate();
    emit();
  });
};

const persist = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota/private mode: the in-memory store keeps working for this tab.
  }
};

const hydrate = (): void => {
  if (hydrated) return;
  hydrated = true;
  ensureStorageListener();
  store = {};
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return;
    const next: TagStore = {};
    for (const [tag, value] of Object.entries(parsed as Record<string, unknown>)) {
      const entry = value as { slugs?: unknown; at?: unknown };
      if (!Array.isArray(entry?.slugs)) continue;
      next[tag] = {
        slugs: (entry.slugs.filter((slug) => typeof slug === "string") as string[]).slice(0, MAX_SLUGS_PER_TAG),
        at: typeof entry.at === "number" ? entry.at : Date.now(),
      };
    }
    store = next;
  } catch {
    store = {};
  }
};

export const listTags = (): TagSummary[] => {
  hydrate();
  return Object.entries(store)
    .map(([tag, entry]) => ({ tag, count: entry.slugs.length, at: entry.at }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.at - a.at || a.tag.localeCompare(b.tag));
};

export const getTagsForSlug = (slug: string): string[] => {
  hydrate();
  return Object.entries(store)
    .filter(([, entry]) => entry.slugs.includes(slug))
    .map(([tag]) => tag)
    .sort();
};

export const getSlugsForTag = (tag: string): string[] => {
  hydrate();
  return store[normalizeTag(tag)]?.slugs ?? [];
};

export const addTag = (slug: string, rawTag: string): boolean => {
  const tag = normalizeTag(rawTag);
  if (!slug || !tag || typeof window === "undefined") return false;
  hydrate();
  const entry = store[tag] ?? { slugs: [], at: Date.now() };
  if (entry.slugs.includes(slug)) return false;
  const tags = Object.keys(store);
  if (tags.length >= MAX_TAGS && !store[tag]) return false;
  store = {
    ...store,
    [tag]: { slugs: [...entry.slugs, slug].slice(-MAX_SLUGS_PER_TAG), at: Date.now() },
  };
  persist();
  emit();
  return true;
};

export const removeTag = (slug: string, rawTag: string): boolean => {
  const tag = normalizeTag(rawTag);
  hydrate();
  const entry = store[tag];
  if (!entry || !entry.slugs.includes(slug)) return false;
  const slugs = entry.slugs.filter((value) => value !== slug);
  if (slugs.length === 0) {
    const { [tag]: _removed, ...rest } = store;
    store = rest;
  } else {
    store = { ...store, [tag]: { slugs, at: Date.now() } };
  }
  persist();
  emit();
  return true;
};

// Rename = move every slug to the new name; when the target already exists the
// two tags merge (union, no duplicates).
export const renameTag = (rawFrom: string, rawTo: string): boolean => {
  const from = normalizeTag(rawFrom);
  const to = normalizeTag(rawTo);
  hydrate();
  if (!from || !to || from === to) return false;
  const source = store[from];
  if (!source) return false;
  const target = store[to];
  const merged = [...new Set([...(target?.slugs ?? []), ...source.slugs])].slice(-MAX_SLUGS_PER_TAG);
  const { [from]: _removed, ...rest } = store;
  store = { ...rest, [to]: { slugs: merged, at: Date.now() } };
  persist();
  emit();
  return true;
};

export const deleteTag = (rawTag: string): boolean => {
  const tag = normalizeTag(rawTag);
  hydrate();
  if (!store[tag]) return false;
  const { [tag]: _removed, ...rest } = store;
  store = rest;
  persist();
  emit();
  return true;
};

export const clearTags = (): void => {
  store = {};
  hydrated = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Non-fatal.
    }
  }
  emit();
};

export const subscribeTags = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners = new Set([...listeners].filter((entry) => entry !== listener));
  };
};

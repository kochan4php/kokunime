import { searchLocalCatalog } from "@/utils/local-catalog";
import { pushInboxItem } from "@/utils/release-inbox";
import { STORAGE_KEYS } from "@/utils/storage-keys";

// Saved searches: a query plus the slugs it has already surfaced. When the
// local catalog learns new titles, matches land in the inbox (same bell as new
// releases) exactly once per title.
interface SavedSearch {
  id: string;
  query: string;
  createdAt: number;
  seen: string[];
  lastCheckedAt?: number | undefined;
}

const STORAGE_KEY = STORAGE_KEYS.savedSearches;
const MAX_SAVED = 20;
const MAX_SEEN = 400;
const CHECK_LIMIT = 50;

let cache: SavedSearch[] = [];
let hydrated = false;
let storageListenerAttached = false;
let listeners: Set<() => void> = new Set();

const emit = (): void => {
  for (const listener of listeners) listener();
};

// Export/import and other tabs replace storage wholesale: resync instead of
// serving a stale in-memory list.
const ensureStorageListener = (): void => {
  if (typeof window === "undefined" || storageListenerAttached) return;
  storageListenerAttached = true;
  window.addEventListener("storage", () => {
    hydrated = false;
    listSavedSearches();
    emit();
  });
};

const normalize = (query: string): string => query.trim().replace(/\s+/g, " ").toLowerCase();

const persist = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Quota/private mode: keep working in memory for this tab.
  }
};

const isSaved = (value: unknown): value is SavedSearch => {
  const entry = value as SavedSearch | null;
  return (
    Boolean(entry) && typeof entry?.id === "string" && typeof entry.query === "string" && Array.isArray(entry.seen)
  );
};

export const listSavedSearches = (): SavedSearch[] => {
  if (hydrated) return cache;
  hydrated = true;
  ensureStorageListener();
  cache = [];
  if (typeof window === "undefined") return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) cache = parsed.filter(isSaved).slice(0, MAX_SAVED);
    }
  } catch {
    cache = [];
  }
  return cache;
};

export const isSearchSaved = (query: string): boolean =>
  listSavedSearches().some((entry) => normalize(entry.query) === normalize(query));

export const saveSearch = (query: string): SavedSearch | null => {
  const trimmed = query.trim();
  if (!trimmed || typeof window === "undefined") return null;
  const saved = listSavedSearches();
  const existing = saved.find((entry) => normalize(entry.query) === normalize(trimmed));
  if (existing) return existing;
  const entry: SavedSearch = {
    id: `ss_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    query: trimmed,
    createdAt: Date.now(),
    seen: [],
  };
  // Seed `seen` with what already matches, so saving a query does not flood the
  // inbox with titles the visitor is looking at right now.
  try {
    entry.seen = searchLocalCatalog(trimmed, CHECK_LIMIT)
      .items.map((item) => item.slug)
      .slice(0, MAX_SEEN);
  } catch {
    entry.seen = [];
  }
  cache = [entry, ...saved].slice(0, MAX_SAVED);
  persist();
  emit();
  return entry;
};

export const removeSavedSearch = (id: string): void => {
  cache = listSavedSearches().filter((entry) => entry.id !== id);
  persist();
  emit();
};

// Toggle helper for the UI: returns true when the query is now saved.
export const toggleSavedSearch = (query: string): boolean => {
  const existing = listSavedSearches().find((entry) => normalize(entry.query) === normalize(query));
  if (existing) {
    removeSavedSearch(existing.id);
    return false;
  }
  return saveSearch(query) !== null;
};

// Runs every saved query against the local catalog and pushes NEW matches into
// the inbox. Returns how many items were added.
export const checkSavedSearches = (): number => {
  const saved = listSavedSearches();
  if (saved.length === 0 || typeof window === "undefined") return 0;
  let added = 0;
  let changed = false;
  const next: SavedSearch[] = [];

  for (const entry of saved) {
    const matches = searchLocalCatalog(entry.query, CHECK_LIMIT).items;
    const seen = new Set(entry.seen);
    let pushed = 0;
    for (const item of matches) {
      if (seen.has(item.slug)) continue;
      seen.add(item.slug);
      pushed += 1;
      pushInboxItem({
        slug: item.slug,
        title: item.title,
        from: "Pencarian tersimpan",
        to: entry.query,
        kind: "search",
      });
    }
    if (pushed > 0) added += pushed;
    const seenList = [...seen].slice(-MAX_SEEN);
    if (pushed > 0 || entry.lastCheckedAt === undefined) changed = true;
    next.push({ ...entry, seen: seenList, lastCheckedAt: Date.now() });
  }

  if (changed) {
    cache = next;
    persist();
    emit();
  }
  return added;
};

export const subscribeSavedSearches = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners = new Set([...listeners].filter((entry) => entry !== listener));
  };
};

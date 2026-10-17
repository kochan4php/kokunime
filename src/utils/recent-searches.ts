import { STORAGE_KEYS } from "@/utils/storage-keys";

const RECENT_KEY = STORAGE_KEYS.recentSearches;

interface RecentSearchEntry {
  q: string;
  count: number;
  lastAt: number;
}

// Recents are weighted: most-searched first, then most-recent — the palette
// ranks by frequency + recency instead of plain recency. Legacy string[]
// payloads are migrated on read.
const readRecentEntries = (): RecentSearchEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item): RecentSearchEntry | null => {
        if (typeof item === "string") return { q: item, count: 1, lastAt: 0 };
        if (item && typeof item === "object" && typeof (item as RecentSearchEntry).q === "string") {
          const entry = item as RecentSearchEntry;
          return { q: entry.q, count: Number(entry.count) || 1, lastAt: Number(entry.lastAt) || 0 };
        }
        return null;
      })
      .filter((entry): entry is RecentSearchEntry => entry !== null);
  } catch {
    return [];
  }
};

export const getRecentSearches = (): string[] =>
  [...readRecentEntries()].sort((a, b) => b.count - a.count || b.lastAt - a.lastAt).map((entry) => entry.q);

export const saveRecentSearch = (query: string) => {
  if (typeof window === "undefined" || !query.trim()) return;
  const trimmed = query.trim();
  const entries = readRecentEntries();
  const existing = entries.find((entry) => entry.q.toLowerCase() === trimmed.toLowerCase());
  const list = entries.filter((entry) => entry.q.toLowerCase() !== trimmed.toLowerCase());
  list.unshift({ q: trimmed, count: (existing?.count ?? 0) + 1, lastAt: Date.now() });
  const ranked = [...list].sort((a, b) => b.count - a.count || b.lastAt - a.lastAt).slice(0, 8);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ranked));
  } catch {}
};

export const clearRecentSearches = () => {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {}
};

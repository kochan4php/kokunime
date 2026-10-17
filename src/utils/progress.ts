export interface ProgressEntry {
  slug: string;
  title?: string;
  total?: number;
  watched: number[];
  updatedAt: number;
}

const STORAGE_KEY = "kokunime_progress";
const EVENT_NAME = "kokunime:progress";
const MAX_ENTRIES = 200;
const MAX_EPISODES = 3000;

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const EMPTY_PROGRESS: ProgressEntry[] = [];
let cachedList: ProgressEntry[] = EMPTY_PROGRESS;
let lastRawData: string | null = null;

const sanitizeEntry = (raw: unknown): ProgressEntry | null => {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<ProgressEntry>;
  if (typeof candidate.slug !== "string" || !candidate.slug) return null;

  const watched = Array.isArray(candidate.watched)
    ? [...new Set(candidate.watched.filter((n): n is number => typeof n === "number" && Number.isInteger(n) && n > 0))]
        .sort((a, b) => a - b)
        .slice(0, MAX_EPISODES)
    : [];

  const entry: ProgressEntry = {
    slug: candidate.slug,
    watched,
    updatedAt:
      typeof candidate.updatedAt === "number" && Number.isFinite(candidate.updatedAt)
        ? candidate.updatedAt
        : Date.now(),
  };
  if (typeof candidate.title === "string" && candidate.title) entry.title = candidate.title;
  if (typeof candidate.total === "number" && Number.isFinite(candidate.total) && candidate.total > 0) {
    entry.total = Math.floor(candidate.total);
  }
  return entry;
};

const readFromStorage = (): ProgressEntry[] => {
  const storage = getStorage();
  if (!storage) return EMPTY_PROGRESS;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === lastRawData) return cachedList;
    lastRawData = raw;
    if (!raw) {
      cachedList = EMPTY_PROGRESS;
      return cachedList;
    }
    const parsed = JSON.parse(raw) as unknown;
    cachedList = Array.isArray(parsed)
      ? parsed.map(sanitizeEntry).filter((e): e is ProgressEntry => e !== null)
      : EMPTY_PROGRESS;
    return cachedList;
  } catch {
    return EMPTY_PROGRESS;
  }
};

export const getProgressList = (): ProgressEntry[] => readFromStorage();

const writeList = (list: ProgressEntry[]): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    const trimmed = list.slice(0, MAX_ENTRIES);
    const serialized = JSON.stringify(trimmed);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = trimmed;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

export const getProgress = (slug: string): ProgressEntry | undefined =>
  slug ? getProgressList().find((e) => e.slug === slug) : undefined;

export const isEpisodeWatched = (slug: string, episode: number): boolean =>
  getProgress(slug)?.watched.includes(episode) ?? false;

export const getWatchedCount = (slug: string): number => getProgress(slug)?.watched.length ?? 0;

const upsert = (
  slug: string,
  mutate: (entry: ProgressEntry) => ProgressEntry,
  meta?: { title?: string; total?: number },
): void => {
  const list = [...getProgressList()];
  const index = list.findIndex((e) => e.slug === slug);
  const existing: ProgressEntry = index >= 0 ? list[index] : { slug, watched: [], updatedAt: Date.now() };

  const merged: ProgressEntry = { ...existing, slug };
  if (meta?.title) merged.title = meta.title;
  if (meta?.total) merged.total = meta.total;

  const next = { ...mutate(merged), slug, updatedAt: Date.now() };
  if (index >= 0) list[index] = next;
  else list.unshift(next);
  list.sort((a, b) => b.updatedAt - a.updatedAt);
  writeList(list);
};

// Toggle one episode; returns the new watched state (false when now unwatched).
export const toggleEpisodeWatched = (
  slug: string,
  episode: number,
  meta?: { title?: string; total?: number },
): boolean => {
  if (!slug || !Number.isFinite(episode) || episode <= 0) return false;
  const ep = Math.floor(episode);
  let nextState = false;

  upsert(
    slug,
    (entry) => {
      const watched = entry.watched.includes(ep)
        ? entry.watched.filter((n) => n !== ep)
        : [...entry.watched, ep].sort((a, b) => a - b);
      nextState = watched.includes(ep);
      return { ...entry, watched };
    },
    meta,
  );

  return nextState;
};

// Store series meta (title/total episodes) without toggling anything. Only
// writes when something changed, so detail-page mounts can't cause loops.
export const syncProgressMeta = (slug: string, meta: { title?: string; total?: number }): void => {
  if (!slug) return;
  const entry = getProgress(slug);
  if (!entry) {
    if (!meta.title && !meta.total) return;
    upsert(slug, (e) => e, meta);
    return;
  }
  const titleChanged = Boolean(meta.title) && meta.title !== entry.title;
  const totalChanged = Boolean(meta.total) && meta.total !== entry.total;
  if (!titleChanged && !totalChanged) return;
  upsert(slug, (e) => e, meta);
};

export const removeProgress = (slug: string): void => {
  if (!slug) return;
  writeList(getProgressList().filter((e) => e.slug !== slug));
};

export const clearAllProgress = (): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
    lastRawData = null;
    cachedList = EMPTY_PROGRESS;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

export const subscribeProgress = (listener: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handleEvent = () => {
    readFromStorage();
    listener();
  };
  window.addEventListener(EVENT_NAME, handleEvent);
  window.addEventListener("storage", handleEvent);
  handleEvent();
  return () => {
    window.removeEventListener(EVENT_NAME, handleEvent);
    window.removeEventListener("storage", handleEvent);
  };
};

// First episode in `episodes` not yet in `watched` — the "Lanjut Tonton"
// target. Null when the list is empty or every episode is marked watched.
export const nextUnwatchedEpisode = (watched: number[], episodes: number[]): number | null => {
  if (episodes.length === 0) return null;
  const seen = new Set(watched);
  for (const episode of episodes) {
    if (!seen.has(episode)) return episode;
  }
  return null;
};

// Next unwatched episode from a stored entry alone (no download list needed,
// e.g. bookmark cards): bounded by `total` when known, else max watched + 1.
export const nextEpisodeFromProgress = (entry?: ProgressEntry): number | null => {
  if (!entry || entry.watched.length === 0) return null;
  const watched = new Set(entry.watched);
  const max = entry.total ?? Math.max(...entry.watched) + 1;
  for (let episode = 1; episode <= max; episode++) {
    if (!watched.has(episode)) return episode;
  }
  return null;
};

// Union-merge incoming entries (share-link import): watched sets are unioned
// per slug, richer meta wins, order follows recency. Returns merged count.
export const mergeProgressEntries = (entries: ProgressEntry[]): number => {
  const incoming = entries.map(sanitizeEntry).filter((entry): entry is ProgressEntry => entry !== null);
  if (incoming.length === 0) return 0;

  const list = [...getProgressList()];
  for (const entry of incoming) {
    const index = list.findIndex((existing) => existing.slug === entry.slug);
    if (index === -1) {
      list.push({ ...entry, updatedAt: Date.now() });
      continue;
    }
    const current = list[index];
    list[index] = {
      slug: entry.slug,
      watched: [...new Set([...current.watched, ...entry.watched])].sort((a, b) => a - b),
      title: entry.title ?? current.title,
      total: entry.total ?? current.total,
      updatedAt: Date.now(),
    };
  }

  list.sort((a, b) => b.updatedAt - a.updatedAt);
  writeList(list);
  return incoming.length;
};

// "12" / "12 Episode" / "1100+" → 12 / 12 / 1100; "?" or "" → undefined.
export const parseTotalEpisodes = (raw?: string | null): number | undefined => {
  if (!raw) return undefined;
  const match = String(raw).match(/\d{1,4}/);
  if (!match) return undefined;
  const value = parseInt(match[0], 10);
  return Number.isFinite(value) && value > 0 ? value : undefined;
};

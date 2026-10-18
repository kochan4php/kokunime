import { Anime, AnimeDetail } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import { parseQuerySyntax } from "@/utils/query-syntax";
import { matchesLocalFilters, rankTitles, type RankableTitle } from "@/utils/rank-query";
import { STORAGE_KEYS } from "@/utils/storage-keys";

// Device-local catalog: every listing, search result and detail page the
// visitor sees contributes titles here, and the server-side index (Redis) is
// merged in when it is reachable. Search over it is instant and works offline;
// score/studio only exist for titles whose detail page was opened, and the UI
// says so instead of pretending the filters are complete.
export interface CatalogEntry extends RankableTitle {
  title: string;
  genres: string[];
  release: string;
  image?: string | undefined;
  at: number;
}

interface CatalogFacet {
  name: string;
  count: number;
}

interface LocalSearchResult {
  items: CatalogEntry[];
  total: number;
  facets: { genres: CatalogFacet[]; years: CatalogFacet[] };
  didYouMean: string | null;
}

export const MAX_CATALOG_ENTRIES = 2500;
const STORAGE_KEY = STORAGE_KEYS.localCatalog;
const META_KEY = STORAGE_KEYS.localCatalogMeta;
const MERGE_INTERVAL_MS = 24 * 60 * 60 * 1000;
const FACET_LIMIT = 10;
const DID_YOU_MEAN_MAX_DISTANCE = 2;

let entries: CatalogEntry[] = [];
let hydrated = false;
let storageListenerAttached = false;
let snapshot: CatalogEntry[] = [];
let listeners: Set<() => void> = new Set();

const now = (): number => Date.now();

// Export/import and other tabs replace storage wholesale: resync instead of
// serving a stale in-memory snapshot.
const ensureStorageListener = (): void => {
  if (typeof window === "undefined" || storageListenerAttached) return;
  storageListenerAttached = true;
  window.addEventListener("storage", () => {
    hydrated = false;
    hydrate();
  });
};

const refreshSnapshot = (): void => {
  snapshot = [...entries];
  for (const listener of listeners) listener();
};

const persist = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota or private mode: the in-memory catalog still works for this tab.
  }
};

const isEntry = (value: unknown): value is CatalogEntry => {
  const entry = value as CatalogEntry | null;
  return (
    Boolean(entry) && typeof entry?.slug === "string" && typeof entry.title === "string" && Array.isArray(entry.genres)
  );
};

const hydrate = (): void => {
  if (hydrated) return;
  hydrated = true;
  ensureStorageListener();
  entries = [];
  if (typeof window === "undefined") {
    refreshSnapshot();
    return;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) entries = parsed.filter(isEntry).slice(-MAX_CATALOG_ENTRIES);
    }
  } catch {
    entries = [];
  }
  refreshSnapshot();
};

const toEntry = (item: Anime): CatalogEntry | null => {
  const slug = animeSlug(item?.link?.endpoint);
  if (!slug || !item.title) return null;
  return {
    slug,
    title: item.title,
    genres: (item.genres ?? []).filter(Boolean).slice(0, 8),
    release: item.release ?? "",
    image: item.link?.image,
    at: now(),
  };
};

// `fillOnly` is used by the server-index merge: it may fill gaps on a known
// title but never downgrade what this device already saw (which can be richer,
// e.g. score/studio from a detail page).
const upsert = (entry: CatalogEntry, fillOnly = false): boolean => {
  const index = entries.findIndex((existing) => existing.slug === entry.slug);
  if (index === -1) {
    entries = [...entries, entry].slice(-MAX_CATALOG_ENTRIES);
    return true;
  }
  const previous = entries[index] as CatalogEntry;
  entries[index] = {
    ...previous,
    title: fillOnly ? previous.title || entry.title : entry.title || previous.title,
    genres: fillOnly
      ? previous.genres.length > 0
        ? previous.genres
        : entry.genres
      : entry.genres.length > 0
        ? entry.genres
        : previous.genres,
    release: fillOnly ? previous.release || entry.release : entry.release || previous.release,
    image: fillOnly ? (previous.image ?? entry.image) : (entry.image ?? previous.image),
    rating: entry.rating ?? previous.rating,
    studio: entry.studio ?? previous.studio,
    at: now(),
  };
  return false;
};

// Returns the number of NEW titles learned (callers use it to trigger saved
// search checks instead of running them on every render).
export const recordCatalogItems = (items: Anime[]): number => {
  if (typeof window === "undefined" || items.length === 0) return 0;
  hydrate();
  let added = 0;
  for (const item of items) {
    const entry = toEntry(item);
    if (!entry) continue;
    if (upsert(entry)) added += 1;
  }
  if (added === 0 && entries.length === 0) return 0;
  persist();
  refreshSnapshot();
  return added;
};

export const recordCatalogDetail = (slug: string, detail: AnimeDetail): void => {
  if (typeof window === "undefined" || !slug) return;
  hydrate();
  const existing = entries.find((entry) => entry.slug === slug);
  const enriched: CatalogEntry = {
    slug,
    title: detail.title ?? existing?.title ?? slug.replace(/-/g, " "),
    genres:
      detail.genre
        ?.map((genre) => genre.name ?? "")
        .filter(Boolean)
        .slice(0, 8) ??
      existing?.genres ??
      [],
    release: detail.release_on?.match(/\d{4}/)?.[0] ?? existing?.release ?? "",
    image: detail.image ?? existing?.image,
    rating: detail.score ?? detail.rating ?? existing?.rating,
    studio: detail.studio ?? existing?.studio,
    at: now(),
  };
  upsert(enriched);
  persist();
  refreshSnapshot();
};

// Server-side index (Redis) merged into the local catalog when reachable.
export const mergeServerIndex = (
  items: (
    | {
        slug: string;
        title: string;
        image?: string | undefined;
        release?: string | undefined;
        genres?: string[] | undefined;
      }
    | null
    | undefined
  )[],
): number => {
  if (typeof window === "undefined" || items.length === 0) return 0;
  hydrate();
  let added = 0;
  for (const item of items) {
    if (!item?.slug || !item.title) continue;
    const entry: CatalogEntry = {
      slug: item.slug,
      title: item.title,
      genres: (item.genres ?? []).filter(Boolean).slice(0, 8),
      release: item.release ?? "",
      image: item.image,
      at: now(),
    };
    if (upsert(entry, true)) added += 1;
  }
  persist();
  refreshSnapshot();
  return added;
};

export const getCatalogSnapshot = (): CatalogEntry[] => {
  hydrate();
  return snapshot;
};

const getCatalogMeta = (): { size: number; mergedAt: number } => {
  if (typeof window === "undefined") return { size: 0, mergedAt: 0 };
  let mergedAt = 0;
  try {
    mergedAt = Number(window.localStorage.getItem(META_KEY) ?? 0) || 0;
  } catch {
    mergedAt = 0;
  }
  return { size: getCatalogSnapshot().length, mergedAt };
};

export const subscribeCatalog = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners = new Set([...listeners].filter((entry) => entry !== listener));
  };
};

// Pull the server index at most once a day; silently no-ops offline.
export const ensureServerIndexMerged = async (): Promise<number> => {
  if (typeof window === "undefined") return 0;
  const { mergedAt } = getCatalogMeta();
  if (now() - mergedAt < MERGE_INTERVAL_MS) return 0;
  try {
    const response = await fetch("/api/search-index", { headers: { accept: "application/json" } });
    if (!response.ok) return 0;
    const data = (await response.json()) as { items?: unknown };
    const rows = Array.isArray(data.items) ? data.items : [];
    const added = mergeServerIndex(
      rows.map((row) => {
        if (!Array.isArray(row)) return null;
        const [slug, title, image, release, genres] = row as [unknown, unknown, unknown, unknown, unknown];
        return {
          slug: typeof slug === "string" ? slug : "",
          title: typeof title === "string" ? title : "",
          image: typeof image === "string" && image ? image : undefined,
          release: typeof release === "string" ? release : undefined,
          genres: Array.isArray(genres) ? (genres.filter((genre) => typeof genre === "string") as string[]) : undefined,
        };
      }),
    );
    window.localStorage.setItem(META_KEY, String(now()));
    return added;
  } catch {
    return 0;
  }
};

const levenshtein = (a: string, b: string, max: number): number => {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let best = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(
        (previous[j] as number) + 1,
        (current[j - 1] as number) + 1,
        (previous[j - 1] as number) + cost,
      );
      current.push(value);
      if (value < best) best = value;
    }
    if (best > max) return max + 1;
    previous = current;
  }
  return previous[b.length] as number;
};

// "Did you mean": closest catalog title to the typed text (distance ≤ 2).
export const suggestCorrection = (raw: string, pool?: CatalogEntry[]): string | null => {
  const text = raw
    .replace(/\b(?:genre|tahun|skor|studio):\S+/gi, "")
    .trim()
    .toLowerCase();
  if (text.length < 4) return null;
  // Longer words get a wider cutoff: a typo in a long title is usually further
  // away than in a short one.
  const max = text.length >= 8 ? 3 : DID_YOU_MEAN_MAX_DISTANCE;
  const candidates = (pool ?? getCatalogSnapshot())
    .map((entry) => entry.title)
    .filter((title) => Math.abs(title.length - text.length) <= max + 2);
  let best: { title: string; distance: number } | null = null;
  for (const title of candidates) {
    const distance = levenshtein(text, title.toLowerCase(), max);
    if (distance > max) continue;
    if (distance === 0) return null;
    if (!best || distance < best.distance) best = { title, distance };
  }
  return best?.title ?? null;
};

const countFacet = (pool: CatalogEntry[], pick: (entry: CatalogEntry) => string[]): CatalogFacet[] => {
  const counts = new Map<string, number>();
  for (const entry of pool) {
    for (const value of pick(entry)) {
      const key = value.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, FACET_LIMIT);
};

// Instant local search: operator syntax, facets with counts and a spelling
// suggestion. Facets for one dimension are counted with the other dimensions
// still applied, so the numbers match what a click would actually show.
export const searchLocalCatalog = (raw: string, limit = 20): LocalSearchResult => {
  const pool = getCatalogSnapshot();
  const parsed = parseQuerySyntax(raw);
  const base = pool.filter((entry) => matchesLocalFilters(entry, parsed));
  const items = rankTitles(base, parsed, limit);

  const withoutGenres = rankTitles(
    base.filter((entry) =>
      parsed.years.length === 0 ? true : parsed.years.some((year) => entry.release.includes(year)),
    ),
    { ...parsed, genres: [] },
    Number.MAX_SAFE_INTEGER,
  );
  const withoutYears = rankTitles(
    base.filter((entry) => {
      const itemGenres = entry.genres.map((genre) => genre.toLowerCase());
      return (
        parsed.genres.length === 0 || parsed.genres.some((genre) => itemGenres.some((value) => value.includes(genre)))
      );
    }),
    { ...parsed, years: [] },
    Number.MAX_SAFE_INTEGER,
  );

  return {
    items,
    total: items.length,
    facets: {
      genres: countFacet(withoutGenres, (entry) => entry.genres),
      years: countFacet(
        withoutYears.filter((entry) => entry.release),
        (entry) => [entry.release.match(/\d{4}/)?.[0] ?? ""],
      ),
    },
    didYouMean: items.length === 0 ? suggestCorrection(raw, pool) : null,
  };
};

export const clearCatalog = (): void => {
  entries = [];
  hydrated = true;
  snapshot = [];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(META_KEY);
    } catch {
      // Non-fatal.
    }
  }
  for (const listener of listeners) listener();
};

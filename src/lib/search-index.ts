import { getRedis } from "@/lib/redis";
import type { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import { fuzzyScore } from "@/utils/fuzzy";
import { ParsedQuery, parseQuerySyntax } from "@/utils/query-syntax";

const ITEMS_KEY = "kokunime:idx:titles";
const SNAPSHOT_TTL_MS = 5 * 60 * 1000;
const MIN_INDEX_FOR_SEARCH = 10;

export interface IndexedAnime {
  slug: string;
  title: string;
  image?: string;
  release?: string;
  genres?: string[];
}

let snapshot: { at: number; items: Map<string, IndexedAnime> } | null = null;
let lastSignature = "";
let lastIndexedAt = 0;
const INDEX_THROTTLE_MS = 60_000;

// Fire-and-forget; callers pass whatever listing they just parsed. Re-indexing
// the exact same batch within a minute is skipped (dynamic pages can call the
// scraper per request).
export const indexAnimeItems = async (items: Anime[]): Promise<number> => {
  const redis = await getRedis();
  if (!redis || items.length === 0) return 0;

  try {
    const payload: Record<string, string> = {};
    for (const item of items) {
      const slug = animeSlug(item?.link?.endpoint);
      if (!slug || !item.title) continue;
      const record: IndexedAnime = {
        slug,
        title: item.title,
        image: item.link?.image,
        release: item.release,
        genres: item.genres?.filter(Boolean).slice(0, 8),
      };
      payload[slug] = JSON.stringify(record);
    }
    const count = Object.keys(payload).length;
    if (count === 0) return 0;

    const signature = `${count}:${Object.keys(payload)[0]}`;
    if (signature === lastSignature && Date.now() - lastIndexedAt < INDEX_THROTTLE_MS) return 0;

    await redis.hSet(ITEMS_KEY, payload);
    lastSignature = signature;
    lastIndexedAt = Date.now();
    snapshot = null;
    return count;
  } catch {
    return 0;
  }
};

export const getIndexSnapshot = async (): Promise<Map<string, IndexedAnime> | null> => {
  if (snapshot && Date.now() - snapshot.at < SNAPSHOT_TTL_MS) return snapshot.items;
  const redis = await getRedis();
  if (!redis) return null;

  try {
    const raw = (await redis.hGetAll(ITEMS_KEY)) as Record<string, string>;
    const items = new Map<string, IndexedAnime>();
    for (const [slug, value] of Object.entries(raw)) {
      try {
        items.set(slug, JSON.parse(value) as IndexedAnime);
      } catch {
        // Skip corrupt entries.
      }
    }
    snapshot = { at: Date.now(), items };
    return items;
  } catch {
    return null;
  }
};

export const getIndexSize = async (): Promise<number> => (await getIndexSnapshot())?.size ?? 0;

const compact = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

// Pure ranking helper (unit-tested): compact substring/subsequence match with a
// token-AND fallback, genre ANY-of filter and exclusion terms.
export const rankIndexItems = (records: IndexedAnime[], parsed: ParsedQuery, limit = 20): IndexedAnime[] => {
  const nq = compact(parsed.text);
  const tokens = parsed.text.split(/\s+/).map(compact).filter(Boolean);
  const scored: { item: IndexedAnime; score: number }[] = [];

  for (const item of records) {
    if (parsed.genres.length > 0) {
      const itemGenres = (item.genres ?? []).map((genre) => genre.toLowerCase());
      const matchesGenre = parsed.genres.some((genre) => itemGenres.some((itemGenre) => itemGenre.includes(genre)));
      if (!matchesGenre) continue;
    }

    const nt = compact(item.title);
    if (parsed.exclude.length > 0 && parsed.exclude.some((term) => compact(term) && nt.includes(compact(term))))
      continue;

    if (!nq && tokens.length === 0) {
      scored.push({ item, score: 1 });
      continue;
    }

    let score = nq ? fuzzyScore(nq, nt) : 0;
    if (score === 0 && tokens.length > 0) {
      let total = 0;
      let allMatched = true;
      for (const token of tokens) {
        const tokenScore = fuzzyScore(token, nt);
        if (tokenScore === 0) {
          allMatched = false;
          break;
        }
        total += tokenScore;
      }
      if (allMatched) score = Math.max(20, total / tokens.length);
    }
    if (score > 0) scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
};

// Anime-shaped results so every existing consumer (grid, facets) just works.
export const searchLocalIndex = async (query: string, limit = 20): Promise<Anime[]> => {
  const items = await getIndexSnapshot();
  if (!items || items.size < MIN_INDEX_FOR_SEARCH) return [];
  const ranked = rankIndexItems([...items.values()], parseQuerySyntax(query), limit);
  return ranked.map((item) => ({
    title: item.title,
    release: item.release ?? "",
    genres: item.genres ?? [],
    link: { endpoint: item.slug, image: item.image },
  }));
};

export const suggestLocal = async (
  prefix: string,
  limit = 8,
): Promise<{ slug: string; title: string; image?: string }[]> => {
  if (prefix.trim().length < 2) return [];
  const items = await getIndexSnapshot();
  if (!items || items.size === 0) return [];
  const parsed = parseQuerySyntax(prefix);
  const ranked = rankIndexItems([...items.values()], { ...parsed, genres: [] }, limit);
  return ranked.map((item) => ({ slug: item.slug, title: item.title, image: item.image }));
};

export const getIndexedBySlugs = async (slugs: string[]): Promise<IndexedAnime[]> => {
  const items = await getIndexSnapshot();
  if (!items) return [];
  return slugs.map((slug) => items.get(slug)).filter((item): item is IndexedAnime => Boolean(item));
};

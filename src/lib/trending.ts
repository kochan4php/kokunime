import { getRedis } from "@/lib/redis";
import { getIndexedBySlugs } from "@/lib/search-index";

// Trending = sum of per-day view counters over the last few days. No Redis ->
// no-op (the home rail simply hides itself).
const DAY_TTL_SECONDS = 60 * 60 * 48;
const DAYS_BACK = 3;

export interface TrendingItem {
  slug: string;
  title: string;
  image?: string;
  count: number;
}

const dayKey = (offset = 0): string => {
  const date = new Date(Date.now() - offset * 24 * 60 * 60 * 1000);
  return `kokunime:trending:${date.toISOString().slice(0, 10)}`;
};

export const recordTrendingView = async (slug: string): Promise<void> => {
  const redis = await getRedis();
  if (!redis) return;
  try {
    const key = dayKey();
    const raw = await redis.get(key);
    let counts: Record<string, number> = {};
    if (raw) {
      try {
        counts = JSON.parse(raw) as Record<string, number>;
      } catch {
        counts = {};
      }
    }
    counts[slug] = (counts[slug] ?? 0) + 1;
    await redis.set(key, JSON.stringify(counts), { EX: DAY_TTL_SECONDS });
  } catch {
    // Trending is best-effort telemetry; failures must never affect the page.
  }
};

export const getTrending = async (limit = 12): Promise<TrendingItem[]> => {
  const redis = await getRedis();
  if (!redis) return [];
  try {
    const keys = Array.from({ length: DAYS_BACK }, (_, i) => dayKey(i));
    const rawDays = await Promise.all(keys.map((key) => redis.get(key)));

    const totals = new Map<string, number>();
    for (const raw of rawDays) {
      if (!raw) continue;
      try {
        const counts = JSON.parse(raw) as Record<string, number>;
        for (const [slug, count] of Object.entries(counts)) {
          if (typeof count === "number" && count > 0) totals.set(slug, (totals.get(slug) ?? 0) + count);
        }
      } catch {
        // Skip malformed day payloads.
      }
    }

    const topSlugs = [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([slug]) => slug);
    if (topSlugs.length === 0) return [];

    const indexed = await getIndexedBySlugs(topSlugs);
    return indexed.map((item) => ({
      slug: item.slug,
      title: item.title,
      image: item.image,
      count: totals.get(item.slug) ?? 0,
    }));
  } catch {
    return [];
  }
};

import { Anime } from "@/interfaces";

export interface RecommendationItem {
  slug: string;
  title: string;
  image?: string;
  release?: string;
  genres: string[];
  score: number;
}

export interface RecommendationPayload {
  topGenre: string | null;
  items: RecommendationItem[];
}

// Pure scoring: candidates that share more (and more frequent) genres from
// the user's saved titles rank higher. Used by /api/recommend.
export function scoreRecommendations(
  candidates: Anime[],
  likedGenres: string[],
  excludeSlugs: string[],
  limit = 12,
): RecommendationPayload {
  const weights = new Map<string, number>();
  for (const genre of likedGenres) {
    const key = genre.toLowerCase();
    weights.set(key, (weights.get(key) ?? 0) + 1);
  }

  const excluded = new Set(excludeSlugs);
  const items: RecommendationItem[] = [];

  for (const item of candidates) {
    const slug = item.link?.endpoint?.replace(/^\/+|\/+$/g, "");
    if (!slug || excluded.has(slug)) continue;

    const matched = (item.genres ?? []).filter((genre) => weights.has(genre.toLowerCase()));
    const score = matched.reduce((sum, genre) => sum + (weights.get(genre.toLowerCase()) ?? 0), 0);
    if (score === 0) continue;

    items.push({
      slug,
      title: item.title,
      image: item.link?.image,
      release: item.release,
      genres: item.genres ?? [],
      score,
    });
  }

  items.sort((a, b) => b.score - a.score);

  const topGenre = [...weights.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return { topGenre, items: items.slice(0, limit) };
}

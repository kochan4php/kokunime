import upstream from "@/config/upstream";
import { AnimeDetail } from "@/interfaces";
import { cachedWithMeta, TTL, type CacheTier } from "@/services/cache";
import { load } from "cheerio";
import { parseAnimeDetail } from "./parse";
import { extractWithFallback } from "./parse-fallback";
import { stripHtmlNoise } from "./sanitize";

export async function getAnimeDetailWithMeta(slug: string): Promise<{ anime: AnimeDetail | null; tier: CacheTier }> {
  const { value, tier } = await cachedWithMeta<AnimeDetail | null>(
    `anime-detail:${slug}`,
    TTL.detail,
    async () => {
      const response = await upstream.get(`/${slug}`);
      const $ = load(stripHtmlNoise(response.data));
      const parsed = parseAnimeDetail($) as AnimeDetail;
      if (!parsed.title) {
        const fallback = extractWithFallback($);
        if (fallback.title) {
          parsed.title = fallback.title;
          if (fallback.image) parsed.image = parsed.image || fallback.image;
          if (fallback.synopsis) parsed.synopsis = parsed.synopsis || fallback.synopsis;
        }
      }
      return parsed;
    },
    null,
  );

  return { anime: value, tier };
}

export const getAnimeDetail = async (slug: string): Promise<AnimeDetail | null> =>
  (await getAnimeDetailWithMeta(slug)).anime;

import upstream from "@/config/upstream";
import { AnimeDetail } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { parseAnimeDetail } from "./parse";
import { extractWithFallback } from "./parse-fallback";
import { stripHtmlNoise } from "./sanitize";

export async function getAnimeDetail(slug: string): Promise<AnimeDetail | null> {
  return cached(
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
          parsed.image = parsed.image || fallback.image;
          parsed.synopsis = parsed.synopsis || fallback.synopsis;
        }
      }
      return parsed;
    },
    null,
  );
}

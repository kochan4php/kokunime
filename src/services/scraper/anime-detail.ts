import upstream from "@/config/upstream";
import { AnimeDetail } from "@/interfaces";
import { cachedWithMeta, TTL, type CacheTier } from "@/services/cache";
import { SCRAPE_BASE_URL } from "@/services/scraper/constants";
import { load } from "cheerio";
import { parseAnimeDetail } from "./parse";
import { extractWithFallback } from "./parse-fallback";
import { isRequestedUpstreamPath } from "./request-path";
import { stripHtmlNoise } from "./sanitize";

export async function getAnimeDetailWithMeta(
  slug: string,
): Promise<{ anime: AnimeDetail | null; tier: CacheTier; fetchedAt: number }> {
  const { value, tier, fetchedAt } = await cachedWithMeta<AnimeDetail | null>(
    `anime-detail:${slug}`,
    TTL.detail,
    async () => {
      const loadDetail = async () => {
        try {
          return await upstream.get(`/${slug}`);
        } catch (error) {
          const status = (error as { response?: { status?: number } }).response?.status;
          // Deleted pages (410) and unknown slugs (404) are both an honest 404;
          // we have no positive proof of deletion to serve 410 ourselves.
          if (status === 404 || status === 410) return null;
          throw error;
        }
      };
      const response = await loadDetail();
      if (!response) return null;
      // Unknown slugs redirect to the upstream homepage with 200; parsing that
      // body would render a fake detail page.
      if (!isRequestedUpstreamPath(response.request.responseURL, SCRAPE_BASE_URL, slug)) return null;
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

  return { anime: value, tier, fetchedAt };
}

export const getAnimeDetail = async (slug: string): Promise<AnimeDetail | null> =>
  (await getAnimeDetailWithMeta(slug)).anime;

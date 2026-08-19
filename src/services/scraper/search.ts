import upstream from "@/config/upstream";
import { Anime } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { sanitizeQuery, stripHtmlNoise } from "./sanitize";

export async function searchAnime(query: string): Promise<Anime[]> {
  const clean = sanitizeQuery(query);
  if (!clean) return [];

  return cached(
    `anime-search:${clean}`,
    TTL.search,
    async () => {
      const response = await upstream.get(`/?s=${encodeURIComponent(clean)}&post_type=post`);
      const $ = load(stripHtmlNoise(response.data));
      return formatAnimeData($);
    },
    [],
  );
}

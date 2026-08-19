import upstream from "@/config/upstream";
import { AnimeDetail } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { parseAnimeDetail } from "./parse";
import { stripHtmlNoise } from "./sanitize";

export async function getAnimeDetail(slug: string): Promise<AnimeDetail | null> {
  return cached(
    `anime-detail:${slug}`,
    TTL.detail,
    async () => {
      const response = await upstream.get(`/${slug}`);
      const $ = load(stripHtmlNoise(response.data));
      return parseAnimeDetail($) as AnimeDetail;
    },
    null,
  );
}

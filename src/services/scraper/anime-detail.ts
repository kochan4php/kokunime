import kusonime from "@/config/kusonime";
import { AnimeDetail } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { parseAnimeDetail } from "./parse";

export async function getAnimeDetail(slug: string): Promise<AnimeDetail | null> {
  return cached(
    `anime-detail:${slug}`,
    TTL.detail,
    async () => {
      const response = await kusonime.get(`/${slug}`);
      const $ = load(response.data);
      return parseAnimeDetail($) as AnimeDetail;
    },
    null,
  );
}

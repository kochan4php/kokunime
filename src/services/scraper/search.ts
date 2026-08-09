import kusonime from "@/config/kusonime";
import { Anime } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";

export async function searchAnime(query: string): Promise<Anime[]> {
  return cached(`search:${query}`, TTL.search, async () => {
    const response = await kusonime.get(`/?s=${query}&post_type=post`);
    const $ = load(response.data);
    return formatAnimeData($);
  });
}

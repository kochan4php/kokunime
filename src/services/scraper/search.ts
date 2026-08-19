import upstream from "@/config/upstream";
import { Anime } from "@/interfaces";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { sanitizeQuery, stripHtmlNoise } from "./sanitize";

export async function searchAnime(query: string): Promise<Anime[]> {
  try {
    const clean = sanitizeQuery(query);
    if (!clean) return [];
    const response = await upstream.get(`/?s=${encodeURIComponent(clean)}&post_type=post`);
    const $ = load(stripHtmlNoise(response.data));
    return formatAnimeData($);
  } catch {
    return [];
  }
}

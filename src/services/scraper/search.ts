import upstream from "@/config/upstream";
import { Anime } from "@/interfaces";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";

const sanitizeQuery = (input: string): string => {
  return input
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/\.{2,}[/\\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
};

export async function searchAnime(query: string): Promise<Anime[]> {
  try {
    const clean = sanitizeQuery(query);
    if (!clean) return [];
    const response = await upstream.get(`/?s=${encodeURIComponent(clean)}&post_type=post`);
    const $ = load(response.data);
    return formatAnimeData($);
  } catch {
    return [];
  }
}

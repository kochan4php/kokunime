import upstream from "@/config/upstream";
import { resolveSearchAlias, mergeSearchResults } from "@/config/search-aliases";
import { Anime } from "@/interfaces";
import { cachedWithMeta, TTL, type CacheTier } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { sanitizeQuery, stripHtmlNoise } from "./sanitize";

const fetchSearchPage = async (term: string): Promise<Anime[]> => {
  const response = await upstream.get(`/?s=${encodeURIComponent(term)}&post_type=post`);
  const $ = load(stripHtmlNoise(response.data));
  return formatAnimeData($);
};

export async function searchAnimeWithMeta(query: string): Promise<{ results: Anime[]; tier: CacheTier }> {
  const clean = sanitizeQuery(query);
  if (!clean) return { results: [], tier: "miss" };

  const { value, tier } = await cachedWithMeta<Anime[]>(
    `anime-search:${clean}`,
    TTL.search,
    async () => {
      const alias = resolveSearchAlias(clean);
      if (!alias) return fetchSearchPage(clean);

      // Search the canonical title and the literal query; keep whichever side
      // succeeds (only fail when both do, so stale/fallback logic still works).
      const [aliasRes, literalRes] = await Promise.allSettled([fetchSearchPage(alias), fetchSearchPage(clean)]);
      if (aliasRes.status === "rejected" && literalRes.status === "rejected") {
        throw new Error("search upstream failed");
      }
      const primary = aliasRes.status === "fulfilled" ? aliasRes.value : [];
      const secondary = literalRes.status === "fulfilled" ? literalRes.value : [];
      return mergeSearchResults(primary, secondary);
    },
    [],
  );

  return { results: value, tier };
}

export const searchAnime = async (query: string): Promise<Anime[]> => (await searchAnimeWithMeta(query)).results;

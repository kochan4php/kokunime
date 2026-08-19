import upstream from "@/config/upstream";
import { AnimePage, Genre } from "@/interfaces";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import parseTaxonomy from "./parse-taxonomy";
import { stripHtmlNoise } from "./sanitize";

export async function getGenres(): Promise<Genre[]> {
  return parseTaxonomy("/genres") as Promise<Genre[]>;
}

async function fetchSingleGenrePage(cleanGenre: string, pageNum: number): Promise<AnimePage> {
  try {
    const path = pageNum > 1 ? `/genres/${cleanGenre}/page/${pageNum}` : `/genres/${cleanGenre}`;
    const response = await upstream.get(path);

    const rawFinalUrl =
      (response.request as { res?: { responseUrl?: string }; responseURL?: string })?.res?.responseUrl ??
      (response.request as { responseURL?: string })?.responseURL ??
      response.config?.url ??
      path;
    const finalUrl = rawFinalUrl.toLowerCase();
    if (!finalUrl.includes(`/genres/${cleanGenre}`) && !finalUrl.includes(`genre=${cleanGenre}`)) {
      return { anime: [], pagination: null };
    }
    const $ = load(stripHtmlNoise(response.data));
    const anime = formatAnimeData($);
    if (anime.length === 0) {
      return { anime: [], pagination: null };
    }

    return { anime, pagination: parseSimplePagination($, pageNum) };
  } catch {
    return { anime: [], pagination: null };
  }
}

export async function getAnimeByGenres(genre: string, page: number | string): Promise<AnimePage> {
  const cleanGenre = decodeURIComponent(genre).trim().toLowerCase();
  const requestedPage = Math.max(1, Number(page) || 1);
  const p1 = (requestedPage - 1) * 3 + 1;
  const p2 = p1 + 1;
  const p3 = p1 + 2;

  const [res1, res2, res3] = await Promise.all([
    fetchSingleGenrePage(cleanGenre, p1),
    fetchSingleGenrePage(cleanGenre, p2),
    fetchSingleGenrePage(cleanGenre, p3),
  ]);

  if (res1.anime.length === 0 && res2.anime.length === 0 && res3.anime.length === 0) {
    return { anime: [], pagination: null };
  }

  const combinedAnime = [...res1.anime, ...res2.anime, ...res3.anime];
  const hasNextPage = Boolean(
    res3.pagination?.next_page_endpoint ||
    res2.pagination?.next_page_endpoint ||
    res1.pagination?.next_page_endpoint
  );

  const pagination = {
    first_page_endpoint: `genres/${cleanGenre}`,
    next_page_endpoint: hasNextPage ? `genres/${cleanGenre}?page=${requestedPage + 1}` : null,
    current_page: requestedPage,
    pages_of: `Page ${requestedPage}`,
    total_page: hasNextPage ? requestedPage + 1 : requestedPage,
    prev_page_endpoint: requestedPage > 1 ? `genres/${cleanGenre}?page=${requestedPage - 1}` : null,
    last_page_endpoint: `genres/${cleanGenre}`,
  };

  return { anime: combinedAnime, pagination };
}

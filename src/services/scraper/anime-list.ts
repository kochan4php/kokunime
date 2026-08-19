import upstream from "@/config/upstream";
import { AnimePage } from "@/interfaces";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parsePagination } from "./parse-pagination";
import { stripHtmlNoise } from "./sanitize";

async function fetchSinglePage(upstreamPage: number): Promise<AnimePage> {
  try {
    const response = await upstream.get(`/page/${upstreamPage}`);
    const finalUrl: string =
      (response.request as { res?: { responseUrl?: string }; responseURL?: string })?.res?.responseUrl ??
      (response.request as { responseURL?: string })?.responseURL ??
      response.config?.url ??
      "";
    if (upstreamPage > 1 && !finalUrl.includes(`/page/${upstreamPage}`)) {
      return { anime: [], pagination: null };
    }
    const $ = load(stripHtmlNoise(response.data));
    const anime = formatAnimeData($);
    const pagination = parsePagination($);
    return { anime, pagination };
  } catch {
    return { anime: [], pagination: null };
  }
}

export async function getAnimePerPage(page: number): Promise<AnimePage> {
  const p1 = (page - 1) * 3 + 1;
  const p2 = p1 + 1;
  const p3 = p1 + 2;

  const [res1, res2, res3] = await Promise.all([
    fetchSinglePage(p1),
    fetchSinglePage(p2),
    fetchSinglePage(p3),
  ]);

  const combinedAnime = [...res1.anime, ...res2.anime, ...res3.anime];
  const upstreamTotal =
    res1.pagination?.total_page ??
    res2.pagination?.total_page ??
    res3.pagination?.total_page ??
    1;
  const total_page = Math.max(1, Math.ceil(upstreamTotal / 3));

  const pagination = {
    first_page_endpoint: "page/1",
    next_page_endpoint: page < total_page ? `page/${page + 1}` : null,
    current_page: page,
    pages_of: `Page ${page} of ${total_page}`,
    total_page,
    prev_page_endpoint: page > 1 ? `page/${page - 1}` : null,
    last_page_endpoint: `page/${total_page}`,
  };

  return { anime: combinedAnime, pagination };
}

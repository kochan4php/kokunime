import type { Anime } from "@/interfaces";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { getAnimeByGenres, getAnimeBySeasons, getAnimePerPage } from "@/services/scraper";
import { parseRelativeAge } from "@/utils/relative-age";

const FEED_CACHE = "public, max-age=0, s-maxage=1800, stale-while-revalidate=1800";
export const UPDATE_FEED_CACHE = "public, max-age=0, s-maxage=900, stale-while-revalidate=1800";

// Conditional GET + ETag for every hand-built feed. Bodies cap at 50 entries,
// so hashing the finished string is cheaper than keeping a feed cache.
export const feedResponse = (
  request: Request,
  body: string,
  contentType: string,
  options: { cache?: string; headers?: Record<string, string> } = {},
): Response => {
  const etag = generateEtag(body);
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Cache-Control": options.cache ?? FEED_CACHE,
    ETag: etag,
    ...options.headers,
  };
  if (checkEtagMatch(request, etag)) return new Response(null, { status: 304, headers });
  return new Response(body, { headers });
};

// The upstream only exposes relative labels ("4 jam lalu"), so item dates are
// estimated from that label. Never stamp every item with the fetch time: feed
// readers would see the whole catalog as changed on every poll.
export const releaseDate = (release?: string | null): Date => {
  const age = parseRelativeAge(release);
  // Round to the hour: the body feeds hashes must stay byte-identical between
  // two conditional requests, and the label itself only has minute precision.
  const now = Math.floor(Date.now() / 3_600_000) * 3_600_000;
  if (age.minutesAgo !== undefined) return new Date(now - age.minutesAgo * 60_000);
  switch (age.bucket) {
    case "yesterday":
      return new Date(now - 24 * 60 * 60_000);
    case "recent":
      return new Date(now - 3 * 24 * 60 * 60_000);
    case "older":
      return new Date(now - 30 * 24 * 60 * 60_000);
    default:
      return new Date(now);
  }
};

export const escapeXml = (unsafe: string): string =>
  unsafe.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return char;
    }
  });

interface FeedEntry {
  title: string;
  url: string;
  image?: string | undefined;
  summary: string;
  updated: Date;
  tags: string[];
}

interface FeedData {
  title: string;
  description: string;
  entries: FeedEntry[];
  // "?genre=action" etc. — appended to whichever feed path serves the request.
  querySuffix: string;
}

// Shared by /feed.xml and /feed.atom: same source, same genre/season filters,
// excerpt-enriched summaries (genres + release).
export const getFeedData = async (siteUrl: string, genre: string | null, season: string | null): Promise<FeedData> => {
  let animeList: Anime[] = [];
  let title = "Kokunime - Download Anime Batch Subtitle Indonesia";
  let description =
    "Website download anime subtitle Indonesia batch dan episode lengkap dengan pilihan kualitas 360p, 480p, 720p, 1080p.";

  if (genre) {
    const res = await getAnimeByGenres(genre, 1);
    animeList = res.anime || [];
    title = `Kokunime - Genre ${genre.toUpperCase()}`;
    description = `Daftar anime terbaru untuk genre ${genre} di Kokunime.`;
  } else if (season) {
    const res = await getAnimeBySeasons(season, 1);
    animeList = res.anime || [];
    title = `Kokunime - Season ${season.toUpperCase()}`;
    description = `Daftar anime terbaru untuk musim ${season} di Kokunime.`;
  } else {
    const res = await getAnimePerPage(1);
    animeList = res.anime || [];
  }

  const entries: FeedEntry[] = animeList.map((item) => {
    const endpoint = item.link?.endpoint || "";
    const url = `${siteUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const genres = item.genres?.filter(Boolean).slice(0, 3).join(", ");
    return {
      title: item.title ?? "",
      url,
      image: item.link?.image,
      summary: `Download ${item.title} Subtitle Indonesia${genres ? ` — ${genres}` : ""} · Rilis: ${item.release || "Terbaru"}`,
      updated: releaseDate(item.release),
      tags: item.genres?.filter(Boolean) ?? [],
    };
  });

  const querySuffix = genre
    ? `?genre=${encodeURIComponent(genre)}`
    : season
      ? `?season=${encodeURIComponent(season)}`
      : "";

  return { title, description, entries, querySuffix };
};

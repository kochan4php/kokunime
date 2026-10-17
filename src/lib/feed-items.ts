import type { Anime } from "@/interfaces";
import { getAnimeByGenres, getAnimeBySeasons, getAnimePerPage } from "@/services/scraper";

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

export interface FeedEntry {
  title: string;
  url: string;
  image?: string;
  summary: string;
  updated: Date;
}

export interface FeedData {
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

  const updated = new Date();
  const entries: FeedEntry[] = animeList.map((item) => {
    const endpoint = item.link?.endpoint || "";
    const url = `${siteUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const genres = item.genres?.filter(Boolean).slice(0, 3).join(", ");
    return {
      title: item.title ?? "",
      url,
      image: item.link?.image,
      summary: `Download ${item.title} Subtitle Indonesia${genres ? ` — ${genres}` : ""} · Rilis: ${item.release || "Terbaru"}`,
      updated,
    };
  });

  const querySuffix = genre
    ? `?genre=${encodeURIComponent(genre)}`
    : season
      ? `?season=${encodeURIComponent(season)}`
      : "";

  return { title, description, entries, querySuffix };
};

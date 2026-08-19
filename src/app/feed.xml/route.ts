import { getAnimeByGenres, getAnimeBySeasons, getAnimePerPage } from "@/services/scraper";
import { NextRequest } from "next/server";

const escapeXml = (unsafe: string): string =>
  unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
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
        return c;
    }
  });

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const siteUrl = "https://kokunime.netlify.app";
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre");
  const season = searchParams.get("season");

  let animeList = [];
  let feedTitle = "Kokunime - Download Anime Batch Subtitle Indonesia";
  let feedDesc =
    "Website download anime subtitle Indonesia batch dan episode lengkap dengan pilihan kualitas 360p, 480p, 720p, 1080p.";

  if (genre) {
    const res = await getAnimeByGenres(genre, 1);
    animeList = res.anime || [];
    feedTitle = `Kokunime - Genre ${genre.toUpperCase()}`;
    feedDesc = `Daftar anime terbaru untuk genre ${genre} di Kokunime.`;
  } else if (season) {
    const res = await getAnimeBySeasons(season, 1);
    animeList = res.anime || [];
    feedTitle = `Kokunime - Season ${season.toUpperCase()}`;
    feedDesc = `Daftar anime terbaru untuk musim ${season} di Kokunime.`;
  } else {
    const res = await getAnimePerPage(1);
    animeList = res.anime || [];
  }

  const rssItems = animeList
    .map((item) => {
      const endpoint = item.link?.endpoint || "";
      const itemUrl = `${siteUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
      const image = item.link?.image;
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${itemUrl}</link>
      <guid>${itemUrl}</guid>
      <description>${escapeXml(`Download ${item.title} Subtitle Indonesia - Rilis: ${item.release || "Terbaru"}`)}</description>
      ${image ? `<enclosure url="${escapeXml(image)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const feedPath = genre
    ? `/feed.xml?genre=${encodeURIComponent(genre)}`
    : season
      ? `/feed.xml?season=${encodeURIComponent(season)}`
      : `/feed.xml`;

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(feedDesc)}</description>
    <language>id-ID</language>
    <atom:link href="${siteUrl}${feedPath}" rel="self" type="application/rss+xml"/>
    <atom:link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
${rssItems}
  </channel>
</rss>`.trim();

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=1800",
    },
  });
}

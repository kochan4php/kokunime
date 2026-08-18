import { getAnimeByGenres, getAnimeBySeasons, getAnimePerPage } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
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

  const items = animeList.map((item) => {
    const endpoint = item.link?.endpoint || "";
    const itemUrl = `${siteUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    return {
      id: itemUrl,
      url: itemUrl,
      title: item.title,
      content_text: `Download ${item.title} Subtitle Indonesia - Rilis: ${item.release || "Terbaru"}`,
      image: item.link?.image,
      tags: item.genres || [],
    };
  });

  const feedPath = genre
    ? `/feed.json?genre=${encodeURIComponent(genre)}`
    : season
      ? `/feed.json?season=${encodeURIComponent(season)}`
      : `/feed.json`;

  const jsonFeed = {
    version: "https://jsonfeed.org/version/1.1",
    title: feedTitle,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}${feedPath}`,
    description: feedDesc,
    language: "id-ID",
    items,
  };

  return NextResponse.json(jsonFeed, {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=1800",
    },
  });
}

import { getAnimeByGenres } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ genre: string }> },
): Promise<NextResponse> {
  try {
    const { genre } = await params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

    const { anime = [], pagination } = await getAnimeByGenres(genre, page);

    return NextResponse.json(
      {
        genre,
        page,
        total: anime.length,
        anime,
        pagination,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch anime by genre" }, { status: 500 });
  }
}

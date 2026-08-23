import { getAnimeBySeasons } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ season: string }> },
): Promise<NextResponse> {
  try {
    const { season } = await params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

    const { anime = [], pagination } = await getAnimeBySeasons(season, page);

    return NextResponse.json(
      {
        season,
        page,
        total: anime.length,
        anime,
        pagination,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=600",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch anime by season" }, { status: 500 });
  }
}

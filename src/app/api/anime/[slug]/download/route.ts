import { getAnimeDetail } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const detail = await getAnimeDetail(slug);
    if (!detail || !detail.title) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const resolutionFilter = searchParams.get("res")?.toLowerCase();

    let downloadGroups = detail.download ?? [];

    if (resolutionFilter) {
      downloadGroups = downloadGroups
        .map((group) => ({
          ...group,
          link_download: group.link_download.filter((res) =>
            res.resolusi.toLowerCase().includes(resolutionFilter),
          ),
        }))
        .filter((group) => group.link_download.length > 0);
    }

    return NextResponse.json(
      {
        slug,
        title: detail.title,
        japanese: detail.japanese,
        score: detail.score,
        status: detail.status,
        type: detail.type,
        total_episode: detail.total_episode,
        trailer: detail.trailer,
        download: downloadGroups,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch download links" }, { status: 500 });
  }
}

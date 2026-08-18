import { getAnimeDetail } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
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

    return NextResponse.json(
      {
        slug,
        ...detail,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch anime details" }, { status: 500 });
  }
}

import { getAnimeDetailWithMeta } from "@/services/scraper";
import { xCacheHeaders } from "@/services/cache";
import { getRequestId } from "@/lib/request-id";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const started = performance.now();
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required", requestId: getRequestId(request) }, { status: 400 });
    }

    const { anime: detail, tier } = await getAnimeDetailWithMeta(slug);
    if (!detail || !detail.title) {
      return NextResponse.json({ error: "Anime not found", requestId: getRequestId(request) }, { status: 404 });
    }

    return NextResponse.json(
      {
        slug,
        ...detail,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
          ...xCacheHeaders(tier),
          "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch anime details", requestId: getRequestId(request) },
      { status: 500, headers: { ...xCacheHeaders("fallback") } },
    );
  }
}

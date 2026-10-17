import { getAnimeBySeasons } from "@/services/scraper";
import { decodeCursor, encodeCursor } from "@/lib/api-pagination";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { normalizeSlug } from "@/utils/endpoint-slug";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ season: string }> },
): Promise<NextResponse | Response> {
  try {
    const { season } = await params;
    if (!normalizeSlug(season)) {
      return NextResponse.json({ error: "Invalid season slug" }, { status: 400 });
    }
    const { searchParams } = new URL(request.url);
    // Opaque cursor wins over ?page when both are present.
    const cursorPage = decodeCursor(searchParams.get("cursor"));
    const page = cursorPage ?? Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

    const { anime = [], pagination } = await getAnimeBySeasons(season, page);

    const payload = {
      season,
      page,
      total: anime.length,
      anime,
      pagination,
      next_cursor: pagination?.next_page_endpoint ? encodeCursor(page + 1) : null,
    };

    const etag = generateEtag(JSON.stringify(payload));
    const cacheHeaders = { "Cache-Control": "private, max-age=600", ETag: etag };
    if (checkEtagMatch(request, etag)) {
      return new Response(null, { status: 304, headers: cacheHeaders });
    }

    return NextResponse.json(payload, { headers: cacheHeaders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch anime by season" }, { status: 500 });
  }
}

import { getAnimeByGenres } from "@/services/scraper";
import { decodeCursor, encodeCursor } from "@/lib/api-pagination";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { normalizeSlug } from "@/utils/endpoint-slug";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ genre: string }> },
): Promise<NextResponse | Response> {
  try {
    const { genre } = await params;
    if (!normalizeSlug(genre)) {
      return NextResponse.json({ error: "Invalid genre slug" }, { status: 400 });
    }
    const { searchParams } = new URL(request.url);
    // Opaque cursor wins over ?page when both are present.
    const cursorPage = decodeCursor(searchParams.get("cursor"));
    const page = cursorPage ?? Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

    const { anime = [], pagination } = await getAnimeByGenres(genre, page);

    const payload = {
      genre,
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
    return NextResponse.json({ error: "Failed to fetch anime by genre" }, { status: 500 });
  }
}

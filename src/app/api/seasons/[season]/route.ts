import { getAnimeBySeasons } from "@/services/scraper";
import { decodeCursor, encodeCursor } from "@/lib/api-pagination";
import { problemResponse } from "@/lib/api-error";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { runWithRequestId } from "@/lib/request-context";
import { getRequestId } from "@/lib/request-id";
import { normalizeSlug } from "@/utils/endpoint-slug";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ season: string }> },
): Promise<NextResponse | Response> {
  return runWithRequestId(getRequestId(request), async () => {
    try {
      const { season } = await params;
      if (!normalizeSlug(season)) {
        return problemResponse({ status: 400, title: "Bad Request", detail: "Invalid season slug" });
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
      return problemResponse({ status: 500, title: "Upstream failure", detail: "Failed to fetch anime by season" });
    }
  });
}

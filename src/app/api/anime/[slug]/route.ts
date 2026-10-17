import { getAnimeDetailWithMeta } from "@/services/scraper";
import { xCacheHeaders } from "@/services/cache";
import { parseFieldsParam, projectRecord } from "@/lib/api-projection";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { getRequestId } from "@/lib/request-id";
import { normalizeSlug } from "@/utils/endpoint-slug";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse | Response> {
  const started = performance.now();
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required", requestId: getRequestId(request) }, { status: 400 });
    }
    if (!normalizeSlug(slug)) {
      return NextResponse.json({ error: "Invalid slug", requestId: getRequestId(request) }, { status: 400 });
    }

    const { anime: detail, tier } = await getAnimeDetailWithMeta(slug);
    if (!detail || !detail.title) {
      return NextResponse.json({ error: "Anime not found", requestId: getRequestId(request) }, { status: 404 });
    }

    const payload: Record<string, unknown> = { slug, ...detail };
    // fields=title,download… — unknown names are ignored (see lib/api-projection).
    const fields = parseFieldsParam(request.nextUrl.searchParams.get("fields"), Object.keys(payload));
    const projected = projectRecord(payload, fields);

    const etag = generateEtag(JSON.stringify(projected));
    const headers = {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
      ETag: etag,
      ...xCacheHeaders(tier),
      "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    };
    if (checkEtagMatch(request, etag)) {
      return new Response(null, { status: 304, headers });
    }

    return NextResponse.json(projected, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch anime details", requestId: getRequestId(request) },
      { status: 500, headers: { ...xCacheHeaders("fallback") } },
    );
  }
}

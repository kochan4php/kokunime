import { suggestLocal } from "@/lib/search-index";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-id";
import { sanitizeQuery } from "@/services/scraper/sanitize";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Autocomplete backed by the local catalog index. Without Redis (or before the
// first warm-up) it answers with an empty list — callers must treat that as
// "no suggestions", not an error.
export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  const started = performance.now();
  const ip = request.headers.get("x-forwarded-for") || "suggest-client";
  const rate = await checkRateLimit(ip, 120, 60_000);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down.", requestId: getRequestId(request) },
      { status: 429, headers: rateHeaders },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = sanitizeQuery(searchParams.get("q") ?? "", 60);
  const items = query.length >= 2 ? await suggestLocal(query, 8) : [];

  const payload = { query, total: items.length, items };
  const etag = generateEtag(JSON.stringify(payload));
  const headers = {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    ETag: etag,
    "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    ...rateHeaders,
  };
  if (checkEtagMatch(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return NextResponse.json(payload, { headers });
}

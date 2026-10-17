import { suggestLocal } from "@/lib/search-index";
import { problemResponse } from "@/lib/api-error";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { RATE_LIMIT_WINDOW_MS, RATE_LIMITS } from "@/config/constants";
import { isFeatureEnabled } from "@/lib/feature-flags";
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
  const rate = await checkRateLimit(ip, RATE_LIMITS.suggest, RATE_LIMIT_WINDOW_MS);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return problemResponse({
      status: 429,
      title: "Too Many Requests",
      detail: "Too many requests. Please slow down.",
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }

  const { searchParams } = new URL(request.url);
  const query = sanitizeQuery(searchParams.get("q") ?? "", 60);
  // Runtime flag: kill switch for autocomplete without a redeploy.
  const items = query.length >= 2 && (await isFeatureEnabled("suggest")) ? await suggestLocal(query, 8) : [];

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

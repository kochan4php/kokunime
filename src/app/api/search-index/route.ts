import { getIndexDump } from "@/lib/search-index";
import { problemResponse } from "@/lib/api-error";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { RATE_LIMIT_WINDOW_MS, RATE_LIMITS } from "@/config/constants";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-id";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Compact dump of the server-side catalog index for the browser: the client
// stores it, merges it with what the visitor already saw and searches offline.
// Rows are arrays (not objects) purely to keep the payload small.
//
// Without Redis (or before the first warm-up) the list is empty — callers must
// treat that as "nothing to merge", not an error.
export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  const started = performance.now();
  const ip = request.headers.get("x-forwarded-for") || "index-client";
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

  const enabled = await isFeatureEnabled("suggest");
  const dump = enabled ? await getIndexDump() : [];
  const payload = {
    total: dump.length,
    items: dump.map((item) => [item.slug, item.title, item.image ?? "", item.release ?? "", item.genres ?? []]),
  };
  const etag = generateEtag(`${payload.total}:${payload.items[payload.total - 1]?.[0] ?? ""}:${payload.total}`);
  const headers = {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    ETag: etag,
    "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    ...rateHeaders,
  };
  if (checkEtagMatch(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return NextResponse.json(payload, { headers });
}

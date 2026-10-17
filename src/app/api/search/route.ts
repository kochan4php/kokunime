import { searchAnimeWithMeta } from "@/services/scraper";
import { sanitizeQuery } from "@/services/scraper/sanitize";
import { xCacheHeaders } from "@/services/cache";
import { parseFieldsParam, projectRecord } from "@/lib/api-projection";
import { problemResponse } from "@/lib/api-error";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { RATE_LIMIT_WINDOW_MS, RATE_LIMITS } from "@/config/constants";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { runWithRequestId } from "@/lib/request-context";
import { getRequestId } from "@/lib/request-id";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  return runWithRequestId(getRequestId(request), async () => {
    const started = performance.now();
    try {
      const ip = request.headers.get("x-forwarded-for") || "search-client";
      const rate = await checkRateLimit(ip, RATE_LIMITS.search, RATE_LIMIT_WINDOW_MS);
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
      const rawQ = searchParams.get("q") ?? "";
      const q = sanitizeQuery(rawQ, 80);
      // fields=title,link… — unknown names are ignored (see lib/api-projection).
      const fields = parseFieldsParam(searchParams.get("fields"), ["title", "release", "genres", "link"]);

      if (!q || q.length < 2) {
        return NextResponse.json({ query: q, total: 0, results: [] }, { headers: rateHeaders });
      }

      const { results, tier } = await searchAnimeWithMeta(q);
      const projected = fields
        ? results.map((result) => projectRecord(result as unknown as Record<string, unknown>, fields))
        : results;

      const payload = {
        query: q,
        total: results.length,
        results: projected,
      };

      const etag = generateEtag(JSON.stringify(payload));
      const headers = {
        "Cache-Control": "private, max-age=30",
        ETag: etag,
        ...xCacheHeaders(tier),
        "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
        ...rateHeaders,
      };
      if (checkEtagMatch(request, etag)) {
        return new Response(null, { status: 304, headers });
      }

      return NextResponse.json(payload, { headers });
    } catch {
      return problemResponse({
        status: 500,
        title: "Upstream failure",
        detail: "Failed to search anime",
        requestId: getRequestId(request),
      });
    }
  });
}

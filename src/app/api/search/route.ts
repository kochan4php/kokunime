import { searchAnimeWithMeta } from "@/services/scraper";
import { sanitizeQuery } from "@/services/scraper/sanitize";
import { xCacheHeaders } from "@/services/cache";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-id";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const started = performance.now();
  try {
    const ip = request.headers.get("x-forwarded-for") || "search-client";
    const rate = await checkRateLimit(ip, 60, 60_000);
    const rateHeaders = getRateLimitHeaders(rate);

    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down.", requestId: getRequestId(request) },
        { status: 429, headers: rateHeaders },
      );
    }

    const { searchParams } = new URL(request.url);
    const rawQ = searchParams.get("q") ?? "";
    const q = sanitizeQuery(rawQ, 80);

    if (!q || q.length < 2) {
      return NextResponse.json({ query: q, total: 0, results: [] }, { headers: rateHeaders });
    }

    const { results, tier } = await searchAnimeWithMeta(q);

    return NextResponse.json(
      {
        query: q,
        total: results.length,
        results,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=30",
          ...xCacheHeaders(tier),
          "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
          ...rateHeaders,
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to search anime", requestId: getRequestId(request) }, { status: 500 });
  }
}

import { searchAnime } from "@/services/scraper";
import { sanitizeQuery } from "@/services/scraper/sanitize";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = request.headers.get("x-forwarded-for") || "search-client";
    const rate = checkRateLimit(ip, 60, 60_000);
    const rateHeaders = getRateLimitHeaders(rate);

    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: rateHeaders },
      );
    }

    const { searchParams } = new URL(request.url);
    const rawQ = searchParams.get("q") ?? "";
    const q = sanitizeQuery(rawQ, 80);

    if (!q || q.length < 2) {
      return NextResponse.json({ query: q, total: 0, results: [] }, { headers: rateHeaders });
    }

    const results = await searchAnime(q);

    return NextResponse.json(
      {
        query: q,
        total: results.length,
        results,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=30",
          ...rateHeaders,
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to search anime" }, { status: 500 });
  }
}

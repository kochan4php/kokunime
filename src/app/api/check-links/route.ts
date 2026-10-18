import { getAnimeDetail } from "@/services/scraper";
import { problemResponse } from "@/lib/api-error";
import { RATE_LIMIT_WINDOW_MS } from "@/config/constants";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { isSafeSlug } from "@/utils/endpoint-slug";
import { getRequestId } from "@/lib/request-id";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_SLUGS = 30;
const CHECK_LIMIT_PER_MINUTE = 12;

// Batch dead-link check for the bookmarks collection checker. A slug is
// "ok" when the upstream detail page still parses to a titled record —
// exactly the check the detail route itself performs, with the scraper's
// cache absorbing repeat runs.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for") || "check-links-client";
  const rate = await checkRateLimit(ip, CHECK_LIMIT_PER_MINUTE, RATE_LIMIT_WINDOW_MS);
  const rateHeaders = getRateLimitHeaders(rate);
  if (!rate.success) {
    return problemResponse({
      status: 429,
      title: "Too Many Requests",
      detail: "Too many checks. Please slow down.",
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }

  const raw = request.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = raw
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
  if (slugs.length === 0) {
    return problemResponse({
      status: 400,
      title: "Bad Request",
      detail: "Provide ?slugs=slug-a,slug-b",
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }
  if (slugs.length > MAX_SLUGS) {
    return problemResponse({
      status: 400,
      title: "Bad Request",
      detail: `At most ${MAX_SLUGS} slugs per request`,
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }
  if (!slugs.every((slug) => isSafeSlug(slug))) {
    return problemResponse({
      status: 400,
      title: "Bad Request",
      detail: "One or more slugs are invalid",
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }

  const results = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const detail = await getAnimeDetail(slug);
        return { slug, ok: Boolean(detail && detail.title) };
      } catch {
        return { slug, ok: false };
      }
    }),
  );

  const dead = results.filter((result) => !result.ok).length;
  return NextResponse.json(
    { checked: results.length, dead, results },
    {
      headers: {
        "Cache-Control": "no-store",
        ...rateHeaders,
      },
    },
  );
}

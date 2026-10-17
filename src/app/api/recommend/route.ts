import { getAnimeDetail, getAnimePerPage } from "@/services/scraper";
import { cachedWithMeta, TTL, xCacheHeaders } from "@/services/cache";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-id";
import { scoreRecommendations, type RecommendationPayload } from "@/lib/recommend";
import { Anime } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,119}$/;
const MAX_SEEDS = 4;

const EMPTY: RecommendationPayload = { topGenre: null, items: [] };

// Personal recommendations from the user's saved titles. The client sends
// bookmark slugs; we score cached listing items against their genres.
export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  const started = performance.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "recommend-client";
  const rate = await checkRateLimit(`recommend:${ip}`, 30, 60_000);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down.", requestId: getRequestId(request) },
      { status: 429, headers: rateHeaders },
    );
  }

  const raw = request.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = [
    ...new Set(
      raw
        .split(",")
        .map((slug) => slug.trim().toLowerCase())
        .filter((slug) => SLUG_RE.test(slug)),
    ),
  ].slice(0, MAX_SEEDS);

  if (slugs.length === 0) {
    return NextResponse.json(EMPTY, { headers: rateHeaders });
  }

  const { value: payload, tier } = await cachedWithMeta<RecommendationPayload>(
    `recommend:${[...slugs].sort().join(",")}`,
    TTL.recommendations,
    async (): Promise<RecommendationPayload> => {
      const detailResults = await Promise.allSettled(slugs.map((slug) => getAnimeDetail(slug)));
      const genreCounts = new Map<string, number>();
      for (const res of detailResults) {
        if (res.status !== "fulfilled" || !res.value) continue;
        for (const genre of res.value.genre ?? []) {
          if (genre?.name) genreCounts.set(genre.name, (genreCounts.get(genre.name) ?? 0) + 1);
        }
      }

      const likedGenres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
      if (likedGenres.length === 0) return EMPTY;

      const pageResults = await Promise.allSettled([1, 2, 3].map((page) => getAnimePerPage(page)));
      const seen = new Set<string>();
      const candidates: Anime[] = [];
      for (const res of pageResults) {
        if (res.status !== "fulfilled") continue;
        for (const item of res.value.anime ?? []) {
          const key = item.link?.endpoint ?? item.title;
          if (seen.has(key)) continue;
          seen.add(key);
          candidates.push(item);
        }
      }

      return scoreRecommendations(candidates, likedGenres, slugs, 12);
    },
    EMPTY,
  );

  const etag = generateEtag(JSON.stringify(payload));
  const headers = {
    ETag: etag,
    ...xCacheHeaders(tier),
    "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    ...rateHeaders,
  };
  if (checkEtagMatch(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return NextResponse.json(payload, { headers });
}

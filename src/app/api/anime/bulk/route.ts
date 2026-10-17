import { getAnimeDetail } from "@/services/scraper";
import { parseFieldsParam, projectRecord } from "@/lib/api-projection";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { isSafeSlug } from "@/utils/endpoint-slug";
import { NextRequest, NextResponse } from "next/server";

const BLOCKED_USER_AGENTS = /scrapy|sqlmap|masscan|nikto|zgrab|acunetix|petalbot|censys/i;
const MAX_SLUGS = 20;

// Whitelist for fields= — mirrors the AnimeDetail interface.
const DETAIL_FIELDS = [
  "title",
  "japanese",
  "image",
  "producer",
  "studio",
  "type",
  "status",
  "total_episode",
  "score",
  "duration",
  "release_on",
  "synopsis",
  "rating",
  "synonyms",
  "aliases",
  "subtitle",
  "audio",
  "genre",
  "season",
  "trailer",
  "download",
] as const;

interface BulkResult {
  slug: string;
  success: boolean;
  data: Record<string, unknown> | null;
}

const resolveBulk = async (slugs: string[], fields: string[] | null): Promise<BulkResult[]> =>
  Promise.all(
    slugs.map(async (slug) => {
      try {
        const data = await getAnimeDetail(slug);
        const ok = Boolean(data && data.title);
        return {
          slug,
          success: ok,
          data:
            ok && data
              ? (projectRecord(data as unknown as Record<string, unknown>, fields) as Record<string, unknown>)
              : null,
        };
      } catch {
        return { slug, success: false, data: null };
      }
    }),
  );

const guardRequest = async (
  request: NextRequest,
  limit: number,
): Promise<{ rateHeaders: Record<string, string> } | NextResponse> => {
  const ip = request.headers.get("x-forwarded-for") || "bulk-client";
  const rate = await checkRateLimit(ip, limit, 60_000);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many bulk requests. Please slow down." },
      { status: 429, headers: rateHeaders },
    );
  }

  const ua = request.headers.get("user-agent") || "";
  if (BLOCKED_USER_AGENTS.test(ua)) {
    return NextResponse.json(
      { error: "Access Denied: Malicious Crawler Blocked" },
      { status: 403, headers: rateHeaders },
    );
  }

  return { rateHeaders };
};

const cleanSlugs = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is string => typeof s === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && isSafeSlug(s))
    .slice(0, MAX_SLUGS);
};

// GET /api/anime/bulk?slugs=a,b&fields=title,score — cacheable + conditional GET.
export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  const started = performance.now();
  const guard = await guardRequest(request, 30);
  if (guard instanceof NextResponse) return guard;

  const { searchParams } = new URL(request.url);
  const slugs = cleanSlugs((searchParams.get("slugs") ?? "").split(","));
  const fields = parseFieldsParam(searchParams.get("fields"), DETAIL_FIELDS);

  if (slugs.length === 0) {
    return NextResponse.json({ total: 0, results: [] }, { headers: guard.rateHeaders });
  }

  const results = await resolveBulk(slugs, fields);
  const payload = { total: results.length, results };
  const etag = generateEtag(JSON.stringify(payload));
  const headers = {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    ETag: etag,
    "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    ...guard.rateHeaders,
  };
  if (checkEtagMatch(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return NextResponse.json(payload, { headers });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const guard = await guardRequest(request, 30);
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await request.json().catch(() => null);
    const slugs: unknown = body?.slugs ?? body;

    if (!Array.isArray(slugs)) {
      return NextResponse.json(
        { error: "Invalid request payload. Expected { slugs: string[] } or string[]" },
        { status: 400, headers: guard.rateHeaders },
      );
    }

    const requested = cleanSlugs(slugs);
    if (requested.length === 0) {
      return NextResponse.json({ total: 0, results: [] });
    }

    const fields = parseFieldsParam(typeof body?.fields === "string" ? body.fields : null, DETAIL_FIELDS);
    const results = await resolveBulk(requested, fields);

    return NextResponse.json({
      total: results.length,
      results,
    });
  } catch {
    return NextResponse.json({ error: "Failed to process bulk request" }, { status: 500 });
  }
}

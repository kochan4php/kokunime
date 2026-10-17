import { getAnimeDetail, getGenres } from "@/services/scraper";
import { redisGet, redisSet } from "@/lib/redis";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const APQ_TTL_SECONDS = 60 * 60 * 24 * 7;
const apqMemory = new Map<string, string>();
const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = request.headers.get("x-forwarded-for") || "graphql-client";
    const rate = await checkRateLimit(ip, 60, 60_000);
    const rateHeaders = getRateLimitHeaders(rate);

    if (!rate.success) {
      return NextResponse.json(
        { errors: [{ message: "Too many requests. Rate limit exceeded." }] },
        { status: 429, headers: rateHeaders },
      );
    }

    const body = await request.json().catch(() => ({}));
    let query = typeof body?.query === "string" ? body.query : "";

    // APQ (Automatic Persisted Queries): a hash-only request resolves from the
    // in-process map (Redis-backed when configured). The first request carrying
    // the full document registers it so repeat callers can drop the payload.
    const extensions = body?.extensions as { persistedQuery?: { version?: number; sha256Hash?: string } } | undefined;
    const hash =
      typeof extensions?.persistedQuery?.sha256Hash === "string"
        ? extensions.persistedQuery.sha256Hash.toLowerCase()
        : "";

    if (hash) {
      if (query) {
        if (sha256(query) !== hash) {
          return NextResponse.json(
            { errors: [{ message: "Provided sha256Hash does not match the query" }] },
            { status: 400, headers: rateHeaders },
          );
        }
        apqMemory.set(hash, query);
        void redisSet(`apq:${hash}`, query, APQ_TTL_SECONDS);
      } else {
        const cached = apqMemory.get(hash) ?? (await redisGet(`apq:${hash}`));
        if (typeof cached !== "string" || !cached) {
          return NextResponse.json(
            { errors: [{ message: "PersistedQueryNotFound", extensions: { code: "PERSISTED_QUERY_NOT_FOUND" } }] },
            { headers: rateHeaders },
          );
        }
        query = cached;
        apqMemory.set(hash, cached);
      }
    }

    if (!query) {
      return NextResponse.json(
        { errors: [{ message: "Missing query parameter in JSON payload" }] },
        { status: 400, headers: rateHeaders },
      );
    }

    // Length limit on GraphQL payload to prevent ReDoS / payload bombing
    if (query.length > 2000) {
      return NextResponse.json(
        { errors: [{ message: "Query payload too large (max 2000 chars)" }] },
        { status: 413, headers: rateHeaders },
      );
    }

    // Match anime query: { anime(slug: "...") { field1 field2 } }
    const animeMatch = query.match(/anime\s*\(\s*slug\s*:\s*["']([^"']+)["']\s*\)\s*\{([^}]+)\}/i);
    if (animeMatch) {
      const slug = animeMatch[1];
      const requestedFields = animeMatch[2].trim().split(/\s+/).filter(Boolean);

      const detail = await getAnimeDetail(slug);
      if (!detail) {
        return NextResponse.json({ data: { anime: null } }, { headers: rateHeaders });
      }

      const filtered: Record<string, unknown> = {};
      const detailRecord = detail as unknown as Record<string, unknown>;
      requestedFields.forEach((field: string) => {
        if (field in detailRecord) {
          filtered[field] = detailRecord[field];
        }
      });

      return NextResponse.json({ data: { anime: filtered } }, { headers: rateHeaders });
    }

    // Match genres query: { genres { field1 field2 } }
    if (/genres\s*\{/i.test(query)) {
      const genres = await getGenres();
      return NextResponse.json({ data: { genres } }, { headers: rateHeaders });
    }

    return NextResponse.json(
      {
        errors: [
          { message: 'Unsupported GraphQL query structure. Example: { anime(slug: "slug") { title score image } }' },
        ],
      },
      { status: 400, headers: rateHeaders },
    );
  } catch {
    return NextResponse.json({ errors: [{ message: "Failed to execute GraphQL query" }] }, { status: 500 });
  }
}

import { getAnimeDetail, getGenres } from "@/services/scraper";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = request.headers.get("x-forwarded-for") || "graphql-client";
    const rate = checkRateLimit(ip, 60, 60_000);
    const rateHeaders = getRateLimitHeaders(rate);

    if (!rate.success) {
      return NextResponse.json(
        { errors: [{ message: "Too many requests. Rate limit exceeded." }] },
        { status: 429, headers: rateHeaders },
      );
    }

    const body = await request.json().catch(() => ({}));
    const query = typeof body?.query === "string" ? body.query : "";

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

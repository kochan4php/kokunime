import { getAnimeDetail, getGenres } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}));
    const query = typeof body?.query === "string" ? body.query : "";

    if (!query) {
      return NextResponse.json({ error: "Missing query parameter in JSON payload" }, { status: 400 });
    }

    // Match anime query: { anime(slug: "...") { field1 field2 } }
    const animeMatch = query.match(/anime\s*\(\s*slug\s*:\s*["']([^"']+)["']\s*\)\s*\{([^}]+)\}/i);
    if (animeMatch) {
      const slug = animeMatch[1];
      const requestedFields = animeMatch[2].trim().split(/\s+/).filter(Boolean);

      const detail = await getAnimeDetail(slug);
      if (!detail) {
        return NextResponse.json({ data: { anime: null } });
      }

      const filtered: Record<string, unknown> = {};
      const detailRecord = detail as unknown as Record<string, unknown>;
      requestedFields.forEach((field: string) => {
        if (field in detailRecord) {
          filtered[field] = detailRecord[field];
        }
      });

      return NextResponse.json({ data: { anime: filtered } });
    }

    // Match genres query: { genres { field1 field2 } }
    if (/genres\s*\{/i.test(query)) {
      const genres = await getGenres();
      return NextResponse.json({ data: { genres } });
    }

    return NextResponse.json(
      {
        errors: [
          { message: 'Unsupported GraphQL query structure. Example: { anime(slug: "slug") { title score image } }' },
        ],
      },
      { status: 400 },
    );
  } catch {
    return NextResponse.json({ error: "Failed to execute GraphQL query" }, { status: 500 });
  }
}

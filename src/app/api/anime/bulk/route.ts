import { getAnimeDetail } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const slugs: unknown = body?.slugs ?? body;

    if (!Array.isArray(slugs)) {
      return NextResponse.json(
        { error: "Invalid request payload. Expected { slugs: string[] } or string[]" },
        { status: 400 },
      );
    }

    const cleanSlugs = slugs
      .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
      .map((s) => s.trim())
      .slice(0, 20); // Cap at 20 slugs max

    if (cleanSlugs.length === 0) {
      return NextResponse.json({ total: 0, results: [] });
    }

    const results = await Promise.all(
      cleanSlugs.map(async (slug) => {
        try {
          const data = await getAnimeDetail(slug);
          return {
            slug,
            success: Boolean(data && data.title),
            data: data && data.title ? data : null,
          };
        } catch {
          return { slug, success: false, data: null };
        }
      }),
    );

    return NextResponse.json({
      total: results.length,
      results,
    });
  } catch {
    return NextResponse.json({ error: "Failed to process bulk request" }, { status: 500 });
  }
}

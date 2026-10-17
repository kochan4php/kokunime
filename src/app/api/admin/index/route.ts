import { getIndexSize, indexAnimeItems } from "@/lib/search-index";
import { isRedisConfigured } from "@/lib/redis";
import { safeCompare } from "@/lib/safe-compare";
import { getAnimeByGenres, getAnimePerPage, getGenresWithMeta } from "@/services/scraper";
import { endpointSlug } from "@/utils/endpoint-slug";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Index status for the /admin dashboard.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = (process.env.ADMIN_TOKEN || process.env.METRICS_TOKEN || "").trim();
  if (!token) return new NextResponse("Not Found", { status: 404 });

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!safeCompare(provided.trim(), token)) {
    return new NextResponse("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  }

  return NextResponse.json({ size: await getIndexSize(), redis: isRedisConfigured() });
}

// Token-gated search-index warm-up: crawls the newest listing pages plus the
// first page of the top genres and stores every parsed item. Same auth as the
// revalidate hook (disabled/404 without ADMIN_TOKEN or METRICS_TOKEN).
export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = (process.env.ADMIN_TOKEN || process.env.METRICS_TOKEN || "").trim();
  if (!token) return new NextResponse("Not Found", { status: 404 });

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!safeCompare(provided.trim(), token)) {
    return new NextResponse("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  }

  let body: { pages?: unknown; genres?: unknown } = {};
  try {
    body = (await request.json()) as { pages?: unknown; genres?: unknown };
  } catch {
    // Defaults below.
  }
  const pages = Math.min(20, Math.max(1, Number(body.pages) || 5));
  const genreLimit = Math.min(20, Math.max(0, Number(body.genres) || 6));

  let indexed = 0;

  for (let page = 1; page <= pages; page++) {
    try {
      const { anime } = await getAnimePerPage(page);
      indexed += await indexAnimeItems(anime);
    } catch {
      // Keep crawling the remaining pages.
    }
  }

  if (genreLimit > 0) {
    try {
      const { genres } = await getGenresWithMeta();
      for (const genre of genres.slice(0, genreLimit)) {
        const slug = endpointSlug(genre.endpoint, "genres");
        if (!slug) continue;
        try {
          const { anime } = await getAnimeByGenres(slug, 1);
          indexed += await indexAnimeItems(anime);
        } catch {
          // Skip this genre, keep going.
        }
      }
    } catch {
      // Genre listing unavailable — page crawl results still count.
    }
  }

  return NextResponse.json({ ok: true, indexed, size: await getIndexSize() });
}

import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getAnimeDetail } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SITE_ORIGIN = new URL(SITE_URL).origin;
const CACHE = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400";

const parseSlug = (raw: string): string | null => {
  try {
    const parsed = new URL(raw);
    if (parsed.origin !== SITE_ORIGIN) return null;
    const match = parsed.pathname.match(/^\/anime\/([^/]+)\/?$/);
    if (!match?.[1]) return null;
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": CACHE,
};

// oEmbed 1.0 discovery target for anime detail pages. `type: "link"` is
// deliberate: Kokunime serves no iframe player, so there is no embed HTML to
// hand out and the global CSP keeps frame-ancestors 'none'.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const raw = request.nextUrl.searchParams.get("url") ?? "";
  const slug = parseSlug(raw);
  if (!slug) {
    return NextResponse.json({ error: "Parameter url harus halaman anime Kokunime." }, { status: 404, headers });
  }

  const anime = await getAnimeDetail(slug);
  if (!anime?.title) {
    return NextResponse.json({ error: "Anime tidak ditemukan." }, { status: 404, headers });
  }

  const image = anime.image
    ? anime.image.startsWith("http")
      ? anime.image
      : `${SITE_URL}${anime.image.startsWith("/") ? "" : "/"}${anime.image}`
    : `${SITE_URL}/og.png`;

  return NextResponse.json(
    {
      version: "1.0",
      type: "link",
      provider_name: SITE_NAME,
      provider_url: SITE_URL,
      title: anime.title,
      author_name: SITE_NAME,
      author_url: SITE_URL,
      url: `${SITE_URL}/anime/${slug}`,
      thumbnail_url: image,
      ...(anime.image ? {} : { thumbnail_width: 1200, thumbnail_height: 630 }),
      cache_age: 3600,
    },
    { headers },
  );
}

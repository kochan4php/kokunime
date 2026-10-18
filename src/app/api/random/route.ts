import { getAnimePerPage } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const started = performance.now();
  const timing = (): Record<string, string> => ({
    "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
  });
  const randomPage = Math.floor(Math.random() * 5) + 1;
  const { anime = [] } = await getAnimePerPage(randomPage);

  if (anime.length === 0) {
    return NextResponse.redirect(new URL("/", request.url), { headers: timing() });
  }

  const randomItem = anime[Math.floor(Math.random() * anime.length)];
  const endpoint = randomItem?.link?.endpoint || "";
  const slug = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  if (!slug) {
    return NextResponse.redirect(new URL("/", request.url), { headers: timing() });
  }

  return NextResponse.redirect(new URL(`/anime/${slug}`, request.url), { headers: timing() });
}

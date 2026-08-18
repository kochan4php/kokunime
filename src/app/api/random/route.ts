import { getAnimePerPage } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const randomPage = Math.floor(Math.random() * 5) + 1;
  const { anime = [] } = await getAnimePerPage(randomPage);

  if (anime.length === 0) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const randomItem = anime[Math.floor(Math.random() * anime.length)];
  const endpoint = randomItem?.link?.endpoint || "";
  const slug = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  if (!slug) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(new URL(`/anime/${slug}`, request.url));
}

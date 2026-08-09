import { getAnimeBySeasons } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: any) {
  const { season } = await params;
  const page = request.nextUrl.searchParams.get("page") ?? 1;
  const data = await getAnimeBySeasons(season, page);
  return NextResponse.json(data);
}

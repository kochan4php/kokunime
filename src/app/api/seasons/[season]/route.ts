import { getAnimeBySeasons } from "@/services/scraper";
import { respond } from "@/lib/api-handler";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: any) {
  const { season } = await params;
  const page = request.nextUrl.searchParams.get("page") ?? 1;
  return respond(request, () => getAnimeBySeasons(season, page));
}

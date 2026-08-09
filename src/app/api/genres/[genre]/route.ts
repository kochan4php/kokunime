import { getAnimeByGenres } from "@/services/scraper";
import { respond } from "@/lib/api-handler";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: any) {
  const { genre } = await params;
  const page = request.nextUrl.searchParams.get("page") ?? 1;
  return respond(request, () => getAnimeByGenres(genre, page));
}

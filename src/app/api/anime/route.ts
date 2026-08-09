import { getAnimePerPage } from "@/services/scraper";
import { respond } from "@/lib/api-handler";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page")) || 1;
  return respond(request, () => getAnimePerPage(page));
}

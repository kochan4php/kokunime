import { searchAnime } from "@/services/scraper";
import { respond } from "@/lib/api-handler";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  return respond(request, () => searchAnime(query));
}

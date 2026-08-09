import { searchAnime } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const data = await searchAnime(query);
  return NextResponse.json(data);
}

import { getAnimePerPage } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page")) || 1;
  const data = await getAnimePerPage(page);
  return NextResponse.json(data);
}

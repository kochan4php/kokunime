import { getAnimeDetail } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: any) {
  const { slug } = await params;
  const data = await getAnimeDetail(slug);
  return NextResponse.json(data);
}

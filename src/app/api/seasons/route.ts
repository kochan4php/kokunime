import { getSeasons } from "@/services/scraper";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSeasons();
  return NextResponse.json(data);
}

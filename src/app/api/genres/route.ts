import { getGenres } from "@/services/scraper";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getGenres();
  return NextResponse.json(data);
}

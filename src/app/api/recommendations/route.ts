import { getRecommendations } from "@/services/scraper";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getRecommendations();
  return NextResponse.json(data);
}

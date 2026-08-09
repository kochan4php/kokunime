import { getRecommendations } from "@/services/scraper";
import { respond } from "@/lib/api-handler";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return respond(request, () => getRecommendations());
}

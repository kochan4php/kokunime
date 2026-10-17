import { getTrending } from "@/lib/trending";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Top viewed titles over the last few days, hydrated from the local index.
// Empty list = no Redis / no views yet; the home rail hides itself.
export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  const items = await getTrending(12);
  const payload = { total: items.length, items };
  const etag = generateEtag(JSON.stringify(payload));
  const headers = {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    ETag: etag,
    "Server-Timing": `app;dur=${performance.now().toFixed(1)}`,
  };
  if (checkEtagMatch(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return NextResponse.json(payload, { headers });
}

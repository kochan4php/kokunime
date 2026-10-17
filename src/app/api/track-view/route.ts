import { recordTrendingView } from "@/lib/trending";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// sent via navigator.sendBeacon from the detail page after ~2s of reading.
// Best-effort: without Redis it is a silent no-op.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for") || "view-client";
  const rate = await checkRateLimit(ip, 120, 60_000);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return NextResponse.json({ ok: false }, { status: 429, headers: rateHeaders });
  }

  let slug = "";
  try {
    const body = (await request.json()) as { slug?: unknown };
    if (typeof body.slug === "string") slug = body.slug.trim().toLowerCase();
  } catch {
    // Malformed beacon — rejected below.
  }

  if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(slug)) {
    return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
  }

  await recordTrendingView(slug);
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store", ...rateHeaders } });
}

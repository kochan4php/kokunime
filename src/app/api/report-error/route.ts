import { reportError } from "@/lib/error-reporter";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;

// Client-side error boundary reports land here. Rate-limited so the endpoint
// can never be used as an open relay into the Discord webhook.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "report-client";
  const rate = await checkRateLimit(`report-error:${ip}`, 10, 60_000);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return NextResponse.json({ ok: false }, { status: 429, headers: rateHeaders });
  }

  try {
    const text = (await request.text()).slice(0, MAX_BODY_BYTES);
    const body = JSON.parse(text) as { message?: unknown; digest?: unknown; path?: unknown; route?: unknown };
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
    }

    await reportError({
      source: "client",
      message,
      digest: typeof body.digest === "string" ? body.digest : undefined,
      path: typeof body.path === "string" ? body.path : undefined,
      route: typeof body.route === "string" ? body.route : undefined,
    });

    return NextResponse.json({ ok: true }, { headers: rateHeaders });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
  }
}

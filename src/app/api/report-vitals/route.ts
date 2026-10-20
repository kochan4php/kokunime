import { RATE_LIMIT_WINDOW_MS, RATE_LIMITS } from "@/config/constants";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { logJson } from "@/lib/logger";
import { getRequestId } from "@/lib/request-id";
import { parseVitalsPayload } from "@/lib/vitals-payload";
import { reportVitals } from "@/lib/vitals-reporter";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2 * 1024;

// Client RUM samples land here (useReportWebVitals). Rate-limited so the
// endpoint can never be used as an open relay into the Discord webhook.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "vitals-client";
  const rate = await checkRateLimit(`report-vitals:${ip}`, RATE_LIMITS.reportVitals, RATE_LIMIT_WINDOW_MS);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return NextResponse.json({ ok: false }, { status: 429, headers: rateHeaders });
  }

  // Runtime flag: sample collection can be switched off without a redeploy.
  if (!(await isFeatureEnabled("report-vitals"))) {
    return new NextResponse(null, { status: 204, headers: rateHeaders });
  }

  try {
    const text = (await request.text()).slice(0, MAX_BODY_BYTES);
    const payload = parseVitalsPayload(JSON.parse(text));
    if (!payload) {
      return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
    }

    const alerted = await reportVitals(payload);
    if (alerted) {
      logJson("warn", "slow_web_vital", {
        name: payload.name,
        value: payload.value,
        path: payload.path,
        requestId: getRequestId(request),
      });
    }

    return NextResponse.json({ ok: true }, { headers: rateHeaders });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
  }
}

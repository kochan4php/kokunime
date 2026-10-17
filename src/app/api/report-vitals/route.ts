import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { logJson } from "@/lib/logger";
import { getRequestId } from "@/lib/request-id";
import { reportVitals, VITALS_THRESHOLDS, type VitalName } from "@/lib/vitals-reporter";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2 * 1024;
const MAX_VALUE = 60_000;
const VALID_NAMES = new Set<string>(Object.keys(VITALS_THRESHOLDS));

// Client RUM samples land here (useReportWebVitals). Rate-limited so the
// endpoint can never be used as an open relay into the Discord webhook.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "vitals-client";
  const rate = await checkRateLimit(`report-vitals:${ip}`, 30, 60_000);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return NextResponse.json({ ok: false }, { status: 429, headers: rateHeaders });
  }

  try {
    const text = (await request.text()).slice(0, MAX_BODY_BYTES);
    const body = JSON.parse(text) as { name?: unknown; value?: unknown; path?: unknown; deviceType?: unknown };

    const name = typeof body.name === "string" && VALID_NAMES.has(body.name) ? (body.name as VitalName) : null;
    const value =
      typeof body.value === "number" && Number.isFinite(body.value) && body.value >= 0 && body.value <= MAX_VALUE
        ? body.value
        : null;
    const path = typeof body.path === "string" && body.path.startsWith("/") ? body.path.slice(0, 200) : null;

    if (!name || value === null || !path) {
      return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
    }

    const deviceType = typeof body.deviceType === "string" ? body.deviceType.slice(0, 20) : undefined;
    const alerted = await reportVitals({ name, value, path, deviceType });
    if (alerted) {
      logJson("warn", "slow_web_vital", { name, value, path, requestId: getRequestId(request) });
    }

    return NextResponse.json({ ok: true }, { headers: rateHeaders });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
  }
}

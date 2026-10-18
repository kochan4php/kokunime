import { reportError } from "@/lib/error-reporter";
import { logJson } from "@/lib/logger";
import { incrementMetric } from "@/lib/metrics";
import { RATE_LIMIT_WINDOW_MS, RATE_LIMITS } from "@/config/constants";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;

// CSP report-uri posts (application/csp-report) and Reporting API batches
// (application/reports+json). Enforce-nothing: count + log only. Browsers
// expect 204 for reports, and a flood must be silently dropped, never 4xx/5xx.
const handleCspReport = async (request: NextRequest, ip: string): Promise<NextResponse> => {
  const rate = await checkRateLimit(`csp:${ip}`, RATE_LIMITS.cspReport, RATE_LIMIT_WINDOW_MS);
  if (!rate.success) return new NextResponse(null, { status: 204 });

  try {
    const body = JSON.parse((await request.text()).slice(0, MAX_BODY_BYTES)) as {
      "csp-report"?: Record<string, unknown>;
    };
    const report = body["csp-report"];
    incrementMetric("csp_violation");
    logJson("warn", "csp_violation", {
      directive: report?.["violated-directive"],
      blocked: report?.["blocked-uri"],
      document: report?.["document-uri"],
    });
  } catch {
    // Malformed report: still 204 so the browser never retries/errors.
  }
  return new NextResponse(null, { status: 204 });
};

// Client-side error boundary reports land here. Rate-limited so the endpoint
// can never be used as an open relay into the Discord webhook.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "report-client";

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("csp-report") || contentType.includes("reports+json")) {
    return handleCspReport(request, ip);
  }

  const rate = await checkRateLimit(`report-error:${ip}`, RATE_LIMITS.reportError, RATE_LIMIT_WINDOW_MS);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return NextResponse.json({ ok: false }, { status: 429, headers: rateHeaders });
  }

  try {
    const text = (await request.text()).slice(0, MAX_BODY_BYTES);
    const body = JSON.parse(text) as {
      message?: unknown;
      digest?: unknown;
      path?: unknown;
      route?: unknown;
      context?: unknown;
    };
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
    }
    const context = typeof body.context === "string" ? body.context.trim() : "";
    // Short, human-friendly id: the error card shows it so a visitor can quote
    // it, and the same id goes to the log/webhook.
    const reportId = crypto.randomUUID().slice(0, 8);

    // Sampling (ERROR_REPORT_SAMPLE=0..1, default 1): drop a fraction of client
    // reports to keep the webhook quiet under error storms. Clients still get
    // ok so they stop retrying.
    const sample = Number(process.env.ERROR_REPORT_SAMPLE ?? "1");
    if (Number.isFinite(sample) && sample >= 0 && sample < 1 && Math.random() >= sample) {
      return NextResponse.json({ ok: true, sampled: true }, { headers: rateHeaders });
    }

    logJson("warn", "client_error", {
      id: reportId,
      message,
      digest: typeof body.digest === "string" ? body.digest : undefined,
      path: typeof body.path === "string" ? body.path : undefined,
    });

    await reportError({
      source: "client",
      message,
      digest: typeof body.digest === "string" ? body.digest : undefined,
      path: typeof body.path === "string" ? body.path : undefined,
      route: typeof body.route === "string" ? body.route : undefined,
      context: context ? `${context}\nid=${reportId}` : `id=${reportId}`,
    });

    return NextResponse.json({ ok: true, id: reportId }, { headers: rateHeaders });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400, headers: rateHeaders });
  }
}

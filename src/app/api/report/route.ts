import { RATE_LIMIT_WINDOW_MS, RATE_LIMITS } from "@/config/constants";
import { problemResponse } from "@/lib/api-error";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { createReport, validateReportInput } from "@/lib/reports";
import { getRequestId } from "@/lib/request-id";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4 * 1024;

// Public broken-link/data report intake. Deliberately accepts structured
// fields, never a free-form URL. Redis owns the durable queue; without it the
// endpoint answers 503 instead of pretending a report was saved.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "report-broken";
  const rate = await checkRateLimit(`report-broken:${ip}`, RATE_LIMITS.reportBroken, RATE_LIMIT_WINDOW_MS);
  const rateHeaders = getRateLimitHeaders(rate);

  if (!rate.success) {
    return problemResponse({
      status: 429,
      title: "Too Many Requests",
      detail: "Terlalu banyak laporan. Coba lagi sebentar lagi.",
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }

  let body: unknown;
  try {
    body = JSON.parse((await request.text()).slice(0, MAX_BODY_BYTES));
  } catch {
    return problemResponse({
      status: 400,
      title: "Bad Request",
      detail: "Format laporan tidak valid.",
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }

  const honey = body && typeof body === "object" ? (body as Record<string, unknown>).website : undefined;
  if (typeof honey === "string" && honey.trim()) {
    // Bot trap: answer without writing anything, so the submission is wasted.
    return new NextResponse(null, { status: 204 });
  }

  const input = validateReportInput(body);
  if (!input) {
    return problemResponse({
      status: 400,
      title: "Bad Request",
      detail: "Pilih jenis laporan yang valid dan hindari tautan di catatan.",
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }

  const report = await createReport(input);
  if (!report) {
    return problemResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Antrean laporan sedang tidak tersedia. Coba lagi nanti.",
      requestId: getRequestId(request),
      headers: rateHeaders,
    });
  }

  return NextResponse.json({ ok: true, id: report.id }, { status: 201, headers: rateHeaders });
}

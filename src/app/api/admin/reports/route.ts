import { denyAdmin } from "@/lib/admin-guard";
import { problemResponse } from "@/lib/api-error";
import { getRequestId } from "@/lib/request-id";
import { listReports, resolveReport } from "@/lib/reports";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REPORT_ID = /^[0-9a-f-]{8,40}$/i;

// Admin report queue. The available flag is explicit when Redis is absent so
// the console can show an outage instead of an empty, misleading queue.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  const reports = await listReports();
  if (reports === null) {
    return NextResponse.json({ ok: true, available: false, reports: [] });
  }
  return NextResponse.json({ ok: true, available: true, reports });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  let body: { id?: unknown } = {};
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    // Validator below returns the 400.
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!REPORT_ID.test(id)) {
    return problemResponse({
      status: 400,
      title: "Bad Request",
      detail: "Body must include a valid report id",
      requestId: getRequestId(request),
    });
  }

  const result = await resolveReport(id);
  if (!result.ok) {
    if (result.reason === "unavailable") {
      return problemResponse({
        status: 503,
        title: "Service Unavailable",
        detail: "Report queue is unavailable",
        requestId: getRequestId(request),
      });
    }
    return problemResponse({
      status: 404,
      title: "Not Found",
      detail: "Report not found",
      requestId: getRequestId(request),
    });
  }

  return NextResponse.json({ ok: true, report: result.report });
}

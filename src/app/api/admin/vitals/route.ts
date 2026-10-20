import { denyAdmin } from "@/lib/admin-guard";
import { getVitalsSummary } from "@/lib/vitals-reporter";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// p50/p75/p95 per (metric, path) from the in-process ring buffers filled by
// /api/report-vitals. Same token gate as the other admin endpoints.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  return NextResponse.json({ rows: getVitalsSummary() });
}

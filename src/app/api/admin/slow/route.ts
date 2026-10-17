import { denyAdmin } from "@/lib/admin-guard";
import { getSlowRequests, SLOW_REQUEST_MS } from "@/lib/slow-log";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Slow-request ring buffer (last 100 requests over SLOW_REQUEST_MS), same auth
// as the other admin endpoints: Bearer ADMIN_TOKEN or METRICS_TOKEN.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  const entries = getSlowRequests();
  return NextResponse.json(
    { threshold_ms: SLOW_REQUEST_MS, count: entries.length, entries },
    { headers: { "Cache-Control": "no-store" } },
  );
}

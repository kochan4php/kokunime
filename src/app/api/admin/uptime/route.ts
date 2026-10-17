import { denyAdmin } from "@/lib/admin-guard";
import { getErrorBudget, getUptimeRollup } from "@/lib/uptime";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 14-day uptime rollup + SLO 99.5% error budget. Same auth as the other admin
// endpoints: Bearer ADMIN_TOKEN or METRICS_TOKEN.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  const rollup = await getUptimeRollup(14);
  return NextResponse.json(
    { days: rollup, error_budget: getErrorBudget(rollup) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

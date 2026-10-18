import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Liveness: is the process serving? Deliberately independent of the upstream
// so docker healthchecks and deploy gates don't flap during upstream outages
// (cached/stale pages keep serving; upstream health is monitored separately).
export async function GET(): Promise<NextResponse> {
  const started = performance.now();
  return NextResponse.json(
    {
      status: "ok",
      uptime_s: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
      },
    },
  );
}

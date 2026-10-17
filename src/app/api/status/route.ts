import { UPSTREAM_CIRCUIT_KEY } from "@/config/upstream";
import { getCircuitState } from "@/lib/circuit-breaker";
import { getEventLoopLagMs, getMetrics } from "@/lib/metrics";
import { redisHealth } from "@/lib/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Public, auth-free status snapshot for dashboards/uptime robots: no internal
// counters, just "is the app healthy and how loaded is it".
export async function GET(): Promise<NextResponse> {
  const started = performance.now();
  const [redis, loopLag] = await Promise.all([redisHealth(), Promise.resolve(getEventLoopLagMs())]);
  const circuit = getCircuitState(UPSTREAM_CIRCUIT_KEY);
  const events = getMetrics();
  const errors = Object.entries(events)
    .filter(([key]) => key.includes("error"))
    .reduce((sum, [, value]) => sum + value, 0);

  const degraded = circuit === "open" || redis === "error" || loopLag === null || loopLag.mean > 500;

  const payload = {
    status: degraded ? "degraded" : "ok",
    uptime_seconds: Math.round(process.uptime()),
    memory: {
      rss_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
    event_loop_lag_ms: loopLag ? { mean: Number(loopLag.mean.toFixed(2)), p99: Number(loopLag.p99.toFixed(2)) } : null,
    ...(errors > 0 ? { recorded_errors: errors } : {}),
    upstream: {
      circuit,
    },
    redis,
  };

  return NextResponse.json(payload, {
    status: degraded ? 503 : 200,
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    },
  });
}

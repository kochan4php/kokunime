import { UPSTREAM_CIRCUIT_KEY } from "@/config/upstream";
import { getCircuitState } from "@/lib/circuit-breaker";
import { getEventLoopLagMs, getMetrics } from "@/lib/metrics";
import { redisHealth } from "@/lib/redis";
import { getUptimeRollup, recordUptimeProbe } from "@/lib/uptime";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Build metadata when the host provides it (Netlify COMMIT_REF, Vercel
// VERCEL_GIT_COMMIT_SHA, plain CI GITHUB_SHA).
const COMMIT = (process.env.COMMIT_REF ?? process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "").slice(
  0,
  7,
);

// Public, auth-free status snapshot for dashboards/uptime robots: no internal
// counters, just "is the app healthy and how loaded is it". v2 adds the
// version block, a dependency table and the daily uptime rollup.
export async function GET(): Promise<NextResponse> {
  const started = performance.now();
  const [redis, loopLag] = await Promise.all([redisHealth(), Promise.resolve(getEventLoopLagMs())]);
  const circuit = getCircuitState(UPSTREAM_CIRCUIT_KEY);
  const events = getMetrics();
  const errors = Object.entries(events)
    .filter(([key]) => key.includes("error"))
    .reduce((sum, [, value]) => sum + value, 0);

  const degraded = circuit === "open" || redis === "error" || loopLag === null || loopLag.mean > 500;

  // Every probe feeds the daily uptime rollup (best-effort: Redis-off is a
  // no-op). The rollup powers /api/admin/uptime + the uptime badge.
  void recordUptimeProbe(!degraded);
  const [today] = await getUptimeRollup(1);

  const dependencies = [
    { name: "process", status: "ok" },
    { name: "upstream", status: circuit === "open" ? "down" : circuit === "half-open" ? "degraded" : "ok" },
    { name: "redis", status: redis === "error" ? "down" : redis === "disabled" ? "disabled" : "ok" },
    {
      name: "event_loop",
      status: loopLag === null ? "down" : loopLag.mean > 500 ? "down" : loopLag.mean > 200 ? "degraded" : "ok",
    },
  ];

  const payload = {
    status: degraded ? "degraded" : "ok",
    version: { commit: COMMIT || null },
    uptime_seconds: Math.round(process.uptime()),
    memory: {
      rss_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
    event_loop_lag_ms: loopLag ? { mean: Number(loopLag.mean.toFixed(2)), p99: Number(loopLag.p99.toFixed(2)) } : null,
    dependencies,
    uptime_today: today ?? null,
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

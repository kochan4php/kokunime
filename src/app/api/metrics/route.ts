import { UPSTREAM_CIRCUIT_KEY } from "@/config/upstream";
import { getCircuitState } from "@/lib/circuit-breaker";
import { getMetrics } from "@/lib/metrics";
import { redisHealth } from "@/lib/redis";
import { safeCompare } from "@/lib/safe-compare";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const CIRCUIT_VALUE = { closed: 0, "half-open": 1, open: 2 } as const;

// Prometheus text format, hand-rolled (no client library). Disabled unless
// METRICS_TOKEN is set — scraping requires `Authorization: Bearer <token>`.
export async function GET(request: NextRequest): Promise<Response> {
  const token = process.env.METRICS_TOKEN?.trim();
  if (!token) return new Response("Not Found", { status: 404 });

  const provided =
    request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "")
      .trim() ?? "";
  if (!safeCompare(provided, token)) {
    return new Response("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  }

  const counters = getMetrics();
  const redis = await redisHealth();
  const circuit = getCircuitState(UPSTREAM_CIRCUIT_KEY);
  const mem = process.memoryUsage();

  const lines: string[] = [
    "# HELP kokunime_events_total Process-local event counters (one series per key).",
    "# TYPE kokunime_events_total counter",
    ...Object.entries(counters).map(([event, value]) => `kokunime_events_total{event="${event}"} ${value}`),
    "# HELP kokunime_uptime_seconds Process uptime.",
    "# TYPE kokunime_uptime_seconds gauge",
    `kokunime_uptime_seconds ${process.uptime().toFixed(1)}`,
    "# HELP kokunime_memory_rss_bytes Resident set size.",
    "# TYPE kokunime_memory_rss_bytes gauge",
    `kokunime_memory_rss_bytes ${mem.rss}`,
    "# HELP kokunime_redis_up 1 unless REDIS_URL is set and unreachable (disabled counts as up).",
    "# TYPE kokunime_redis_up gauge",
    `kokunime_redis_up ${redis === "error" ? 0 : 1}`,
    "# HELP kokunime_upstream_circuit_state Upstream breaker state (0=closed, 1=half-open, 2=open).",
    "# TYPE kokunime_upstream_circuit_state gauge",
    `kokunime_upstream_circuit_state ${CIRCUIT_VALUE[circuit]}`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

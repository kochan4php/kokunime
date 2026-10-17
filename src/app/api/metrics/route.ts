import { UPSTREAM_CIRCUIT_KEY } from "@/config/upstream";
import { denyAdmin } from "@/lib/admin-guard";
import { getCircuitState } from "@/lib/circuit-breaker";
import { HISTOGRAM_BUCKETS, getEventLoopLagMs, getHistogramQuantile, getHistograms, getMetrics } from "@/lib/metrics";
import { redisHealth } from "@/lib/redis";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const CIRCUIT_VALUE = { closed: 0, "half-open": 1, open: 2 } as const;

// Prometheus text format, hand-rolled (no client library). Disabled unless
// METRICS_TOKEN is set — scraping requires `Authorization: Bearer <token>`.
export async function GET(request: NextRequest): Promise<Response> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  const counters = getMetrics();
  const histograms = getHistograms();
  const redis = await redisHealth();
  const circuit = getCircuitState(UPSTREAM_CIRCUIT_KEY);
  const mem = process.memoryUsage();
  const loopLag = getEventLoopLagMs();

  const histogramLines: string[] = [];
  for (const [metric, state] of Object.entries(histograms)) {
    HISTOGRAM_BUCKETS.forEach((bound, index) => {
      histogramLines.push(
        `kokunime_histogram_milliseconds_bucket{metric="${metric}",le="${bound}"} ${state.bucketCounts[index]}`,
      );
    });
    histogramLines.push(
      `kokunime_histogram_milliseconds_bucket{metric="${metric}",le="+Inf"} ${state.bucketCounts[HISTOGRAM_BUCKETS.length]}`,
      `kokunime_histogram_milliseconds_sum{metric="${metric}"} ${state.sum}`,
      `kokunime_histogram_milliseconds_count{metric="${metric}"} ${state.count}`,
    );
  }

  const quantileLines: string[] = [];
  for (const [metric, state] of Object.entries(histograms)) {
    if (state.count === 0) continue;
    const p50 = getHistogramQuantile(state, 0.5);
    const p95 = getHistogramQuantile(state, 0.95);
    quantileLines.push(
      `kokunime_histogram_p50_milliseconds{metric="${metric}"} ${Number.isFinite(p50) ? p50 : "+Inf"}`,
      `kokunime_histogram_p95_milliseconds{metric="${metric}"} ${Number.isFinite(p95) ? p95 : "+Inf"}`,
    );
  }

  const lines: string[] = [
    "# HELP kokunime_events_total Process-local event counters (one series per key).",
    "# TYPE kokunime_events_total counter",
    ...Object.entries(counters).map(([event, value]) => `kokunime_events_total{event="${event}"} ${value}`),
    "# HELP kokunime_histogram_milliseconds Process-local latency histograms in milliseconds.",
    "# TYPE kokunime_histogram_milliseconds histogram",
    ...histogramLines,
    "# HELP kokunime_histogram_quantiles_milliseconds Bucket-approximated p50/p95 per histogram.",
    "# TYPE kokunime_histogram_quantiles_milliseconds gauge",
    ...quantileLines,
    "# HELP kokunime_uptime_seconds Process uptime.",
    "# TYPE kokunime_uptime_seconds gauge",
    `kokunime_uptime_seconds ${process.uptime().toFixed(1)}`,
    "# HELP kokunime_memory_rss_bytes Resident set size.",
    "# TYPE kokunime_memory_rss_bytes gauge",
    `kokunime_memory_rss_bytes ${mem.rss}`,
    ...(loopLag
      ? [
          "# HELP kokunime_eventloop_lag_ms Event-loop delay (CPU saturation signal).",
          "# TYPE kokunime_eventloop_lag_ms gauge",
          `kokunime_eventloop_lag_ms{quantile="mean"} ${loopLag.mean.toFixed(2)}`,
          `kokunime_eventloop_lag_ms{quantile="p99"} ${loopLag.p99.toFixed(2)}`,
        ]
      : []),
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

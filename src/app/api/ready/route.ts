import { UPSTREAM_CIRCUIT_KEY } from "@/config/upstream";
import { getCircuitState } from "@/lib/circuit-breaker";
import { isShuttingDown } from "@/lib/lifecycle";
import { redisHealth } from "@/lib/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Readiness: can this instance fetch fresh data? Stale-cache serving still
// works while the breaker is half-open/recovering, so only a hard-open
// circuit makes the instance "not ready" for fresh writes. A shutting-down
// instance is never ready — that is how load balancers drain it.
export async function GET(): Promise<NextResponse> {
  const started = performance.now();
  const circuit = getCircuitState(UPSTREAM_CIRCUIT_KEY);
  const redis = await redisHealth();
  const shuttingDown = isShuttingDown();
  const ready = circuit !== "open" && !shuttingDown;

  return NextResponse.json(
    {
      status: ready ? "ready" : "degraded",
      circuit,
      redis,
      shuttingDown,
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
        "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
      },
    },
  );
}

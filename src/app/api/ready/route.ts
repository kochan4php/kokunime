import { UPSTREAM_CIRCUIT_KEY } from "@/config/upstream";
import { getCircuitState } from "@/lib/circuit-breaker";
import { redisHealth } from "@/lib/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Readiness: can this instance fetch fresh data? Stale-cache serving still
// works while the breaker is half-open/recovering, so only a hard-open
// circuit makes the instance "not ready" for fresh writes.
export async function GET(): Promise<NextResponse> {
  const circuit = getCircuitState(UPSTREAM_CIRCUIT_KEY);
  const redis = await redisHealth();
  const ready = circuit !== "open";

  return NextResponse.json(
    {
      status: ready ? "ready" : "degraded",
      circuit,
      redis,
      timestamp: new Date().toISOString(),
    },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}

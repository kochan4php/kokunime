import kusonime from "@/config/kusonime";
import { UPSTREAM_URL } from "@/services/scraper/constants";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const start = performance.now();
  const mem = typeof process !== "undefined" && process.memoryUsage ? process.memoryUsage() : null;
  const memoryMb = mem
    ? {
        heap_used_mb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
        heap_total_mb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
        rss_mb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      }
    : undefined;

  try {
    const res = await kusonime.get("/");
    const latency = Math.round(performance.now() - start);

    return NextResponse.json({
      status: "ok",
      scraper: "operational",
      upstream: UPSTREAM_URL,
      upstream_status: res.status ?? 200,
      latency_ms: latency,
      memory: memoryMb,
      environment: process.env.NODE_ENV || "production",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const latency = Math.round(performance.now() - start);
    return NextResponse.json(
      {
        status: "degraded",
        scraper: "unreachable",
        upstream: UPSTREAM_URL,
        error: err instanceof Error ? err.message : "Upstream error",
        latency_ms: latency,
        memory: memoryMb,
        environment: process.env.NODE_ENV || "production",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

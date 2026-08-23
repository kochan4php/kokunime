import upstream from "@/config/upstream";
import { UPSTREAM_URL } from "@/services/scraper/constants";
import { load } from "cheerio";
import type { AxiosError } from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Diagnostics: reports what kusonime actually serves THIS runtime (no cache
// involved), so scrape failures can be told apart from cache poisoning.
async function probe(path: string): Promise<Record<string, unknown>> {
  const started = performance.now();
  try {
    const res = await upstream.get<string>(path);
    const html = typeof res.data === "string" ? res.data : "";
    const $ = load(html);
    return {
      path,
      status: res.status,
      bytes: html.length,
      latency_ms: Math.round(performance.now() - started),
      kover_count: $(".kover").length,
      first_title: cleanFirstTitle($) || null,
      looks_like_challenge:
        /just a moment|cf-challenge|attention required|cf-browser-verification|enable javascript and cookies/i.test(
          html,
        ),
      cf_mitigated: (res.headers["cf-mitigated"] as string | undefined) ?? null,
      server: (res.headers.server as string | undefined) ?? null,
    };
  } catch (err) {
    const axErr = err as AxiosError;
    const body = typeof axErr.response?.data === "string" ? axErr.response.data : "";
    return {
      path,
      latency_ms: Math.round(performance.now() - started),
      error: err instanceof Error ? err.message : "Unknown error",
      code: (err as { code?: string }).code ?? null,
      status: axErr.response?.status ?? null,
      response_bytes: body.length,
      looks_like_challenge:
        /just a moment|cf-challenge|attention required|cf-browser-verification|enable javascript and cookies/i.test(
          body,
        ),
      cf_mitigated: (axErr.response?.headers["cf-mitigated"] as string | undefined) ?? null,
    };
  }
}

function cleanFirstTitle($: ReturnType<typeof load>): string {
  return $(".kover .content h2 > a").first().text().trim() || $(".kover .content h2").first().text().trim();
}

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
    const res = await upstream.get("/");
    const latency = Math.round(performance.now() - start);

    return NextResponse.json({
      status: "ok",
      scraper: "operational",
      upstream: UPSTREAM_URL,
      upstream_status: res.status ?? 200,
      latency_ms: latency,
      probes: [await probe("/page/2/")],
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
        probes: [await probe("/page/2/")],
        memory: memoryMb,
        environment: process.env.NODE_ENV || "production",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

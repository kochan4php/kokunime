import { redisHealth } from "@/lib/redis";
import { getUptimeRollup } from "@/lib/uptime";

export const dynamic = "force-dynamic";

const LABEL_WIDTH = 92;
const MESSAGE_WIDTH = 96;

const renderBadge = (message: string, color: string): string => `<svg xmlns="http://www.w3.org/2000/svg" width="${
  LABEL_WIDTH + MESSAGE_WIDTH
}" height="28" role="img" aria-label="kokunime: ${message}">
  <rect width="${LABEL_WIDTH}" height="28" fill="#333"/>
  <rect x="${LABEL_WIDTH}" width="${MESSAGE_WIDTH}" height="28" fill="${color}"/>
  <g fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11" text-anchor="middle">
    <text x="${LABEL_WIDTH / 2}" y="18">kokunime</text>
    <text x="${LABEL_WIDTH + MESSAGE_WIDTH / 2}" y="18">${message}</text>
  </g>
</svg>`;

// Self-hosted status badge (README embed):
//   /api/badge.svg                → app/Redis health (green "operational", red "degraded")
//   /api/badge.svg?metric=uptime  → today's uptime % against the 99.5% SLO
// Cached 60s at the edge.
export async function GET(request: Request): Promise<Response> {
  const metric = new URL(request.url).searchParams.get("metric") ?? "health";
  let message: string;
  let color: string;

  if (metric === "uptime") {
    const [today] = await getUptimeRollup(1);
    const pct = today?.uptime_pct ?? null;
    message = pct === null ? "no data" : `${pct}%`;
    color = pct === null ? "#6b7280" : pct >= 99.5 ? "#2f9e44" : pct >= 99 ? "#f08c00" : "#d9480f";
  } else {
    const health = await redisHealth().catch(() => "error" as const);
    const degraded = health === "error";
    message = degraded ? "degraded" : "operational";
    color = degraded ? "#d9480f" : "#2f9e44";
  }

  return new Response(renderBadge(message, color), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
    },
  });
}

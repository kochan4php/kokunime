import { checkRateLimit } from "@/lib/rate-limit";
import { safeCompare } from "@/lib/safe-compare";
import { NextResponse } from "next/server";

// Shared admin gate: timing-safe token compare + brute-force lockout + optional
// IP allowlist. Returns null when the request may proceed, otherwise the
// ready-to-return denial response.
//
// Env:
//   ADMIN_TOKEN / METRICS_TOKEN — bearer token; unset = 404 (endpoint hidden)
//   ADMIN_ALLOWLIST — comma-separated IPs; empty = allow every IP
//
// Lockout counts failures only: a valid token never consumes attempts, so
// normal ops cannot lock themselves out; 10 bad compares per IP per 5 minutes
// start answering 429 (Redis-shared when configured, per-instance otherwise).
const FAIL_LIMIT = 10;
const FAIL_WINDOW_MS = 5 * 60_000;

const clientIp = (request: Request): string =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

export const denyAdmin = async (request: Request): Promise<NextResponse | null> => {
  const token = (process.env.ADMIN_TOKEN ?? process.env.METRICS_TOKEN ?? "").trim();
  if (!token) return new NextResponse("Not Found", { status: 404 });

  const ip = clientIp(request);
  const allowlist = (process.env.ADMIN_ALLOWLIST ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (allowlist.length > 0 && !allowlist.includes(ip)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const provided =
    request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "")
      .trim() ?? "";

  if (safeCompare(provided, token)) return null;

  const failures = await checkRateLimit(`admin-auth:${ip}`, FAIL_LIMIT, FAIL_WINDOW_MS);
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(failures.limit),
    "X-RateLimit-Remaining": String(failures.remaining),
    "X-RateLimit-Reset": String(failures.reset),
  };
  if (!failures.success) {
    headers["Retry-After"] = String(Math.max(1, failures.reset - Math.floor(Date.now() / 1000)));
    return new NextResponse("Too Many Requests", { status: 429, headers });
  }
  return new NextResponse("Unauthorized", { status: 401, headers: { ...headers, "WWW-Authenticate": "Bearer" } });
};

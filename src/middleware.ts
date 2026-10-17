import { NextRequest, NextResponse } from "next/server";

// 5% of requests get one structured timing line. `ageMs` is the wall time
// since the request started (only meaningful when a proxy sets
// x-request-start, e.g. nginx `proxy_set_header X-Request-Start $msec*1000`);
// `middlewareMs` is this hop's own processing time.
const SAMPLE_RATE = 0.05;

// Every HTML/API request gets a correlation id: forwarded to route handlers
// (read them with getRequestId) and echoed back on the response.
export function middleware(request: NextRequest): NextResponse {
  const startedAt = Date.now();
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set("x-request-id", requestId);

  if (Math.random() < SAMPLE_RATE) {
    const proxyStart = Number(request.headers.get("x-request-start"));
    const ageMs = Number.isFinite(proxyStart) && proxyStart > 0 ? Math.round(startedAt - proxyStart) : undefined;
    console.log(
      JSON.stringify({
        level: "info",
        type: "request",
        requestId,
        method: request.method,
        path: request.nextUrl.pathname,
        ...(ageMs !== undefined ? { ageMs } : {}),
        middlewareMs: Date.now() - startedAt,
      }),
    );
  }

  const response = NextResponse.next({ request: { headers } });
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  // Skip Next internals and anything with a file extension (static assets,
  // sitemap.xml, feeds, service worker, icons).
  matcher: "/((?!_next/static|_next/image|.*\\..*).*)",
};

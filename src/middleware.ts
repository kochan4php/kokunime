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

  // Canonical slugs are lowercase; uppercase variants only arrive from old
  // links or typos — 308 to the canonical URL (query preserved).
  const { pathname } = request.nextUrl;
  if (pathname !== pathname.toLowerCase() && /^\/(anime|genres|seasons|years)\/[a-z0-9_-]+\/?$/i.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  // Reject impossible A–Z segments before the route streams a 200 shell and
  // only then discovers that it has nothing to render.
  const indexSegment = /^\/indeks\/([^/]+)\/?$/.exec(pathname)?.[1];
  if (indexSegment && !/^(?:[a-z]|lain)$/i.test(indexSegment)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const headers = new Headers(request.headers);
  headers.set("x-request-id", requestId);

  // Report-only CSP with a per-request nonce + strict-dynamic + Trusted Types.
  // Nothing is blocked (Report-Only): violations land in /api/report-error as
  // csp_violation, so a future enforcing pass is data-driven. Next reads the
  // nonce from the request header and stamps it onto its own scripts.
  // Flip to enforcing once the report-only violation stream is clean:
  // CSP_ENFORCE=1 moves the whole policy (Trusted Types included) out of
  // Report-Only.
  const enforceCsp = (process.env.CSP_ENFORCE ?? "").trim() === "1";
  const nonce = btoa(crypto.randomUUID());
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "require-trusted-types-for 'script'",
    "trusted-types default",
    "report-uri /api/report-error",
  ].join("; ");
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);

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
  response.headers.set(enforceCsp ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only", csp);
  return response;
}

export const config = {
  // Skip Next internals and anything with a file extension (static assets,
  // sitemap.xml, feeds, service worker, icons).
  matcher: "/((?!_next/static|_next/image|.*\\..*).*)",
};

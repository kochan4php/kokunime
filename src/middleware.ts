import { NextRequest, NextResponse } from "next/server";

// Every HTML/API request gets a correlation id: forwarded to route handlers
// (read them with getRequestId) and echoed back on the response.
export function middleware(request: NextRequest): NextResponse {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set("x-request-id", requestId);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  // Skip Next internals and anything with a file extension (static assets,
  // sitemap.xml, feeds, service worker, icons).
  matcher: "/((?!_next/static|_next/image|.*\\..*).*)",
};

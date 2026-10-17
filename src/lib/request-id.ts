import type { NextRequest } from "next/server";

// Correlation id attached by src/middleware.ts. "-" keeps log/payload shapes
// stable for callers that run outside the middleware matcher.
export const getRequestId = (request: NextRequest): string => request.headers.get("x-request-id") ?? "-";

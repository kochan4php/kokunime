import { NextRequest, NextResponse } from "next/server";

// Canonical docs live at /api (docs + live testers); /api/docs is the alias
// third-party integrations try first.
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.redirect(new URL("/api", request.url), 308);
}

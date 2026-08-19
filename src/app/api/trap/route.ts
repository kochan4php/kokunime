import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";

  return NextResponse.json(
    {
      error: "Access Denied: Malicious crawler caught in honeypot trap",
      ip,
      ua,
    },
    {
      status: 403,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}

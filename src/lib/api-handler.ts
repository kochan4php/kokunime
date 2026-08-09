import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export const respond = async (request: NextRequest, fn: () => Promise<unknown>): Promise<NextResponse> => {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    return NextResponse.json(await fn());
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Scraping failed" }, { status: 502 });
  }
};

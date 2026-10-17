import { denyAdmin } from "@/lib/admin-guard";
import { getFeatureFlags, setFeatureFlag } from "@/lib/feature-flags";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Runtime feature flags console API (same auth as the other admin endpoints).
export async function GET(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  return NextResponse.json({ flags: await getFeatureFlags() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const { key, enabled } = (body ?? {}) as { key?: unknown; enabled?: unknown };
  if (typeof key !== "string" || typeof enabled !== "boolean") {
    return NextResponse.json(
      { error: "key (string) dan enabled (boolean) wajib diisi" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const updated = await setFeatureFlag(key, enabled);
  if (!updated) {
    return NextResponse.json(
      { error: "unknown-flag", flags: await getFeatureFlags() },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { flag: updated, flags: await getFeatureFlags() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

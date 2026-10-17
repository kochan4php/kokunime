import { sanitizeRevalidatePaths } from "@/lib/admin-revalidate";
import { logJson } from "@/lib/logger";
import { publishCacheInvalidate } from "@/lib/redis";
import { safeCompare } from "@/lib/safe-compare";
import { SITE_URL } from "@/lib/site";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Token-gated ISR invalidation for deploy hooks and manual ops (e.g. after a
// hotfix to a cached page). Disabled (404) unless ADMIN_TOKEN — or
// METRICS_TOKEN as fallback — is configured. Body: {"paths": ["/", "/anime/x"]}.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = (process.env.ADMIN_TOKEN || process.env.METRICS_TOKEN || "").trim();
  if (!token) return new NextResponse("Not Found", { status: 404 });

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!safeCompare(provided.trim(), token)) {
    return new NextResponse("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  }

  let body: { paths?: unknown } = {};
  try {
    body = (await request.json()) as { paths?: unknown };
  } catch {
    // Falls through to the validator's 400 below.
  }

  const paths = sanitizeRevalidatePaths(body.paths);
  if (!paths) {
    return NextResponse.json({ ok: false, error: "paths must be 1-20 relative site paths" }, { status: 400 });
  }

  for (const path of paths) revalidatePath(path);
  // Next's data cache is per-instance in this deployment: a flush broadcast
  // makes every sibling drop its memory/stale tiers too.
  await publishCacheInvalidate();
  logJson("info", "admin_revalidate", { paths });

  // Best-effort warm-up so the next visitor does not pay the regeneration cost.
  const warm = await Promise.allSettled(
    paths.map(async (path) => {
      const response = await fetch(`${SITE_URL}${path}`, { signal: AbortSignal.timeout(10_000) });
      return response.status;
    }),
  );

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    warm: paths.map((path, index) => {
      const settled = warm[index];
      return {
        path,
        status: settled && settled.status === "fulfilled" ? settled.value : 0,
      };
    }),
  });
}

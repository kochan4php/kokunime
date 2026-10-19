import { denyAdmin } from "@/lib/admin-guard";
import { problemResponse } from "@/lib/api-error";
import { checkAnimeLinkHealth, getAnimeLinkHealth, saveAnimeLinkHealth } from "@/lib/link-health";
import { getRequestId } from "@/lib/request-id";
import type { LinkHealthSnapshot } from "@/interfaces";
import { getAnimeDetail } from "@/services/scraper";
import { isSafeSlug } from "@/utils/endpoint-slug";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_CHECK_LINKS = 30;

const parseSlug = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const slug = value.trim().toLowerCase();
  return isSafeSlug(slug) ? slug : null;
};

const summarize = (snapshot: LinkHealthSnapshot): Record<string, number> => {
  const counts: Record<string, number> = { ok: 0, dead: 0, blocked: 0, timeout: 0, error: 0, unverifiable: 0 };
  for (const record of Object.values(snapshot.records)) {
    counts[record.state] = (counts[record.state] ?? 0) + 1;
  }
  return counts;
};

// Cached snapshot only. The page render path uses the same helper, so this
// endpoint is useful for ops dashboards and cron checks without scraping.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  const slug = parseSlug(request.nextUrl.searchParams.get("slug"));
  if (!slug) {
    return problemResponse({
      status: 400,
      title: "Bad Request",
      detail: "Provide ?slug=anime-slug",
      requestId: getRequestId(request),
    });
  }

  const snapshot = await getAnimeLinkHealth(slug);
  return NextResponse.json({ ok: true, slug, snapshot, counts: snapshot ? summarize(snapshot) : null });
}

// Live check: fetch the detail payload, probe a bounded number of unique
// mirrors, persist the snapshot, and return the counts. Bounded on purpose:
// one admin click must not become an unbounded outbound request fan-out.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const denied = await denyAdmin(request);
  if (denied) return denied;

  let body: { slug?: unknown; max?: unknown } = {};
  try {
    body = (await request.json()) as { slug?: unknown; max?: unknown };
  } catch {
    // Validator below returns the 400.
  }

  const slug = parseSlug(body.slug);
  if (!slug) {
    return problemResponse({
      status: 400,
      title: "Bad Request",
      detail: "Body must include a valid anime slug",
      requestId: getRequestId(request),
    });
  }

  const requestedMax = Number(body.max);
  const max = Number.isFinite(requestedMax) ? Math.max(1, Math.min(MAX_CHECK_LINKS, Math.floor(requestedMax))) : 20;

  try {
    const anime = await getAnimeDetail(slug);
    if (!anime?.title) {
      return problemResponse({
        status: 404,
        title: "Not Found",
        detail: "Anime not found in the current catalog",
        requestId: getRequestId(request),
      });
    }

    const snapshot = await checkAnimeLinkHealth(anime, max);
    await saveAnimeLinkHealth(slug, snapshot);
    return NextResponse.json({ ok: true, slug, snapshot, counts: summarize(snapshot) });
  } catch {
    return problemResponse({
      status: 502,
      title: "Bad Gateway",
      detail: "Could not fetch or check the anime right now",
      requestId: getRequestId(request),
    });
  }
}

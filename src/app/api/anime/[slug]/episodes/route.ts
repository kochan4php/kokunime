import { getAnimeDetailWithMeta } from "@/services/scraper";
import { parseEpisodeRange } from "@/services/scraper/sanitize";
import { xCacheHeaders } from "@/services/cache";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { getRequestId } from "@/lib/request-id";
import { normalizeSlug } from "@/utils/endpoint-slug";
import { NextRequest, NextResponse } from "next/server";

interface EpisodeMirror {
  resolution: string;
  height?: number;
  platform: string;
  url?: string;
  is_torrent?: boolean;
}

interface EpisodeGroup {
  episode: number | null;
  label: string;
  is_batch: boolean;
  mirrors: EpisodeMirror[];
}

// Structured episode list: flattens the download groups into per-episode
// mirror lists so bots/apps do not have to parse titles themselves.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse | Response> {
  const started = performance.now();
  try {
    const { slug } = await params;
    if (!normalizeSlug(slug)) {
      return NextResponse.json({ error: "Invalid slug", requestId: getRequestId(request) }, { status: 400 });
    }
    const { anime: detail, tier } = await getAnimeDetailWithMeta(slug);
    if (!detail || !detail.title) {
      return NextResponse.json({ error: "Anime not found", requestId: getRequestId(request) }, { status: 404 });
    }

    const groups: EpisodeGroup[] = (detail.download ?? [])
      .map((option) => ({
        episode: parseEpisodeRange(option.title).start ?? null,
        label: option.title,
        is_batch: Boolean(option.is_batch),
        mirrors: (option.link_download ?? []).flatMap((resolution) =>
          (resolution.link ?? []).map((target) => ({
            resolution: resolution.resolusi,
            height: resolution.height,
            platform: target.platform,
            url: target.url,
            is_torrent: target.is_torrent,
          })),
        ),
      }))
      .sort((a, b) => {
        if (a.episode === null && b.episode === null) return 0;
        if (a.episode === null) return 1;
        if (b.episode === null) return -1;
        return a.episode - b.episode;
      });

    const episodeNumbers = groups
      .map((group) => group.episode)
      .filter((episode): episode is number => episode !== null);

    const payload = {
      slug,
      title: detail.title,
      total_episodes: new Set(episodeNumbers).size,
      groups,
    };

    const etag = generateEtag(JSON.stringify(payload));
    const headers = {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
      ETag: etag,
      ...xCacheHeaders(tier),
      "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    };
    if (checkEtagMatch(request, etag)) {
      return new Response(null, { status: 304, headers });
    }

    return NextResponse.json(payload, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch anime episodes", requestId: getRequestId(request) },
      { status: 500, headers: { ...xCacheHeaders("fallback") } },
    );
  }
}

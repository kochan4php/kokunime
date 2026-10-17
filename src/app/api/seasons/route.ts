import { getSeasonsWithMeta } from "@/services/scraper";
import { xCacheHeaders } from "@/services/cache";
import { checkEtagMatch, generateEtag } from "@/lib/etag";
import { getRequestId } from "@/lib/request-id";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const started = performance.now();
  try {
    const { seasons, tier } = await getSeasonsWithMeta();
    const cacheHeaders = {
      ...xCacheHeaders(tier),
      "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    };
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format")?.toLowerCase();

    if (format === "csv") {
      const csvRows = ["name,endpoint", ...seasons.map((s) => `"${s.name.replace(/"/g, '""')}","${s.endpoint}"`)];
      const csvPayload = csvRows.join("\n");
      const etag = generateEtag(csvPayload);
      if (checkEtagMatch(request, etag)) {
        return new Response(null, { status: 304, headers: { ETag: etag, ...cacheHeaders } });
      }
      return new Response(csvPayload, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'inline; filename="kokunime-seasons.csv"',
          "Cache-Control": "private, max-age=600",
          ETag: etag,
          ...cacheHeaders,
        },
      });
    }

    if (format === "xml") {
      const xmlItems = seasons
        .map((s) => `  <season><name>${s.name}</name><endpoint>${s.endpoint}</endpoint></season>`)
        .join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<seasons total="${seasons.length}">\n${xmlItems}\n</seasons>`;
      const etag = generateEtag(xml);
      if (checkEtagMatch(request, etag)) {
        return new Response(null, { status: 304, headers: { ETag: etag, ...cacheHeaders } });
      }
      return new Response(xml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "private, max-age=600",
          ETag: etag,
          ...cacheHeaders,
        },
      });
    }

    const payload = {
      total: seasons.length,
      seasons,
    };
    const etag = generateEtag(JSON.stringify(payload));
    if (checkEtagMatch(request, etag)) {
      return new Response(null, { status: 304, headers: { ETag: etag, ...cacheHeaders } });
    }

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, max-age=600",
        ETag: etag,
        ...cacheHeaders,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch seasons", requestId: getRequestId(request) },
      { status: 500, headers: { ...xCacheHeaders("fallback") } },
    );
  }
}

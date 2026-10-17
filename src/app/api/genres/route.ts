import { getGenresWithMeta } from "@/services/scraper";
import { xCacheHeaders } from "@/services/cache";
import { generateEtag, checkEtagMatch } from "@/lib/etag";
import { problemResponse } from "@/lib/api-error";
import { getRequestId } from "@/lib/request-id";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const started = performance.now();
  try {
    const { genres, tier } = await getGenresWithMeta();
    const cacheHeaders = {
      ...xCacheHeaders(tier),
      "Server-Timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
    };
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format")?.toLowerCase();

    if (format === "csv") {
      const csvRows = ["name,endpoint", ...genres.map((g) => `"${g.name.replace(/"/g, '""')}","${g.endpoint}"`)];
      const payload = csvRows.join("\n");
      const etag = generateEtag(payload);
      if (checkEtagMatch(request, etag)) {
        return new Response(null, { status: 304, headers: { ETag: etag, ...cacheHeaders } });
      }
      return new Response(payload, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'inline; filename="kokunime-genres.csv"',
          "Cache-Control": "private, max-age=600",
          ETag: etag,
          ...cacheHeaders,
        },
      });
    }

    if (format === "xml") {
      const xmlItems = genres
        .map((g) => `  <genre><name>${g.name}</name><endpoint>${g.endpoint}</endpoint></genre>`)
        .join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<genres total="${genres.length}">\n${xmlItems}\n</genres>`;
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

    const payloadObj = {
      total: genres.length,
      genres,
    };
    const etag = generateEtag(JSON.stringify(payloadObj));
    if (checkEtagMatch(request, etag)) {
      return new Response(null, { status: 304, headers: { ETag: etag, ...cacheHeaders } });
    }

    return NextResponse.json(payloadObj, {
      headers: {
        "Cache-Control": "private, max-age=600",
        ETag: etag,
        ...cacheHeaders,
      },
    });
  } catch {
    return problemResponse({
      status: 500,
      title: "Upstream failure",
      detail: "Failed to fetch genres",
      requestId: getRequestId(request),
      headers: { ...xCacheHeaders("fallback") },
    });
  }
}

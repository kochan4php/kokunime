import { escapeXml } from "@/lib/feed-items";
import { SITE_URL } from "@/lib/site";
import { collectYearAnime } from "@/lib/year-anime";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const YEAR_RE = /^(19|20)\d{2}$/;

// Per-year RSS: /years/[year]/feed.xml — same aggregation as the year page.
export async function GET(_request: Request, { params }: { params: Promise<{ year: string }> }): Promise<Response> {
  const { year } = await params;
  if (!YEAR_RE.test(year)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const siteUrl = SITE_URL;
  const anime = await collectYearAnime(year);
  const updated = new Date();

  const rssItems = anime
    .slice(0, 50)
    .map((item) => {
      const endpoint = item.link?.endpoint ?? "";
      const url = `${siteUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
      const genres = item.genres?.filter(Boolean).slice(0, 3).join(", ");
      const summary = `Download ${item.title} Subtitle Indonesia${genres ? ` — ${genres}` : ""} · Rilis: ${item.release || year}`;
      return `    <item>
      <title>${escapeXml(item.title ?? "")}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(summary)}</description>
      <pubDate>${updated.toUTCString()}</pubDate>
      ${item.link?.image ? `<enclosure url="${escapeXml(item.link.image)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kokunime - Anime Tahun ${year}</title>
    <link>${siteUrl}/years/${year}</link>
    <description>Daftar anime rilis tahun ${year} di Kokunime, subtitle Indonesia.</description>
    <language>id-ID</language>
    <atom:link href="${siteUrl}/years/${year}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
${rssItems}
  </channel>
</rss>`.trim();

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=1800",
    },
  });
}

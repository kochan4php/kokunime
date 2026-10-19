import { escapeXml, feedResponse, releaseDate, UPDATE_FEED_CACHE } from "@/lib/feed-items";
import { SITE_URL } from "@/lib/site";
import { getAnimePerPage } from "@/services/scraper";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Update timeline RSS: /update/feed.xml — the same first catalog page the
// /update page groups by recency, published as a flat feed.
export async function GET(request: NextRequest): Promise<Response> {
  const siteUrl = SITE_URL;
  const { anime = [] } = await getAnimePerPage(1);
  const published = anime.slice(0, 50).map((item) => releaseDate(item.release));
  const lastBuildDate = (published[0] ?? new Date()).toUTCString();

  const rssItems = anime
    .slice(0, 50)
    .map((item, index) => {
      const endpoint = item.link?.endpoint ?? "";
      const url = `${siteUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
      const genres = item.genres?.filter(Boolean).slice(0, 3).join(", ");
      const summary = `Diperbarui ${item.release || "baru-baru ini"} — Download ${item.title} Subtitle Indonesia${
        genres ? ` · ${genres}` : ""
      }`;
      return `    <item>
      <title>${escapeXml(item.title ?? "")}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(summary)}</description>
      <pubDate>${published[index]?.toUTCString()}</pubDate>
      ${item.link?.image ? `<enclosure url="${escapeXml(item.link.image)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kokunime - Update Anime Terbaru</title>
    <link>${siteUrl}/update</link>
    <description>Episode dan batch anime yang baru diperbarui di Kokunime, subtitle Indonesia.</description>
    <language>id-ID</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/update/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
${rssItems}
  </channel>
</rss>`.trim();

  return feedResponse(request, rssFeed, "application/xml; charset=utf-8", { cache: UPDATE_FEED_CACHE });
}

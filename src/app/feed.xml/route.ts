import { escapeXml, feedResponse, getFeedData } from "@/lib/feed-items";
import { SITE_URL } from "@/lib/site";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const siteUrl = SITE_URL;
  const { searchParams } = new URL(request.url);
  const {
    title: feedTitle,
    description: feedDesc,
    entries,
    querySuffix,
  } = await getFeedData(siteUrl, searchParams.get("genre"), searchParams.get("season"));

  const lastBuildDate = (entries[0]?.updated ?? new Date()).toUTCString();

  const rssItems = entries
    .map(
      (entry) => `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${entry.url}</link>
      <guid>${entry.url}</guid>
      <description>${escapeXml(entry.summary)}</description>
      <pubDate>${entry.updated.toUTCString()}</pubDate>
      ${entry.image ? `<enclosure url="${escapeXml(entry.image)}" type="image/jpeg" />` : ""}
    </item>`,
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(feedDesc)}</description>
    <language>id-ID</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml${querySuffix}" rel="self" type="application/rss+xml"/>
    <atom:link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
${rssItems}
  </channel>
</rss>`.trim();

  return feedResponse(request, rssFeed, "application/xml; charset=utf-8");
}

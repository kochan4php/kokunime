import { escapeXml, getFeedData } from "@/lib/feed-items";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

// Per-genre RSS: /genres/[genre]/feed.xml (linked from the genre page metadata).
export async function GET(_request: Request, { params }: { params: Promise<{ genre: string }> }): Promise<Response> {
  const { genre } = await params;
  const siteUrl = SITE_URL;
  const { title: feedTitle, description: feedDesc, entries } = await getFeedData(siteUrl, genre, null);
  const selfUrl = `${siteUrl}/genres/${genre}/feed.xml`;

  const rssItems = entries
    .map(
      (entry) => `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${entry.url}</link>
      <guid>${entry.url}</guid>
      <description>${escapeXml(entry.summary)}</description>
      ${entry.image ? `<enclosure url="${escapeXml(entry.image)}" type="image/jpeg" />` : ""}
    </item>`,
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${siteUrl}/genres/${genre}</link>
    <description>${escapeXml(feedDesc)}</description>
    <language>id-ID</language>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>
    <atom:link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
${rssItems}
  </channel>
</rss>`.trim();

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=1800",
    },
  });
}

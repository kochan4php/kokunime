import { escapeXml, getFeedData } from "@/lib/feed-items";
import { SITE_URL } from "@/lib/site";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Atom 1.0 mirror of /feed.xml (same genre/season filters) for readers that
// prefer Atom.
export async function GET(request: NextRequest): Promise<Response> {
  const siteUrl = SITE_URL;
  const { searchParams } = new URL(request.url);
  const {
    title: feedTitle,
    description: feedDesc,
    entries,
    querySuffix,
  } = await getFeedData(siteUrl, searchParams.get("genre"), searchParams.get("season"));

  const updated = (entries[0]?.updated ?? new Date()).toISOString();

  const atomEntries = entries
    .map(
      (entry) => `  <entry>
    <title>${escapeXml(entry.title)}</title>
    <link href="${entry.url}"/>
    <id>${entry.url}</id>
    <updated>${entry.updated.toISOString()}</updated>
    <summary>${escapeXml(entry.summary)}</summary>
  </entry>`,
    )
    .join("\n");

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(feedTitle)}</title>
  <id>${siteUrl}/feed.atom${querySuffix}</id>
  <link href="${siteUrl}/feed.atom${querySuffix}" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl}" rel="alternate" type="text/html"/>
  <updated>${updated}</updated>
  <subtitle>${escapeXml(feedDesc)}</subtitle>
${atomEntries}
</feed>`.trim();

  return new Response(atomFeed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=1800",
    },
  });
}

import { escapeXml, feedResponse, releaseDate } from "@/lib/feed-items";
import { SITE_URL } from "@/lib/site";
import { decodeStudioName } from "@/lib/studio";
import { searchAnime } from "@/services/scraper";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Studio RSS: /studio/[name]/feed.xml — the same catalog search the studio page
// runs, because the upstream has no studio index.
export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }): Promise<Response> {
  const { name } = await params;
  const studio = decodeStudioName(name);
  if (!studio) return new Response("Not Found", { status: 404 });

  const siteUrl = SITE_URL;
  const anime = await searchAnime(studio);
  const published = anime.slice(0, 50).map((item) => releaseDate(item.release));
  const lastBuildDate = (published[0] ?? new Date()).toUTCString();

  const rssItems = anime
    .slice(0, 50)
    .map((item, index) => {
      const endpoint = item.link?.endpoint ?? "";
      const url = `${siteUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
      const genres = item.genres?.filter(Boolean).slice(0, 3).join(", ");
      const summary = `Download ${item.title} Subtitle Indonesia${genres ? ` — ${genres}` : ""} · Rilis: ${item.release || "Terbaru"}`;
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
    <title>Kokunime - Anime Studio ${escapeXml(studio)}</title>
    <link>${siteUrl}/studio/${encodeURIComponent(studio)}</link>
    <description>Judul katalog Kokunime yang cocok dengan studio ${escapeXml(studio)}, subtitle Indonesia.</description>
    <language>id-ID</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/studio/${encodeURIComponent(studio)}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
${rssItems}
  </channel>
</rss>`.trim();

  return feedResponse(request, rssFeed, "application/xml; charset=utf-8");
}

import { feedResponse, getFeedData } from "@/lib/feed-items";
import { SITE_URL } from "@/lib/site";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// JSON Feed 1.1 mirror of /feed.xml. Shares getFeedData so titles, summaries
// and dates stay identical across all three syndication formats.
export async function GET(request: NextRequest): Promise<Response> {
  const siteUrl = SITE_URL;
  const { searchParams } = new URL(request.url);
  const { title, description, entries, querySuffix } = await getFeedData(
    siteUrl,
    searchParams.get("genre"),
    searchParams.get("season"),
  );

  const items = entries.map((entry) => ({
    id: entry.url,
    url: entry.url,
    title: entry.title,
    content_text: entry.summary,
    date_modified: entry.updated.toISOString(),
    ...(entry.image ? { image: entry.image } : {}),
    tags: entry.tags,
  }));

  const jsonFeed = {
    version: "https://jsonfeed.org/version/1.1",
    title,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json${querySuffix}`,
    description,
    language: "id-ID",
    items,
  };

  return feedResponse(request, JSON.stringify(jsonFeed), "application/feed+json; charset=utf-8");
}

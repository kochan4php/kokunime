import { SITE_URL } from "@/lib/site";
import { getAnimePerPage } from "@/services/scraper";
import { buildCalendarFeed, CalendarFeedEvent } from "@/utils/ics";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Webcal subscription feed: /update/feed.ics — the same first catalog page the
// RSS feed serves, as one all-day calendar event per title.
export async function GET(): Promise<Response> {
  const { anime = [] } = await getAnimePerPage(1);

  const events: CalendarFeedEvent[] = anime.slice(0, 50).map((item) => {
    const endpoint = item.link?.endpoint ?? "";
    const url = `${SITE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const genres = item.genres?.filter(Boolean).slice(0, 3).join(", ");
    const release = item.release ? `Diperbarui ${item.release}` : "Update baru";
    const title = item.title ?? "";
    return {
      title,
      url,
      description: `${release} — ${title}${genres ? ` · ${genres}` : ""}`,
    };
  });

  return new NextResponse(buildCalendarFeed(events), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="kokunime-update.ics"',
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=1800",
    },
  });
}

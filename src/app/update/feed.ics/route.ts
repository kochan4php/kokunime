import { feedResponse, UPDATE_FEED_CACHE } from "@/lib/feed-items";
import { SITE_URL } from "@/lib/site";
import { getAnimePerPage } from "@/services/scraper";
import { buildCalendarFeed, CalendarFeedEvent } from "@/utils/ics";

export const dynamic = "force-dynamic";

// Webcal subscription feed: /update/feed.ics — the same first catalog page the
// RSS feed serves, as one all-day calendar event per title.
export async function GET(request: Request): Promise<Response> {
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

  return feedResponse(
    request,
    buildCalendarFeed(events, new Date(Math.floor(Date.now() / 3_600_000) * 3_600_000)),
    "text/calendar; charset=utf-8",
    {
      cache: UPDATE_FEED_CACHE,
      headers: { "Content-Disposition": 'inline; filename="kokunime-update.ics"' },
    },
  );
}

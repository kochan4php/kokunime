import type { BookmarkItem, BookmarkStatus } from "@/utils/bookmarks";

const slugifyTitle = (title: string): string => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base ? `${base}-batch-sub-indo` : `anime-${Date.now()}`;
};

export function parseMalXml(xmlText: string): BookmarkItem[] {
  const items: BookmarkItem[] = [];
  const animeBlocks = xmlText.match(/<anime>[\s\S]*?<\/anime>/gi) || [];

  for (const block of animeBlocks) {
    const titleMatch =
      block.match(/<series_title><!\[CDATA\[(.*?)\]\]><\/series_title>/i) ||
      block.match(/<series_title>(.*?)<\/series_title>/i);
    const statusMatch = block.match(/<my_status>(.*?)<\/my_status>/i);
    const scoreMatch = block.match(/<my_score>(.*?)<\/my_score>/i);

    const title = titleMatch?.[1]?.trim() ?? "";
    if (!title) continue;

    let status: BookmarkStatus = "plan";
    const statusStr = (statusMatch?.[1]?.trim() ?? "").toLowerCase();
    if (statusStr === "watching" || statusStr === "1") status = "watching";
    else if (statusStr === "completed" || statusStr === "2") status = "completed";
    else if (statusStr === "dropped" || statusStr === "4") status = "dropped";
    else if (statusStr === "plan to watch" || statusStr === "6") status = "plan";

    const rawScore = parseInt(scoreMatch?.[1]?.trim() ?? "0", 10);
    const rating = rawScore >= 1 && rawScore <= 10 ? rawScore : undefined;

    items.push({
      slug: slugifyTitle(title),
      title,
      status,
      rating,
      addedAt: Date.now(),
    });
  }

  return items;
}

export function parseAniListJson(jsonText: string): BookmarkItem[] {
  try {
    const data = JSON.parse(jsonText);
    const entries = Array.isArray(data)
      ? data
      : (data?.data?.MediaListCollection?.lists?.flatMap((l: { entries?: unknown[] }) => l.entries) ?? []);
    const items: BookmarkItem[] = [];

    for (const entry of entries) {
      const title =
        entry?.media?.title?.english ||
        entry?.media?.title?.userPreferred ||
        entry?.media?.title?.romaji ||
        entry?.title;
      if (!title) continue;

      let status: BookmarkStatus = "plan";
      const s = String(entry.status || "").toUpperCase();
      if (s === "CURRENT") status = "watching";
      else if (s === "COMPLETED") status = "completed";
      else if (s === "DROPPED") status = "dropped";
      else if (s === "PLANNING") status = "plan";

      const score =
        typeof entry.score === "number" && entry.score > 0
          ? entry.score > 10
            ? Math.round(entry.score / 10)
            : Math.round(entry.score)
          : undefined;

      items.push({
        slug: slugifyTitle(title),
        title,
        status,
        rating: score,
        image: entry?.media?.coverImage?.large || entry?.media?.coverImage?.medium,
        addedAt: Date.now(),
      });
    }

    return items;
  } catch {
    return [];
  }
}

// MyAnimeList XML export (format 1 = anime list).
export const serializeMalXml = (list: BookmarkItem[]): string => {
  const entries = list
    .map((item) => {
      const malStatus =
        item.status === "watching"
          ? "Watching"
          : item.status === "completed"
            ? "Completed"
            : item.status === "dropped"
              ? "Dropped"
              : "Plan to Watch";
      const malScore = item.rating || 0;
      const malComments = item.notes ? `<![CDATA[${item.notes}]]>` : "";

      return `  <anime>
    <series_title><![CDATA[${item.title}]]></series_title>
    <my_score>${malScore}</my_score>
    <my_status>${malStatus}</my_status>
    <my_comments>${malComments}</my_comments>
  </anime>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Created by Kokunime
  Program: MyAnimeList Anime List XML Exporter
-->
<myanimelist>
  <myinfo>
    <user_export_type>1</user_export_type>
    <user_total_anime>${list.length}</user_total_anime>
  </myinfo>
${entries}
</myanimelist>`;
};

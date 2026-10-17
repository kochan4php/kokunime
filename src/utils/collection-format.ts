import { BookmarkItem } from "@/utils/bookmarks";
import { HistoryItem } from "@/utils/history";

export const itemTime = (item: BookmarkItem | HistoryItem): number =>
  "addedAt" in item ? item.addedAt : item.viewedAt;

export const dayKey = (ts: number): string => {
  const date = new Date(ts);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const dayLabel = (ts: number): string => {
  const now = new Date();
  if (dayKey(ts) === dayKey(now.getTime())) return "Hari ini";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (dayKey(ts) === dayKey(yesterday.getTime())) return "Kemarin";
  return new Date(ts).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

import { getBookmarks, updateBookmarkUserMeta } from "@/utils/bookmarks";
import { getProgress } from "@/utils/progress";
import { getStoredSettings } from "@/utils/settings";

export const COMPLETED_FOLDER = "Selesai";

// Auto-archive: when the opt-in setting is on and an anime's progress is
// complete (known total, every episode watched), its bookmark moves to the
// "Selesai" folder. Returns the archived title so the caller can toast, or
// null when nothing changed.
export const maybeAutoArchive = (slug: string, title?: string): string | null => {
  if (!slug) return null;
  if (!getStoredSettings().autoArchive) return null;

  const entry = getProgress(slug);
  if (!entry?.total || entry.watched.length < entry.total) return null;

  const bookmark = getBookmarks().find((item) => item.slug === slug);
  if (!bookmark || bookmark.folder === COMPLETED_FOLDER) return null;

  updateBookmarkUserMeta(slug, { folder: COMPLETED_FOLDER });
  return bookmark.title || title || slug;
};

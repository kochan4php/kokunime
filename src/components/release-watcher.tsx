"use client";

import { useEffect } from "react";
import { getBookmarks } from "@/utils/bookmarks";
import { ReleaseItem, scanReleases } from "@/utils/release-inbox";

interface ReleaseWatcherProps {
  items: ReleaseItem[];
}

// Invisible: scans the listing it is rendered next to and fills the release
// inbox when a bookmarked title's release label changes.
const ReleaseWatcher = ({ items }: ReleaseWatcherProps): null => {
  useEffect(() => {
    if (items.length === 0) return;
    scanReleases(
      items,
      getBookmarks().map((bookmark) => bookmark.slug),
    );
  }, [items]);

  return null;
};

export default ReleaseWatcher;

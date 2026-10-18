"use client";

import { recordCatalogDetail, recordCatalogItems } from "@/utils/local-catalog";
import { Anime, AnimeDetail } from "@/interfaces";
import { checkSavedSearches } from "@/utils/saved-searches";
import { useEffect } from "react";

interface CatalogRecorderProps {
  items?: Anime[] | undefined;
  slug?: string | undefined;
  detail?: AnimeDetail | null | undefined;
}

// Invisible: fills the device-local catalog from whatever the visitor just
// saw, then re-checks saved searches so brand-new matches reach the inbox.
// Renders nothing, blocks nothing, and is idempotent (a repeat render learns
// zero new titles and pushes zero inbox items).
const CatalogRecorder = ({ items, slug, detail }: CatalogRecorderProps): null => {
  useEffect(() => {
    let learned = 0;
    if (items && items.length > 0) learned += recordCatalogItems(items);
    if (slug && detail) {
      recordCatalogDetail(slug, detail);
      // Score/studio only exist on detail pages, so this counts as knowledge
      // even when the title itself was already known.
      learned += 1;
    }
    if (learned > 0) checkSavedSearches();
  }, [items, slug, detail]);

  return null;
};

export default CatalogRecorder;

"use client";

import { recordHistory } from "@/utils/history";
import { syncProgressMeta } from "@/utils/progress";
import { useEffect } from "react";

interface HistoryTrackerProps {
  slug: string;
  title: string;
  image?: string;
  release?: string;
  total?: number;
}

const HistoryTracker = ({ slug, title, image, release, total }: HistoryTrackerProps): null => {
  useEffect(() => {
    if (slug && title) {
      recordHistory({ slug, title, image, release });
      syncProgressMeta(slug, { title, total });
    }
  }, [slug, title, image, release, total]);

  return null;
};

export default HistoryTracker;

"use client";

import { recordHistory } from "@/utils/history";
import { useEffect } from "react";

interface HistoryTrackerProps {
  slug: string;
  title: string;
  image?: string;
  release?: string;
}

const HistoryTracker = ({ slug, title, image, release }: HistoryTrackerProps): null => {
  useEffect(() => {
    if (slug && title) {
      recordHistory({ slug, title, image, release });
    }
  }, [slug, title, image, release]);

  return null;
};

export default HistoryTracker;

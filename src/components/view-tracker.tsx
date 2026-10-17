"use client";

import { useEffect } from "react";

// Counts a "real" view: only fires after the reader stays ~2 seconds and only
// when Do Not Track is off. sendBeacon survives unload; no cookies involved.
const ViewTracker = ({ slug }: { slug: string }): null => {
  useEffect(() => {
    if (!slug) return;
    const nav = navigator as Navigator & { doNotTrack?: string };
    if (nav.doNotTrack === "1") return;

    const payload = JSON.stringify({ slug });
    const timer = window.setTimeout(() => {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/track-view", new Blob([payload], { type: "application/json" }));
        } else {
          void fetch("/api/track-view", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: payload,
            keepalive: true,
          });
        }
      } catch {
        // Trending is best-effort.
      }
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [slug]);

  return null;
};

export default ViewTracker;

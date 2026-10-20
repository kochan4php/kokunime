"use client";

import { useEffect } from "react";

// Counts a "real" view: only fires after the reader stays ~2 seconds and only
// when Do Not Track is off. sendBeacon survives unload; no cookies involved.
const ViewTracker = ({ slug }: { slug: string }): null => {
  useEffect(() => {
    if (!slug) return;
    // A few catalog slugs are percent-encoded Unicode; trending only accepts
    // ASCII keys, so skip the best-effort ping instead of sending a 400.
    if (!/^[a-z0-9][a-z0-9_-]{0,120}$/i.test(slug)) return;
    const nav = navigator as Navigator & { doNotTrack?: string };
    if (nav.doNotTrack === "1") return;

    const payload = JSON.stringify({ slug });
    const queueForSync = (): void => {
      navigator.serviceWorker?.controller?.postMessage({ type: "kokunime:queue-track", body: { slug } });
    };
    const timer = window.setTimeout(() => {
      try {
        // Offline: hand the ping to the service worker outbox (Background
        // Sync replays it; the online listener flushes as fallback).
        if (!navigator.onLine) {
          queueForSync();
          return;
        }
        if (navigator.sendBeacon) {
          const queued = navigator.sendBeacon("/api/track-view", new Blob([payload], { type: "application/json" }));
          if (!queued) queueForSync();
        } else {
          void fetch("/api/track-view", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => queueForSync());
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

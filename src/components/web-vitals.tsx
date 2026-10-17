"use client";

import { useReportWebVitals } from "next/web-vitals";
import { JSX, useState } from "react";

// Report RUM for a fraction of sessions only — the endpoint stays cheap and
// the server alerts on the slow tail, which is what actually matters.
const SAMPLE_RATE = 0.2;

const WebVitals = (): JSX.Element | null => {
  const [sampled] = useState(() => Math.random() < SAMPLE_RATE);

  useReportWebVitals((metric) => {
    if (!sampled || typeof window === "undefined") return;

    const payload = JSON.stringify({
      name: metric.name,
      value: metric.value,
      path: window.location.pathname,
      deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/report-vitals", new Blob([payload], { type: "application/json" }));
        return;
      }
    } catch {}

    void fetch("/api/report-vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  });

  return null;
};

export default WebVitals;

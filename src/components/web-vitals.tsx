"use client";

import { useReportWebVitals } from "next/web-vitals";
import { recordDiagnostic } from "@/utils/diagnostics";
import { VITALS_THRESHOLDS, type VitalName } from "@/lib/vitals-thresholds";
import { JSX, useState } from "react";

// Report RUM for a fraction of sessions only — the endpoint stays cheap and
// the server alerts on the slow tail, which is what actually matters.
const SAMPLE_RATE = 0.2;

const WebVitals = (): JSX.Element | null => {
  const [sampled] = useState(() => Math.random() < SAMPLE_RATE);

  useReportWebVitals((metric) => {
    if (typeof window === "undefined") return;

    // The device-local ring buffer keeps the three budgeted vitals per page —
    // that is what "Salin diagnostik" and error reports carry.
    if (metric.name === "LCP" || metric.name === "CLS" || metric.name === "INP") {
      const rounded = metric.name === "CLS" ? metric.value.toFixed(3) : `${Math.round(metric.value)}ms`;
      recordDiagnostic("vital", `${metric.name}=${rounded} di ${window.location.pathname}`);
    }

    // Dev-only budget warning: a regression shows up in the console while it
    // is still cheap to fix. Production stays silent (server alerts instead).
    if (process.env.NODE_ENV !== "production") {
      const budget = VITALS_THRESHOLDS[metric.name as VitalName];
      if (typeof budget === "number" && metric.value > budget) {
        console.warn(
          `[web-vitals] ${metric.name} = ${metric.value.toFixed(1)} (budget ${budget}) di ${window.location.pathname}`,
        );
      }
    }

    if (!sampled) return;

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

"use client";

import { useReportWebVitals } from "next/web-vitals";
import { usePathname } from "next/navigation";
import { recordDiagnostic } from "@/utils/diagnostics";
import { VITALS_THRESHOLDS, type VitalName } from "@/lib/vitals-thresholds";
import { JSX, useEffect, useRef, useState } from "react";

// Report RUM for a fraction of sessions only — the endpoint stays cheap and
// the server alerts on the slow tail, which is what actually matters.
const SAMPLE_RATE = 0.2;
const CONNECTION_TYPES = ["slow-2g", "2g", "3g", "4g"] as const;

const connectionType = (): string | undefined => {
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  const type = connection?.effectiveType;
  return type && (CONNECTION_TYPES as readonly string[]).includes(type) ? type : undefined;
};

const deviceType = (): "mobile" | "desktop" => (window.innerWidth < 768 ? "mobile" : "desktop");

const sendVital = (name: VitalName, value: number, path: string): void => {
  const payload = JSON.stringify({ name, value, path, deviceType: deviceType(), connection: connectionType() });
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
};

const WebVitals = (): JSX.Element | null => {
  const [sampled] = useState(() => Math.random() < SAMPLE_RATE);
  const pathname = usePathname();
  const loafRef = useRef(0);
  const loafPathRef = useRef(pathname);

  useReportWebVitals((metric) => {
    if (typeof window === "undefined") return;

    // The device-local ring buffer keeps the budgeted vitals per page —
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
    sendVital(metric.name as VitalName, metric.value, window.location.pathname);
  });

  // LoAF is not emitted by useReportWebVitals. Keep the worst frame per route
  // and flush it when the route changes or the page is hidden/unloaded.
  useEffect(() => {
    if (!sampled) return;
    if (typeof PerformanceObserver === "undefined") return;
    if (!PerformanceObserver.supportedEntryTypes?.includes("long-animation-frame")) return;

    const flush = () => {
      if (loafRef.current <= 0) return;
      sendVital("LoAF", loafRef.current, loafPathRef.current);
      loafRef.current = 0;
    };

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        loafRef.current = Math.max(loafRef.current, entry.duration);
      }
    });
    try {
      observer.observe({ type: "long-animation-frame", buffered: true });
    } catch {
      observer.disconnect();
      return;
    }

    const onHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", flush);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [sampled]);

  useEffect(() => {
    if (loafPathRef.current === pathname) return;
    if (loafRef.current > 0) {
      sendVital("LoAF", loafRef.current, loafPathRef.current);
      loafRef.current = 0;
    }
    loafPathRef.current = pathname;
  }, [pathname]);

  return null;
};

export default WebVitals;

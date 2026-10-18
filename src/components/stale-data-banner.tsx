"use client";

import { recordDiagnostic } from "@/utils/diagnostics";
import { JSX, useEffect, useState } from "react";

// The service worker reports when a fetch could not be refreshed (or came back
// from the stale/fallback cache tier). Saying "data per <time>" is honest;
// silently showing old numbers is not. A fresh response clears it.
const StaleDataBanner = (): JSX.Element | null => {
  const [at, setAt] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; at?: string } | null;
      if (data?.type === "kokunime:data-stale") {
        setAt(data.at ?? new Date().toISOString());
        setDismissed(false);
        recordDiagnostic("cache", "Service worker melaporkan data mungkin basi");
      } else if (data?.type === "kokunime:data-fresh") {
        setAt(null);
      }
    };
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    setOnline(navigator.onLine);
    // Service worker postMessages arrive on the container, not on window.
    const container = navigator.serviceWorker;
    container?.addEventListener("message", onMessage);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      container?.removeEventListener("message", onMessage);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!online || !at || dismissed) return null;

  const when = new Date(at);
  const label = Number.isNaN(when.getTime())
    ? ""
    : when.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div data-print-hide className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="flex items-start gap-3 rounded-sm border-2 border-border bg-surface-solid p-3 shadow-[4px_4px_0_0_var(--border)]">
        <span className="mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full bg-nb-red" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-ink">Data mungkin tertinggal</p>
          <p className="text-[11px] text-ink-muted">
            Server gagal menyegarkan dari sumber{label ? ` — data per ${label}` : ""}. Coba lagi sebentar lagi.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="h-6 rounded-sm border-2 border-border bg-nb-yellow px-2.5 font-mono text-[10px] font-bold text-[#0a0a0a] shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              Coba lagi
            </button>
            <button
              type="button"
              aria-label="Tutup peringatan data tertinggal"
              onClick={() => setDismissed(true)}
              className="flex h-6 w-6 items-center justify-center rounded-sm border-2 border-border bg-surface text-[11px] font-bold text-ink-muted transition-colors hover:text-ink cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaleDataBanner;

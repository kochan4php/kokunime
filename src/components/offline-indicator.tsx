"use client";

import Link from "next/link";
import { JSX, useSyncExternalStore } from "react";

const subscribeOnline = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const getOnlineSnapshot = () => (typeof navigator !== "undefined" ? navigator.onLine : true);

const OfflineIndicator = (): JSX.Element | null => {
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, () => true);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-bounce">
      <div className="flex items-center justify-between rounded-sm border-2 border-border bg-surface-solid p-3.5 shadow-[4px_4px_0_0_var(--border)]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          <div>
            <p className="text-xs font-bold text-ink">Mode Offline Aktif</p>
            <p className="text-[11px] text-ink-muted">Anda tidak terhubung ke internet.</p>
          </div>
        </div>
        <Link
          href="/bookmarks"
          className="rounded-sm border-2 border-border bg-nb-yellow px-3 py-1 font-mono text-[11px] font-bold text-[#0a0a0a] shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          Lihat Bookmark →
        </Link>
      </div>
    </div>
  );
};

export default OfflineIndicator;

"use client";

import {
  getUnreadReleases,
  markReleasesRead,
  removeUnreadRelease,
  subscribeReleases,
  UnreadRelease,
} from "@/utils/release-inbox";
import Link from "next/link";
import { JSX, useEffect, useState, useSyncExternalStore } from "react";

const EMPTY: UnreadRelease[] = [];

// New-release inbox: bell in the navbar + App Badging when supported.
const InboxBell = (): JSX.Element => {
  const unread = useSyncExternalStore(subscribeReleases, getUnreadReleases, () => EMPTY);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & {
      setAppBadge?: (count?: number) => Promise<void>;
      clearAppBadge?: () => Promise<void>;
    };
    // Launcher/home-screen badge (Chromium + installed PWAs); ignored elsewhere.
    if (unread.length > 0) nav.setAppBadge?.(unread.length).catch(() => {});
    else nav.clearAppBadge?.().catch(() => {});
  }, [unread.length]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={unread.length > 0 ? `Inbox rilis baru (${unread.length} belum dibaca)` : "Inbox rilis baru"}
        title="Inbox rilis baru"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface text-sm text-ink transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--border)] active:translate-y-0 active:shadow-none cursor-pointer"
      >
        <span aria-hidden="true">{unread.length > 0 ? "🔔" : "🔕"}</span>
        {unread.length > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-sm border-2 border-border bg-nb-pink px-1 font-mono text-[9px] font-bold text-[#0a0a0a]">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Tutup inbox"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/20"
          />
          <div
            role="dialog"
            aria-label="Inbox rilis baru"
            className="absolute right-0 top-full z-50 mt-2 w-[min(88vw,20rem)] rounded-sm border-2 border-border bg-surface-solid p-3 shadow-[4px_4px_0_0_var(--border)]"
          >
            <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-2">
              <h2 className="font-display text-sm font-bold text-ink">Rilis Baru</h2>
              {unread.length > 0 && (
                <button
                  type="button"
                  onClick={() => markReleasesRead()}
                  className="rounded-sm border-2 border-border bg-nb-yellow px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink transition-all motion-safe:hover:-translate-y-0.5 cursor-pointer"
                >
                  Tandai dibaca
                </button>
              )}
            </div>

            {unread.length === 0 ? (
              <p className="pt-3 text-xs leading-relaxed text-ink-muted">
                Tidak ada rilis baru. Badge 🔔 muncul saat anime tersimpanmu berganti label rilis di halaman update.
              </p>
            ) : (
              <ul className="max-h-72 space-y-2 overflow-y-auto pt-2">
                {unread.map((item) => (
                  <li
                    key={item.slug}
                    className="flex items-start justify-between gap-2 rounded-sm border-2 border-border bg-surface p-2"
                  >
                    <Link
                      href={`/anime/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="min-w-0 flex-1 text-xs font-bold text-ink hover:text-accent-text"
                    >
                      <span className="line-clamp-2">{item.title}</span>
                      <span className="mt-0.5 block font-mono text-[10px] font-normal text-ink-muted">
                        {item.from} → {item.to}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeUnreadRelease(item.slug)}
                      aria-label={`Tandai ${item.title} sudah dibaca`}
                      className="shrink-0 rounded-sm border-2 border-border bg-surface px-1.5 font-mono text-[10px] text-ink-muted transition-colors hover:text-ink cursor-pointer"
                    >
                      ✓
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InboxBell;

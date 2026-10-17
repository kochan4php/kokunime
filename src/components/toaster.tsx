"use client";

import { ToastItem, dismissToast, getToasts, setToastsPaused, subscribeToasts } from "@/utils/toast";
import { JSX, useSyncExternalStore } from "react";

const EMPTY_TOASTS: ToastItem[] = [];

const Toaster = (): JSX.Element | null => {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, () => EMPTY_TOASTS);

  if (toasts.length === 0) return null;

  return (
    // pb uses the mobile sticky-CTA clearance so toasts never cover it.
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setToastsPaused(true)}
      onMouseLeave={() => setToastsPaused(false)}
      onFocusCapture={() => setToastsPaused(true)}
      onBlurCapture={() => setToastsPaused(false)}
      className="pointer-events-none fixed bottom-24 left-1/2 z-[70] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2 lg:bottom-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 rounded-sm border-2 border-border bg-surface-solid px-3 py-2.5 shadow-[4px_4px_0_0_var(--border)]"
        >
          <p className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">{toast.message}</p>
          {toast.actionLabel && toast.onAction ? (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                dismissToast(toast.id);
              }}
              className="shrink-0 rounded-sm border-2 border-border bg-nb-yellow px-2 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              {toast.actionLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Tutup notifikasi"
            className="shrink-0 rounded-sm border-2 border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-muted transition-colors hover:text-ink cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;

"use client";

import { JSX, useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/utils/i18n";
import { listSavedOffline, removeOfflineEntry, saveOfflineEntry, subscribeOfflineSaved } from "@/utils/offline-saved";
import { showToast } from "@/utils/toast";

interface SaveOfflineButtonProps {
  slug: string;
  title: string;
}

const registerRefreshSync = (): void => {
  navigator.serviceWorker?.ready
    .then((registration) => {
      const reg = registration as ServiceWorkerRegistration & {
        sync?: { register: (tag: string) => Promise<void> };
      };
      return reg.sync?.register("kokunime-refresh-saved");
    })
    .catch(() => {
      // Background Sync unsupported — pages still refresh on next online visit.
    });
};

// Only the optimizer URL is worth caching: a cross-origin image comes back
// opaque and CacheStorage pads opaque entries to multi-MB, so the poster of a
// saved page is cached in its optimized (same-origin) form only.
const readPosterUrl = (): string[] => {
  const image = document.querySelector<HTMLImageElement>("[data-offline-image] img");
  const src = image?.currentSrc || image?.src;
  if (!src || !src.startsWith(window.location.origin) || !src.includes("/_next/image")) return [];
  return [src];
};

const SaveOfflineButton = ({ slug, title }: SaveOfflineButtonProps): JSX.Element => {
  const { t } = useTranslation();
  const url = `/anime/${slug}`;
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const list = await listSavedOffline();
      if (active) setSaved(list.some((entry) => entry.url === url));
    };
    refresh();
    const unsubscribe = subscribeOfflineSaved(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [url]);

  const toggle = useCallback(async (): Promise<void> => {
    if (busy) return;
    setBusy(true);
    try {
      if (saved) {
        await removeOfflineEntry(url);
        setSaved(false);
        showToast(t("offline.removed_toast"));
      } else {
        const ok = await saveOfflineEntry({
          url,
          title,
          apiUrls: [`/api/anime/${slug}`, `/api/anime/${slug}/download`],
          imageUrls: readPosterUrl(),
        });
        if (ok) {
          setSaved(true);
          showToast(t("offline.saved_toast"));
          registerRefreshSync();
        } else {
          showToast(t("offline.failed_toast"));
        }
      }
    } finally {
      setBusy(false);
    }
  }, [busy, saved, slug, t, title, url]);

  return (
    <button
      type="button"
      data-offline-save
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      title={t("offline.save_hint")}
      className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2 py-0.5 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 motion-safe:hover:-translate-y-0.5 hover:bg-nb-yellow hover:text-nb-ink active:translate-y-0 active:shadow-none disabled:opacity-60"
    >
      <span aria-hidden="true">{saved ? "✓" : "⤓"}</span>
      <span>{saved ? t("offline.saved") : t("offline.save")}</span>
    </button>
  );
};

export default SaveOfflineButton;

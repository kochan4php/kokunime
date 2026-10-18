"use client";

import { BookmarkItem, getBookmarks, restoreBookmarks } from "@/utils/bookmarks";
import { HistoryItem, getHistory, restoreHistory } from "@/utils/history";
import { ProgressEntry, getProgressList, mergeProgressEntries } from "@/utils/progress";
import { getStoredSettings, mergeSettings } from "@/utils/settings";
import { decodeSyncPayload, encodeSyncPayload } from "@/utils/sync-codec";
import { showToast } from "@/utils/toast";
import { QueueItem, getQueue, mergeQueueItems } from "@/utils/watch-queue";
import { useEffect, useState } from "react";

interface UseSyncLinkResult {
  shareCopied: boolean;
  copySyncLink: () => void;
}

// Share-link import (v2): gzip-compressed bookmarks + progress + history +
// queue + settings appended as #sync=.... Merge is confirm-gated and
// additive (undo-safe). v1 links still decode.
export const useSyncLink = (): UseSyncLinkResult => {
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash.startsWith("#sync=")) return;

    void (async () => {
      const payload = await decodeSyncPayload(hash.slice("#sync=".length));
      const incomingBookmarks = Array.isArray(payload?.b) ? (payload.b as BookmarkItem[]) : [];
      const incomingProgress = Array.isArray(payload?.p) ? (payload.p as ProgressEntry[]) : [];
      const incomingHistory = Array.isArray(payload?.h) ? (payload.h as HistoryItem[]) : [];
      const incomingQueue = Array.isArray(payload?.q) ? (payload.q as QueueItem[]) : [];
      const incomingSettings = payload?.s && typeof payload.s === "object" ? payload.s : null;
      const total =
        incomingBookmarks.length +
        incomingProgress.length +
        incomingHistory.length +
        incomingQueue.length +
        (incomingSettings ? 1 : 0);
      if (total === 0) return;

      window.history.replaceState(null, "", window.location.pathname);
      const parts = [
        incomingBookmarks.length > 0 ? `${incomingBookmarks.length} bookmark` : "",
        incomingProgress.length > 0 ? `${incomingProgress.length} progres` : "",
        incomingHistory.length > 0 ? `${incomingHistory.length} riwayat` : "",
        incomingQueue.length > 0 ? `${incomingQueue.length} antrean` : "",
        incomingSettings ? "preferensi" : "",
      ]
        .filter(Boolean)
        .join(", ");
      const accepted = window.confirm(`Tautan sinkronisasi berisi ${parts}. Gabungkan dengan data di perangkat ini?`);
      if (!accepted) return;

      if (incomingBookmarks.length > 0) restoreBookmarks(incomingBookmarks);
      const mergedProgress = mergeProgressEntries(incomingProgress);
      const historyBefore = getHistory().length;
      if (incomingHistory.length > 0) restoreHistory(incomingHistory);
      const addedHistory = Math.max(0, getHistory().length - historyBefore);
      const addedQueue = incomingQueue.length > 0 ? mergeQueueItems(incomingQueue) : 0;
      const settingsApplied = incomingSettings ? mergeSettings(incomingSettings) : false;
      showToast(
        `Sinkron selesai: ${incomingBookmarks.length} bookmark, ${mergedProgress} progres, ${addedHistory} riwayat, ${addedQueue} antrean${
          settingsApplied ? " + pengaturan" : ""
        }`,
      );
    })();
  }, []);

  const copySyncLink = () => {
    void (async () => {
      try {
        const token = await encodeSyncPayload({
          v: 2,
          b: getBookmarks(),
          p: getProgressList(),
          h: getHistory(),
          q: getQueue(),
          s: getStoredSettings(),
        });
        await navigator.clipboard.writeText(`${window.location.origin}/bookmarks#sync=${token}`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
        showToast("Tautan sync v2 (bookmark, progres, riwayat, antrean, pengaturan) disalin");
      } catch {
        showToast("Gagal menyalin tautan sync");
      }
    })();
  };

  return { shareCopied, copySyncLink };
};

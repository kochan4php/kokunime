import {
  BookmarkItem,
  clearAllBookmarks,
  exportBookmarksJson,
  getBookmarks,
  getFolderOrder,
  importBookmarksJson,
  removeBookmark,
  restoreBookmarks,
  setFolderOrder,
  updateBookmarkUserMeta,
} from "@/utils/bookmarks";
import { getCollections, mergeCollections, removeCollectionName } from "@/utils/collections";
import { dayKey } from "@/utils/collection-format";
import { HistoryItem, clearAllHistory, getHistory, removeHistory, restoreHistory } from "@/utils/history";
import { buildWeeklyReminderIcs } from "@/utils/ics";
import { showToast } from "@/utils/toast";
import { addToQueue } from "@/utils/watch-queue";

// Snapshot-apply-undo handlers for the collection pages. Each mutation keeps
// enough of the previous state to make the toast's "Urungkan" exact.

export const clearCollectionTab = (tab: "bookmarks" | "history"): void => {
  if (tab === "bookmarks") {
    if (window.confirm("Hapus semua anime tersimpan?")) {
      const snapshot = getBookmarks();
      clearAllBookmarks();
      if (snapshot.length > 0) {
        showToast(`${snapshot.length} anime dihapus dari Tersimpan`, {
          actionLabel: "Urungkan",
          onAction: () => restoreBookmarks(snapshot),
        });
      }
    }
  } else {
    if (window.confirm("Hapus semua riwayat terakhir?")) {
      const snapshot = getHistory();
      clearAllHistory();
      if (snapshot.length > 0) {
        showToast(`${snapshot.length} riwayat dihapus`, {
          actionLabel: "Urungkan",
          onAction: () => restoreHistory(snapshot),
        });
      }
    }
  }
};

export const removeCollectionItem = (tab: "bookmarks" | "history", item: BookmarkItem | HistoryItem): void => {
  if (tab === "bookmarks") {
    const snapshot = getBookmarks().find((b) => b.slug === item.slug);
    removeBookmark(item.slug);
    if (snapshot) {
      showToast(`${item.title} dihapus`, {
        actionLabel: "Urungkan",
        onAction: () => restoreBookmarks([snapshot]),
      });
    }
  } else {
    const snapshot = getHistory().filter((h) => h.slug === item.slug);
    removeHistory(item.slug);
    showToast(`${item.title} dihapus dari riwayat`, {
      actionLabel: "Urungkan",
      onAction: () => restoreHistory(snapshot),
    });
  }
};

// Folder assignment (drag & drop, bulk bar). One undo restores every slug.
export const assignBookmarksToFolder = (folder: string | undefined, slugs: string[]): void => {
  if (slugs.length === 0) return;
  const previous = getBookmarks()
    .filter((b) => slugs.includes(b.slug))
    .map((b) => ({ slug: b.slug, folder: b.folder ?? null }));
  for (const slug of slugs) updateBookmarkUserMeta(slug, { folder: folder ?? null });
  showToast(folder ? `${slugs.length} anime dipindah ke 📁 ${folder}` : `Folder dihapus dari ${slugs.length} anime`, {
    actionLabel: "Urungkan",
    onAction: () => {
      for (const entry of previous) updateBookmarkUserMeta(entry.slug, { folder: entry.folder });
    },
  });
};

// Deleting a collection keeps its anime (unassigned) and restores the exact
// registry order + members on undo.
export const removeCollection = (name: string): void => {
  const members = getBookmarks()
    .filter((item) => item.folder === name)
    .map((item) => item.slug);
  if (!window.confirm(`Hapus koleksi "${name}"? ${members.length} anime di dalamnya tetap tersimpan.`)) return;
  const order = getFolderOrder();
  removeCollectionName(name);
  for (const slug of members) updateBookmarkUserMeta(slug, { folder: null });
  setFolderOrder(order.filter((entry) => entry !== name));
  showToast(`Koleksi ${name} dihapus`, {
    actionLabel: "Urungkan",
    onAction: () => {
      mergeCollections([name]);
      for (const slug of members) updateBookmarkUserMeta(slug, { folder: name });
      setFolderOrder(order);
    },
  });
};

export const addBookmarksToQueue = (slugs: string[], onViewQueue?: () => void): number => {
  const items = getBookmarks()
    .filter((b) => slugs.includes(b.slug))
    .map((b) => ({ slug: b.slug, title: b.title, image: b.image }));
  const added = addToQueue(items);
  if (added === 0) {
    showToast("Semua pilihan sudah ada di antrean");
  } else if (onViewQueue) {
    showToast(`${added} anime masuk ke antrean tonton`, { actionLabel: "Lihat", onAction: onViewQueue });
  } else {
    showToast(`${added} anime masuk ke antrean tonton`);
  }
  return added;
};

export const exportBookmarksSubsetJson = (slugs: string[]): void => {
  const selected = getBookmarks().filter((b) => slugs.includes(b.slug));
  if (selected.length === 0) return;
  exportBookmarksJson(selected);
  showToast(`${selected.length} anime diekspor ke .json`);
};

export const exportBookmarksSubsetIcs = (slugs: string[]): void => {
  const selected = getBookmarks().filter((b) => slugs.includes(b.slug));
  if (selected.length === 0) return;
  const blob = new Blob(
    [
      buildWeeklyReminderIcs(
        selected.map((b) => ({
          title: `Cek episode baru: ${b.title}`,
          url: `${window.location.origin}/anime/${b.slug}`,
        })),
      ),
    ],
    { type: "text/calendar;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "kokunime-pengingat.ics";
  anchor.click();
  URL.revokeObjectURL(url);
  showToast(`${selected.length} pengingat mingguan diunduh (.ics)`);
};

export const setBookmarksRating = (slugs: string[], rating: number | null): void => {
  const previous = getBookmarks()
    .filter((b) => slugs.includes(b.slug))
    .map((b) => ({ slug: b.slug, rating: b.rating ?? null }));
  if (previous.length === 0) return;
  for (const entry of previous) updateBookmarkUserMeta(entry.slug, { rating });
  showToast(
    rating ? `${previous.length} anime diberi rating ${rating}/10` : `Rating ${previous.length} anime dihapus`,
    {
      actionLabel: "Urungkan",
      onAction: () => {
        for (const entry of previous) updateBookmarkUserMeta(entry.slug, { rating: entry.rating });
      },
    },
  );
};

// Returns true when something was removed (caller clears its selection then).
export const removeBookmarksSubset = (slugs: string[]): boolean => {
  const snapshot = getBookmarks().filter((b) => slugs.includes(b.slug));
  if (snapshot.length === 0) return false;
  if (!window.confirm(`Hapus ${snapshot.length} anime terpilih?`)) return false;
  const remaining = getBookmarks().filter((b) => !slugs.includes(b.slug));
  clearAllBookmarks();
  restoreBookmarks(remaining);
  showToast(`${snapshot.length} anime dihapus`, {
    actionLabel: "Urungkan",
    onAction: () => restoreBookmarks(snapshot),
  });
  return true;
};

export const removeHistoryDay = (timestamp: number): void => {
  const key = dayKey(timestamp);
  const snapshot = getHistory().filter((entry) => dayKey(entry.viewedAt) === key);
  if (snapshot.length === 0) return;
  for (const entry of snapshot) removeHistory(entry.slug);
  showToast(`${snapshot.length} riwayat dihapus`, {
    actionLabel: "Urungkan",
    onAction: () => restoreHistory(snapshot),
  });
};

export const copyBookmarksMarkdown = async (source: BookmarkItem[]): Promise<void> => {
  if (source.length === 0) return;
  const origin = window.location.origin;
  const lines = source.map((b) => {
    const bits = [
      b.rating ? ` ⭐ ${b.rating}/10` : "",
      b.folder ? ` 📁 ${b.folder}` : "",
      b.status ? ` (${b.status})` : "",
    ].join("");
    return `- [${b.title}](${origin}/anime/${b.slug})${bits}`;
  });
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    showToast(`${lines.length} judul disalin sebagai Markdown`);
  } catch {
    showToast("Gagal menyalin ke clipboard");
  }
};

export const importBookmarksFromFile = async (file: File): Promise<void> => {
  const count = await importBookmarksJson(file);
  alert(count > 0 ? `Berhasil mengimpor ${count} anime baru!` : "Semua anime dari file backup sudah ada di daftar.");
};

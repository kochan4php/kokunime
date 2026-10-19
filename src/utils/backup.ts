import { fnv1a } from "@/utils/hash";
import { STORAGE_KEYS } from "@/utils/storage-keys";
import { DEFAULT_SETTINGS, getStoredSettings, mergeSettings, saveSettings } from "@/utils/settings";

// Backup preview: parses the file, verifies the v2 checksum, and counts what a
// merge would add before anything touches localStorage. Legacy v1 files have
// no checksum and stay importable (marked "legacy").
export type BackupCollection =
  | "bookmarks"
  | "history"
  | "searches"
  | "queue"
  | "progress"
  | "episodeLog"
  | "collections"
  | "savedSearches";

interface BackupPreviewRow {
  key: BackupCollection;
  incoming: number;
  added: number;
}

export interface BackupPreview {
  text: string;
  encrypted: boolean;
  version: string;
  checksum: "ok" | "legacy";
  rows: BackupPreviewRow[];
}

type BackupPreviewResult = BackupPreview | { error: string };

export const isBackupError = (value: BackupPreviewResult): value is { error: string } => "error" in value;

interface BackupPayload {
  app?: unknown;
  version?: unknown;
  checksum?: unknown;
  settings?: unknown;
  bookmarks?: unknown;
  history?: unknown;
  searches?: unknown;
  queue?: unknown;
  progress?: unknown;
  episodeLog?: unknown;
  folderOrder?: unknown;
  collections?: unknown;
  tags?: unknown;
  savedSearches?: unknown;
}

const COLLECTION_STORAGE: { key: BackupCollection; storage: string }[] = [
  { key: "bookmarks", storage: STORAGE_KEYS.bookmarks },
  { key: "history", storage: STORAGE_KEYS.history },
  { key: "searches", storage: STORAGE_KEYS.recentSearches },
  { key: "queue", storage: STORAGE_KEYS.watchQueue },
  { key: "progress", storage: STORAGE_KEYS.progress },
  { key: "episodeLog", storage: STORAGE_KEYS.episodeLog },
  { key: "collections", storage: STORAGE_KEYS.collections },
  { key: "savedSearches", storage: STORAGE_KEYS.savedSearches },
];

const readList = (key: string): unknown[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const identity = (key: BackupCollection, item: unknown): string => {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";
  const value = item as Record<string, unknown>;
  if (key === "episodeLog") return `${String(value.slug)}:${String(value.episode)}`;
  if (key === "savedSearches") return String(value.id ?? value.query ?? "");
  return String(value.slug ?? value.url ?? JSON.stringify(item));
};

export const previewBackupText = (text: string): BackupPreviewResult => {
  try {
    const parsed = JSON.parse(text) as BackupPayload;
    if (!parsed || typeof parsed !== "object") return { error: "Berkas bukan JSON backup." };

    if (parsed.app === undefined && (parsed as { format?: unknown }).format === "kokunime-encrypted-backup") {
      return { text, encrypted: true, version: "1", checksum: "ok", rows: [] };
    }
    if (parsed.app !== "Kokunime") {
      return { error: "Bukan berkas backup Kokunime." };
    }

    let checksum: "ok" | "legacy" = "legacy";
    if (typeof parsed.checksum === "string") {
      const { checksum: claimed, ...content } = parsed as BackupPayload & { checksum: string };
      if (fnv1a(JSON.stringify(content)) !== claimed) {
        return { error: "Checksum tidak cocok — berkas rusak atau sudah diubah." };
      }
      checksum = "ok";
    }

    const rows: BackupPreviewRow[] = COLLECTION_STORAGE.map(({ key, storage }) => {
      const incoming = Array.isArray(parsed[key]) ? parsed[key] : [];
      const current = new Set(readList(storage).map((item) => identity(key, item)));
      const added = incoming.filter((item) => item !== null && !current.has(identity(key, item))).length;
      return { key, incoming: incoming.length, added };
    });

    return {
      text,
      encrypted: false,
      version: typeof parsed.version === "string" ? parsed.version : "1.0.0",
      checksum,
      rows,
    };
  } catch {
    return { error: "Berkas bukan JSON yang valid." };
  }
};

export type BackupImportMode = "merge" | "replace";

const BACKUP_VERSION = "2.0.0";

export const exportAllAppData = (): string => {
  if (typeof window === "undefined") return "{}";
  const payload = {
    app: "Kokunime",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: getStoredSettings(),
    bookmarks: JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarks) || "[]"),
    history: JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || "[]"),
    searches: JSON.parse(localStorage.getItem(STORAGE_KEYS.recentSearches) || "[]"),
    queue: JSON.parse(localStorage.getItem(STORAGE_KEYS.watchQueue) || "[]"),
    progress: JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || "[]"),
    episodeLog: JSON.parse(localStorage.getItem(STORAGE_KEYS.episodeLog) || "[]"),
    folderOrder: JSON.parse(localStorage.getItem(STORAGE_KEYS.folderOrder) || "[]"),
    collections: JSON.parse(localStorage.getItem(STORAGE_KEYS.collections) || "[]"),
    tags: JSON.parse(localStorage.getItem(STORAGE_KEYS.tags) || "{}"),
    savedSearches: JSON.parse(localStorage.getItem(STORAGE_KEYS.savedSearches) || "[]"),
  };
  return JSON.stringify({ ...payload, checksum: fnv1a(JSON.stringify(payload)) }, null, 2);
};

const recordOf = (item: unknown): Record<string, unknown> =>
  item && typeof item === "object" ? (item as Record<string, unknown>) : {};
const slugIdentity = (item: unknown): string => String(recordOf(item).slug ?? JSON.stringify(item));
const markIdentity = (item: unknown): string => {
  const record = recordOf(item);
  return `${String(record.slug)}:${String(record.episode)}`;
};
const savedSearchIdentity = (item: unknown): string => {
  const record = recordOf(item);
  return String(record.id ?? record.query ?? JSON.stringify(item));
};

// Import is transactional: the whole current profile is snapshotted first, so
// a quota error mid-write restores every key instead of leaving a half-merged
// state (all mutations in this app are local-first, there is no network queue).
export const importAllAppData = (jsonString: string, mode: BackupImportMode = "replace"): boolean => {
  if (typeof window === "undefined") return false;
  const keys = [
    STORAGE_KEYS.userSettings,
    STORAGE_KEYS.bookmarks,
    STORAGE_KEYS.history,
    STORAGE_KEYS.recentSearches,
    STORAGE_KEYS.watchQueue,
    STORAGE_KEYS.progress,
    STORAGE_KEYS.episodeLog,
    STORAGE_KEYS.folderOrder,
    STORAGE_KEYS.collections,
    STORAGE_KEYS.tags,
    STORAGE_KEYS.savedSearches,
  ];
  const snapshot = new Map<string, string | null>(keys.map((key) => [key, localStorage.getItem(key)]));

  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") return false;
    if (parsed.app !== undefined && parsed.app !== "Kokunime") return false;
    if (typeof parsed.checksum === "string") {
      const { checksum: claimed, ...content } = parsed as { checksum: string } & Record<string, unknown>;
      if (fnv1a(JSON.stringify(content)) !== claimed) return false;
    }

    const writeArray = (key: string, value: unknown, identity?: (item: unknown) => string): void => {
      if (!Array.isArray(value)) return;
      if (mode === "replace" || !identity) {
        localStorage.setItem(key, JSON.stringify(value));
        return;
      }
      const merged = new Map<string, unknown>();
      for (const item of readList(key)) merged.set(identity(item), item);
      for (const item of value) {
        if (typeof item === "string" || (item && typeof item === "object")) {
          merged.set(identity(item), item);
        }
      }
      localStorage.setItem(key, JSON.stringify([...merged.values()]));
    };
    const writeObject = (key: string, value: unknown): void => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return;
      const current =
        mode === "merge" ? (JSON.parse(localStorage.getItem(key) || "{}") as Record<string, unknown>) : {};
      localStorage.setItem(key, JSON.stringify({ ...current, ...(value as Record<string, unknown>) }));
    };

    writeArray(STORAGE_KEYS.bookmarks, parsed.bookmarks, slugIdentity);
    writeArray(STORAGE_KEYS.history, parsed.history, slugIdentity);
    writeArray(STORAGE_KEYS.recentSearches, parsed.searches, (item) => String(item));
    writeArray(STORAGE_KEYS.watchQueue, parsed.queue, slugIdentity);
    writeArray(STORAGE_KEYS.progress, parsed.progress, slugIdentity);
    writeArray(STORAGE_KEYS.episodeLog, parsed.episodeLog, markIdentity);
    writeArray(STORAGE_KEYS.folderOrder, parsed.folderOrder, (item) => String(item));
    writeArray(STORAGE_KEYS.collections, parsed.collections, (item) => String(item));
    writeArray(STORAGE_KEYS.savedSearches, parsed.savedSearches, savedSearchIdentity);
    writeObject(STORAGE_KEYS.tags, parsed.tags);

    if (parsed.settings) {
      if (mode === "replace") saveSettings(DEFAULT_SETTINGS);
      mergeSettings(parsed.settings);
    }

    window.dispatchEvent(new Event("storage"));
    return true;
  } catch {
    for (const [key, value] of snapshot) {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        // Nothing more to restore: keep the remaining keys.
      }
    }
    return false;
  }
};

// Last five palette commands, most recent first. Only ids are stored; the
// action list itself stays in code so labels can change safely.
import { STORAGE_KEYS } from "@/utils/storage-keys";

const STORAGE_KEY = STORAGE_KEYS.paletteHistory;
const MAX_RECENT = 5;

export const getRecentCommands = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string").slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
};

export const recordCommand = (id: string): void => {
  if (typeof window === "undefined" || !id) return;
  try {
    const next = [id, ...getRecentCommands().filter((value) => value !== id)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / quota: history is a convenience, never a failure.
  }
};

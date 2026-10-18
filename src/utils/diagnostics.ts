import { STORAGE_KEYS } from "./storage-keys";

// Client-only ring buffer of what just happened on this device: errors, web
// vitals summaries, service-worker events and cache tiers. It powers /status
// ("Diagnostik perangkat ini") and rides along with error reports so support
// sees context. Everything is scrubbed and capped — never anything a visitor
// typed, never secrets.
type DiagnosticType = "error" | "vital" | "sw" | "nav" | "cache";

export interface DiagnosticEntry {
  at: number;
  type: DiagnosticType;
  detail: string;
}

const TYPES: DiagnosticType[] = ["error", "vital", "sw", "nav", "cache"];
export const MAX_ENTRIES = 60;
const MAX_DETAIL_CHARS = 160;
const STORAGE_KEY = STORAGE_KEYS.diagnostics;

let entries: DiagnosticEntry[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

const emit = (): void => {
  for (const listener of listeners) listener();
};

export const scrubDiagnostic = (value: string): string =>
  value
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email]")
    .replace(/([?&](?:token|key|secret|password|access_token|apikey)=)[^&\s]+/gi, "$1[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, "Bearer [redacted]")
    .replace(/\b[a-f0-9]{32,}\b/gi, "[hash]");

const isEntry = (value: unknown): value is DiagnosticEntry => {
  const entry = value as DiagnosticEntry | null;
  return (
    Boolean(entry) &&
    typeof entry?.at === "number" &&
    Number.isFinite(entry.at) &&
    typeof entry.detail === "string" &&
    TYPES.includes(entry.type)
  );
};

const readStorage = (): DiagnosticEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(-MAX_ENTRIES) : [];
  } catch {
    return [];
  }
};

const persist = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or blocked: diagnostics are best-effort, never fatal.
  }
};

export const getDiagnostics = (): DiagnosticEntry[] => {
  if (!hydrated) {
    entries = readStorage();
    hydrated = true;
  }
  return entries;
};

export const recordDiagnostic = (type: DiagnosticType, detail: string): void => {
  if (typeof window === "undefined") return;
  const entry: DiagnosticEntry = {
    at: Date.now(),
    type,
    detail: scrubDiagnostic(detail).slice(0, MAX_DETAIL_CHARS),
  };
  entries = [...getDiagnostics(), entry].slice(-MAX_ENTRIES);
  persist();
  emit();
};

export const clearDiagnostics = (): void => {
  entries = [];
  hydrated = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Non-fatal by design.
    }
  }
  emit();
};

export const subscribeDiagnostics = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Plain text for the "Salin diagnostik" button and for error reports.
export const formatDiagnostics = (): string => {
  const all = getDiagnostics();
  const counts = TYPES.map((type) => `${type}=${all.filter((entry) => entry.type === type).length}`).join(" ");
  const lines = [
    `Kokunime diagnostics ${new Date().toISOString()}`,
    `build=${process.env.NEXT_PUBLIC_BUILD_ID ?? "dev"}`,
    `route=${typeof location !== "undefined" ? `${location.pathname}${location.search}` : "-"}`,
    `online=${typeof navigator !== "undefined" ? navigator.onLine : "-"}`,
    `sw=${typeof navigator !== "undefined" && navigator.serviceWorker?.controller ? "controlled" : "uncontrolled"}`,
    `counts: ${counts}`,
    ...all.slice(-40).map((entry) => `${new Date(entry.at).toISOString()} [${entry.type}] ${entry.detail}`),
  ];
  return lines.join("\n");
};

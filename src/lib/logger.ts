import { appendFileSync, existsSync, renameSync, rmSync, statSync } from "node:fs";
import { currentRequestId } from "./request-context";
import { recordSlowRequest, SLOW_REQUEST_MS } from "./slow-log";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

// LOG_LEVEL=debug|info|warn|error (default info); unknown values fall back.
const currentLevel = (): number =>
  LEVEL_ORDER[(process.env.LOG_LEVEL ?? "").trim().toLowerCase() as LogLevel] ?? LEVEL_ORDER.info;

// Never let tokens/secrets/passwords reach the log shipper, however deep they
// sit in a fields object.
const SENSITIVE_KEY = /token|authorization|secret|password|cookie|api[-_]?key/i;

const redact = (value: unknown, depth = 0): unknown => {
  if (value === null || typeof value !== "object" || depth > 2) return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => redact(item, depth + 1));
  const output: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    output[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : redact(nested, depth + 1);
  }
  return output;
};

// Size-based rotation for the optional file sink: LOG_FILE + LOG_MAX_BYTES
// (default 5MB, keeps .1-.3). Console always gets the line first; serverless
// deployments simply never set LOG_FILE.
const rotateIfNeeded = (file: string, incomingBytes: number): void => {
  const maxBytes = Number(process.env.LOG_MAX_BYTES ?? 5 * 1024 * 1024);
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) return;
  if (!existsSync(file) || statSync(file).size + incomingBytes <= maxBytes) return;

  if (existsSync(`${file}.3`)) rmSync(`${file}.3`);
  for (const suffix of [".2", ".1"] as const) {
    const source = `${file}${suffix}`;
    if (existsSync(source)) renameSync(source, `${file}${suffix === ".2" ? ".3" : ".2"}`);
  }
  renameSync(file, `${file}.1`);
};

const writeLine = (line: string, level: LogLevel): void => {
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  // biome-ignore lint/suspicious/noConsoleLog: single JSON log line is the intended stdout sink.
  else console.log(line);

  const file = process.env.LOG_FILE?.trim();
  if (!file) return;
  try {
    rotateIfNeeded(file, line.length + 1);
    appendFileSync(file, `${line}\n`);
  } catch {
    // File sink is best-effort — console already has the line.
  }
};

// Single-line JSON logs so log shippers can parse them without a logging
// dependency. Shape is stable: ts, level, msg, then arbitrary fields.
export function logJson(level: LogLevel, msg: string, fields?: Record<string, unknown>): void {
  if (LEVEL_ORDER[level] < currentLevel()) return;
  const merged: Record<string, unknown> = { ...(fields ? (redact(fields) as Record<string, unknown>) : {}) };

  // Correlation id flows from the route handler (runWithRequestId) into every
  // log line — including scraper/cache logs — without signature changes.
  const requestId = currentRequestId();
  if (requestId !== undefined && merged.requestId === undefined) merged.requestId = requestId;

  // Slow-path capture: any event that reports duration_ms over the threshold
  // lands in the /api/admin/slow ring buffer.
  const durationMs = merged.duration_ms;
  if (typeof durationMs === "number" && durationMs >= SLOW_REQUEST_MS) {
    recordSlowRequest({
      at: new Date().toISOString(),
      event: msg,
      durationMs,
      requestId: typeof merged.requestId === "string" ? merged.requestId : undefined,
      path: typeof merged.path === "string" ? merged.path : undefined,
    });
  }

  writeLine(JSON.stringify({ ts: new Date().toISOString(), level, msg, ...merged }), level);
}

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

// Single-line JSON logs so log shippers can parse them without a logging
// dependency. Shape is stable: ts, level, msg, then arbitrary fields.
export function logJson(level: LogLevel, msg: string, fields?: Record<string, unknown>): void {
  if (LEVEL_ORDER[level] < currentLevel()) return;
  const safeFields = fields ? (redact(fields) as Record<string, unknown>) : undefined;
  const line = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...safeFields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

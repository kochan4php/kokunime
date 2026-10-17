type LogLevel = "debug" | "info" | "warn" | "error";

// Single-line JSON logs so log shippers can parse them without a logging
// dependency. Shape is stable: ts, level, msg, then arbitrary fields.
export function logJson(level: LogLevel, msg: string, fields?: Record<string, unknown>): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

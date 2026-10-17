// Boot-time env validation. Returns a list of issues instead of throwing: a
// typo in an optional var must warn loudly, never take the server down.
interface EnvIssue {
  level: "error" | "warn";
  key: string;
  message: string;
}

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isRedisUrl = (value: string): boolean => value.startsWith("redis://") || value.startsWith("rediss://");

export const validateEnv = (env: Record<string, string | undefined> = process.env): EnvIssue[] => {
  const issues: EnvIssue[] = [];
  const get = (key: string): string => env[key]?.trim() ?? "";

  const siteUrl = get("NEXT_PUBLIC_SITE_URL");
  if (siteUrl && !isHttpUrl(siteUrl)) {
    issues.push({
      level: "error",
      key: "NEXT_PUBLIC_SITE_URL",
      message: "harus URL http(s) absolut, contoh https://kokunime.example",
    });
  }

  const redisUrl = get("REDIS_URL");
  if (redisUrl && !isRedisUrl(redisUrl)) {
    issues.push({ level: "error", key: "REDIS_URL", message: "harus diawali redis:// atau rediss://" });
  }

  for (const key of ["ERROR_WEBHOOK_URL", "DISCORD_WEBHOOK_URL", "ALERT_WEBHOOK_URL"]) {
    const value = get(key);
    if (value && !isHttpUrl(value)) {
      issues.push({ level: "warn", key, message: "webhook sebaiknya URL http(s) absolut" });
    }
  }

  // Admin/metrics tokens are a pair; half a pair is nearly always a mistake.
  const admin = get("ADMIN_TOKEN");
  const metrics = get("METRICS_TOKEN");
  if (Boolean(admin) !== Boolean(metrics)) {
    issues.push({
      level: "warn",
      key: "ADMIN_TOKEN/METRICS_TOKEN",
      message: "sebaiknya diisi berpasangan — set keduanya atau tidak sama sekali",
    });
  }
  for (const key of ["ADMIN_TOKEN", "METRICS_TOKEN"] as const) {
    const value = get(key);
    if (value && value.length < 16) {
      issues.push({ level: "warn", key, message: "token pendek (<16 karakter) — pakai nilai acak yang panjang" });
    }
  }

  return issues;
};

import { dispatchDiscordWebhook } from "./webhook-dispatcher";

export interface ErrorReport {
  source: "server" | "client";
  message: string;
  digest?: string;
  path?: string;
  method?: string;
  route?: string;
}

// Per-fingerprint throttle: a crash loop must not spam the webhook. Suppressed
// occurrences are counted and attached to the next report for that fingerprint.
const THROTTLE_MS = 10 * 60_000;
const MAX_FINGERPRINTS = 200;
const lastSent = new Map<string, number>();
const suppressed = new Map<string, number>();

const truncate = (value: string, max: number): string => (value.length > max ? `${value.slice(0, max)}…` : value);

export async function reportError(report: ErrorReport): Promise<boolean> {
  const webhook = process.env.ERROR_WEBHOOK_URL?.trim();
  if (!webhook) return false;

  const fingerprint = `${report.source}:${report.path ?? ""}:${truncate(report.message, 120)}`;
  const now = Date.now();
  const last = lastSent.get(fingerprint);
  if (last && now - last < THROTTLE_MS) {
    suppressed.set(fingerprint, (suppressed.get(fingerprint) ?? 0) + 1);
    return false;
  }
  if (lastSent.size >= MAX_FINGERPRINTS) lastSent.clear();
  const suppressedCount = suppressed.get(fingerprint) ?? 0;
  suppressed.delete(fingerprint);
  lastSent.set(fingerprint, now);

  const fields = [
    { name: "Sumber", value: report.source === "client" ? "Client" : "Server", inline: true },
    ...(report.method ? [{ name: "Method", value: truncate(report.method, 10), inline: true }] : []),
    ...(report.route ? [{ name: "Route", value: truncate(report.route, 150), inline: true }] : []),
    ...(report.path ? [{ name: "Path", value: truncate(report.path, 200), inline: true }] : []),
    ...(report.digest ? [{ name: "Digest", value: truncate(report.digest, 100), inline: true }] : []),
    ...(suppressedCount > 0
      ? [{ name: "Suppressed", value: `${suppressedCount}x dalam 10 menit terakhir`, inline: true }]
      : []),
  ];

  return dispatchDiscordWebhook(webhook, {
    title: "Kokunime Error",
    description: truncate(report.message, 800),
    color: 0xef4444,
    fields,
  });
}

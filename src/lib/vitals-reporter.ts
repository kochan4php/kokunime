import { dispatchDiscordWebhook } from "./webhook-dispatcher";

// "Poor" thresholds (web.dev). Only values ABOVE these are forwarded — good
// numbers stay in the browser, so the webhook remains a signal, not noise.
export const VITALS_THRESHOLDS = {
  LCP: 2500,
  CLS: 0.1,
  INP: 200,
  FCP: 1800,
  TTFB: 800,
} as const;

export type VitalName = keyof typeof VITALS_THRESHOLDS;

export interface VitalsReport {
  name: VitalName;
  value: number;
  path: string;
  deviceType?: string;
}

// Per (metric + path) throttle: a slow route must alert once, not per sample.
const THROTTLE_MS = 10 * 60_000;
const MAX_FINGERPRINTS = 200;
const lastSent = new Map<string, number>();

export async function reportVitals(report: VitalsReport): Promise<boolean> {
  const webhook = process.env.ERROR_WEBHOOK_URL?.trim();
  if (!webhook) return false;
  if (!(report.value > VITALS_THRESHOLDS[report.name])) return false;

  const fingerprint = `${report.name}:${report.path}`;
  const now = Date.now();
  const last = lastSent.get(fingerprint);
  if (last && now - last < THROTTLE_MS) return false;
  if (lastSent.size >= MAX_FINGERPRINTS) lastSent.clear();
  lastSent.set(fingerprint, now);

  const shown = report.name === "CLS" ? report.value.toFixed(3) : `${Math.round(report.value)} ms`;
  return dispatchDiscordWebhook(webhook, {
    title: `Web Vitals: ${report.name} lambat`,
    description: `${report.name} = ${shown} pada ${report.path} (ambang batas ${VITALS_THRESHOLDS[report.name]}).`,
    color: 0xf59e0b,
    fields: [
      { name: "Path", value: report.path.slice(0, 200), inline: true },
      ...(report.deviceType ? [{ name: "Device", value: report.deviceType.slice(0, 20), inline: true }] : []),
    ],
  });
}

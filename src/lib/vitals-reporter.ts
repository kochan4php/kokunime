import { VITALS_THRESHOLDS, type VitalName } from "./vitals-thresholds";
import { dispatchDiscordWebhook } from "./webhook-dispatcher";
import { incrementMetric } from "./metrics";

// "Poor" thresholds (web.dev). Only values ABOVE these are forwarded — good
// numbers stay in the browser, so the webhook remains a signal, not noise.
export { VITALS_THRESHOLDS };
export type { VitalName };

interface VitalsReport {
  name: VitalName;
  value: number;
  path: string;
  deviceType?: string | undefined;
}

interface VitalsSummaryRow {
  name: VitalName;
  path: string;
  count: number;
  p50: number;
  p75: number;
  max: number;
}

// Last SAMPLE_WINDOW values per (metric, path) feed the p50/p75 admin view.
// Bounded by MAX_SERIES so a flood of random paths cannot grow memory.
const SAMPLE_WINDOW = 200;
const MAX_SERIES = 300;
const samples = new Map<string, number[]>();

const recordSample = (name: VitalName, path: string, value: number): void => {
  const key = `${name}:${path}`;
  const bucket = samples.get(key);
  if (bucket) {
    bucket.push(value);
    if (bucket.length > SAMPLE_WINDOW) bucket.shift();
    return;
  }
  if (samples.size >= MAX_SERIES) return;
  samples.set(key, [value]);
};

// Nearest-rank percentile (ceil(p*n)-1), clamped for tiny sample counts.
const percentile = (sorted: number[], p: number): number => {
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1));
  return sorted[index] ?? 0;
};

export const getVitalsSummary = (): VitalsSummaryRow[] => {
  const rows: VitalsSummaryRow[] = [];
  for (const [key, values] of samples) {
    if (values.length === 0) continue;
    const name = key.slice(0, key.indexOf(":")) as VitalName;
    const sorted = [...values].sort((a, b) => a - b);
    rows.push({
      name,
      path: key.slice(name.length + 1),
      count: sorted.length,
      p50: percentile(sorted, 0.5),
      p75: percentile(sorted, 0.75),
      max: sorted[sorted.length - 1] ?? 0,
    });
  }
  return rows.sort((a, b) => b.p75 - a.p75);
};

// Tests only — production code never clears mid-process.
export const resetVitalsSamples = (): void => samples.clear();

// Per (metric + path) throttle: a slow route must alert once, not per sample.
const THROTTLE_MS = 10 * 60_000;
const MAX_FINGERPRINTS = 200;
const lastSent = new Map<string, number>();

export async function reportVitals(report: VitalsReport): Promise<boolean> {
  // Every accepted sample lands in the p75 ring buffer first; the webhook gate
  // below only decides whether it also becomes an alert.
  recordSample(report.name, report.path, report.value);

  const webhook = process.env.ERROR_WEBHOOK_URL?.trim();
  if (!webhook) return false;
  if (!(report.value > VITALS_THRESHOLDS[report.name])) return false;
  incrementMetric(`vitals_poor_${report.name.toLowerCase()}`);

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

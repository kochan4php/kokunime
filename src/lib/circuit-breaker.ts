import { incrementMetric } from "./metrics";

export type CircuitState = "closed" | "open" | "half-open";

const FAILURE_THRESHOLD = 5;
const BASE_COOLDOWN_MS = 30_000;
const MAX_COOLDOWN_MS = 5 * 60_000;
// A half-open probe that never settles (hung socket) must not block all
// traffic forever — after this window another probe may start.
const PROBE_TIMEOUT_MS = 15_000;

interface BreakerEntry {
  failures: number;
  openedAt: number;
  cooldownMs: number;
  probeInFlight: boolean;
  probeStartedAt: number;
}

const breakers = new Map<string, BreakerEntry>();

const entryFor = (key: string): BreakerEntry => {
  const existing = breakers.get(key);
  if (existing) return existing;
  const entry: BreakerEntry = {
    failures: 0,
    openedAt: 0,
    cooldownMs: BASE_COOLDOWN_MS,
    probeInFlight: false,
    probeStartedAt: 0,
  };
  breakers.set(key, entry);
  return entry;
};

const isOpen = (entry: BreakerEntry): boolean => entry.failures >= FAILURE_THRESHOLD;

// Fast-fail gate: false means "do not hit the upstream right now". When the
// cooldown has elapsed exactly one probe request is let through (half-open).
export function canRequest(key: string, now = Date.now()): boolean {
  const entry = breakers.get(key);
  if (!entry || !isOpen(entry)) return true;
  if (now - entry.openedAt < entry.cooldownMs) return false;
  if (entry.probeInFlight && now - entry.probeStartedAt < PROBE_TIMEOUT_MS) return false;
  entry.probeInFlight = true;
  entry.probeStartedAt = now;
  return true;
}

export function recordSuccess(key: string): void {
  const entry = breakers.get(key);
  if (!entry) return;
  if (isOpen(entry)) incrementMetric("circuit_recovered");
  entry.failures = 0;
  entry.cooldownMs = BASE_COOLDOWN_MS;
  entry.probeInFlight = false;
}

export function recordFailure(key: string, now = Date.now()): void {
  const entry = entryFor(key);
  entry.probeInFlight = false;
  entry.failures += 1;
  if (entry.failures >= FAILURE_THRESHOLD) {
    if (entry.failures === FAILURE_THRESHOLD) incrementMetric("circuit_open");
    entry.openedAt = now;
    entry.cooldownMs = Math.min(entry.cooldownMs * 2, MAX_COOLDOWN_MS);
  }
}

export function getCircuitState(key: string, now = Date.now()): CircuitState {
  const entry = breakers.get(key);
  if (!entry || !isOpen(entry)) return "closed";
  return now - entry.openedAt >= entry.cooldownMs ? "half-open" : "open";
}

// Tests only.
export const resetCircuits = (): void => breakers.clear();

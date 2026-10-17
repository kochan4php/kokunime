import { redisCounterValue, redisRateLimit } from "@/lib/redis";

// Daily uptime rollup: every /api/status probe bumps a per-day counter pair
// (probes + failures) with a fixed-window TTL, so the rollup survives
// restarts and needs no cron job on our side. Redis-off deployments get null
// percentages instead of fake 100%s.
const DAY_MS = 24 * 60 * 60 * 1000;
// Slightly over a day so "today" survives until every rollup reader has seen it.
const TTL_MS = 26 * 60 * 60 * 1000;
const SLO_PCT = 99.5;

interface UptimeDay {
  date: string;
  probes: number;
  failures: number;
  uptime_pct: number | null;
}

interface ErrorBudget {
  slo_pct: number;
  probes: number;
  failures: number;
  uptime_pct: number | null;
  allowed_failures: number;
  consumed_pct: number | null;
}

const dayKey = (date: Date): string => date.toISOString().slice(0, 10);

export const recordUptimeProbe = async (ok: boolean): Promise<void> => {
  const day = dayKey(new Date());
  await Promise.allSettled([
    redisRateLimit(`uptime-probe-${day}`, TTL_MS),
    ...(ok ? [] : [redisRateLimit(`uptime-fail-${day}`, TTL_MS)]),
  ]);
};

// Newest day first. `uptime_pct` is null when no probe was recorded (Redis off
// or the day has no data).
export const getUptimeRollup = async (days = 14): Promise<UptimeDay[]> => {
  const now = Date.now();
  return Promise.all(
    Array.from({ length: days }, async (_, index) => {
      const date = dayKey(new Date(now - index * DAY_MS));
      const [probes, failures] = await Promise.all([
        redisCounterValue(`uptime-probe-${date}`),
        redisCounterValue(`uptime-fail-${date}`),
      ]);
      const probeCount = probes ?? 0;
      const failureCount = failures ?? 0;
      const uptime_pct = probeCount > 0 ? Math.round(((probeCount - failureCount) / probeCount) * 10_000) / 100 : null;
      return { date, probes: probeCount, failures: failureCount, uptime_pct };
    }),
  );
};

// SLO 99.5% → 0.5% of probes may fail. consumed_pct = how much of that budget
// the window already burned (100 = exhausted, >100 clamped).
export const getErrorBudget = (rollup: UptimeDay[]): ErrorBudget => {
  const probes = rollup.reduce((sum, day) => sum + day.probes, 0);
  const failures = rollup.reduce((sum, day) => sum + day.failures, 0);
  const allowed = Math.floor(probes * ((100 - SLO_PCT) / 100));
  const consumed_pct =
    probes === 0 ? null : allowed > 0 ? Math.min(100, (failures / allowed) * 100) : failures > 0 ? 100 : 0;
  return {
    slo_pct: SLO_PCT,
    probes,
    failures,
    uptime_pct: probes > 0 ? Math.round(((probes - failures) / probes) * 10_000) / 100 : null,
    allowed_failures: allowed,
    consumed_pct,
  };
};

// Process-local counters + histograms backing /api/metrics. Per-instance by
// design: Prometheus-style scraping sums matching series across instances.
import { monitorEventLoopDelay } from "node:perf_hooks";

const counters = new Map<string, number>();

// Prometheus-style latency buckets in milliseconds (last bucket = +Inf).
export const HISTOGRAM_BUCKETS = [50, 100, 250, 500, 1000, 2500, 5000, 10_000] as const;

interface HistogramState {
  // Length = HISTOGRAM_BUCKETS.length + 1 (the +Inf bucket).
  bucketCounts: number[];
  sum: number;
  count: number;
}

export type { HistogramState };

const histograms = new Map<string, HistogramState>();

export const incrementMetric = (name: string, by = 1): void => {
  if (!Number.isFinite(by) || by === 0) return;
  counters.set(name, (counters.get(name) ?? 0) + by);
};

export const getMetrics = (): Record<string, number> => Object.fromEntries(counters);

export const observeHistogram = (name: string, valueMs: number): void => {
  if (!Number.isFinite(valueMs) || valueMs < 0) return;
  const state = histograms.get(name) ?? {
    bucketCounts: new Array(HISTOGRAM_BUCKETS.length + 1).fill(0),
    sum: 0,
    count: 0,
  };
  let index = HISTOGRAM_BUCKETS.findIndex((bound) => valueMs <= bound);
  if (index === -1) index = HISTOGRAM_BUCKETS.length;
  state.bucketCounts[index] += 1;
  state.sum += valueMs;
  state.count += 1;
  histograms.set(name, state);
};

export const getHistograms = (): Record<string, HistogramState> => Object.fromEntries(histograms);

// Bucket-approximated quantile (upper bound of the bucket the quantile lands
// in): enough for p50/p95 gauges without an HDR-histogram dependency.
export const getHistogramQuantile = (state: HistogramState, quantile: number): number => {
  if (state.count === 0) return 0;
  const target = Math.ceil(state.count * quantile);
  let cumulative = 0;
  for (let index = 0; index < state.bucketCounts.length; index++) {
    cumulative += state.bucketCounts[index] ?? 0;
    if (cumulative >= target) {
      return index < HISTOGRAM_BUCKETS.length
        ? (HISTOGRAM_BUCKETS[index] ?? Number.POSITIVE_INFINITY)
        : Number.POSITIVE_INFINITY;
    }
  }
  return Number.POSITIVE_INFINITY;
};

// Tests only — production code never resets metrics mid-process.
export const resetMetrics = (): void => {
  counters.clear();
  histograms.clear();
};

// Event-loop saturation gauge for /api/metrics: mean + p99 delay in ms.
// The monitor starts on first read, so importing this module stays cheap.
let loopMonitor: ReturnType<typeof monitorEventLoopDelay> | null = null;

export const getEventLoopLagMs = (): { mean: number; p99: number } | null => {
  try {
    loopMonitor ??= monitorEventLoopDelay({ resolution: 20 });
    loopMonitor.enable();
    if (!Number.isFinite(loopMonitor.mean)) return null;
    return { mean: loopMonitor.mean / 1e6, p99: loopMonitor.percentile(99) / 1e6 };
  } catch {
    return null;
  }
};

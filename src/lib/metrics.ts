// Process-local counters + histograms backing /api/metrics. Per-instance by
// design: Prometheus-style scraping sums matching series across instances.
const counters = new Map<string, number>();

// Prometheus-style latency buckets in milliseconds (last bucket = +Inf).
export const HISTOGRAM_BUCKETS = [50, 100, 250, 500, 1000, 2500, 5000, 10_000] as const;

interface HistogramState {
  // Length = HISTOGRAM_BUCKETS.length + 1 (the +Inf bucket).
  bucketCounts: number[];
  sum: number;
  count: number;
}

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

// Tests only — production code never resets metrics mid-process.
export const resetMetrics = (): void => {
  counters.clear();
  histograms.clear();
};

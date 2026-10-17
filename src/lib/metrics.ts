// Process-local counters backing /api/metrics. Per-instance by design:
// Prometheus-style scraping sums matching series across instances/replicas.
const counters = new Map<string, number>();

export const incrementMetric = (name: string, by = 1): void => {
  if (!Number.isFinite(by) || by === 0) return;
  counters.set(name, (counters.get(name) ?? 0) + by);
};

export const getMetrics = (): Record<string, number> => Object.fromEntries(counters);

// Tests only — production code never resets counters mid-process.
export const resetMetrics = (): void => {
  counters.clear();
};

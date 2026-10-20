// Shared client/server web-vitals thresholds ("poor" cut-offs, web.dev).
// Lives outside vitals-reporter so the client bundle can compare against the
// same numbers without pulling server-only deps (webhook, metrics).
export const VITALS_THRESHOLDS = {
  LCP: 2500,
  CLS: 0.1,
  INP: 200,
  FCP: 1800,
  TTFB: 800,
  // LoAF has no web.dev "poor" cut-off; 200ms is our alert threshold.
  LoAF: 200,
} as const;

export type VitalName = keyof typeof VITALS_THRESHOLDS;

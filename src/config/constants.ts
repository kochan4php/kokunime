// Central tuning knobs shared across layers: cache TTLs (seconds) and the
// public-API rate-limit budgets (requests per 60s window, keyed per IP).
export const CACHE_TTL_SECONDS = {
  home: 10 * 60,
  list: 10 * 60,
  detail: 30 * 60,
  genres: 2 * 60 * 60,
  seasons: 2 * 60 * 60,
  search: 5 * 60,
  recommendations: 30 * 60,
} as const;

export const RATE_LIMIT_WINDOW_MS = 60_000;

export const RATE_LIMITS = {
  animeBulk: 30,
  graphql: 60,
  recommend: 30,
  cspReport: 30,
  reportError: 10,
  reportVitals: 30,
  search: 60,
  suggest: 120,
  trackView: 120,
} as const;

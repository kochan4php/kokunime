const MAX_HITS = 60;
const WINDOW_MS = 60 * 1000;

const hits = new Map<string, number[]>();

export const rateLimit = (key: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
};

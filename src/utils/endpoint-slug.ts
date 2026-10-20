export const endpointSlug = (endpoint: string | undefined, prefix: string): string | null => {
  if (!endpoint) return null;
  let clean = endpoint.replace(/^https?:\/\/[^/]+\//i, "").replace(/^\/+/, "");
  const prefixRegex = new RegExp(`^${prefix}\\/`, "i");
  clean = clean.replace(prefixRegex, "");
  clean = clean.replace(/\/+$/, "").trim();
  return clean || null;
};

export const animeSlug = (endpoint: string | undefined): string | null => {
  if (!endpoint) return null;
  const clean = endpoint
    .replace(/^https?:\/\/[^/]+\//i, "")
    .replace(/^\/+|\/+$/g, "")
    .trim();
  return clean || null;
};

// Trust-boundary check for values that get concatenated into upstream URLs or
// stored as slugs: single path segment, no separators, quotes, or whitespace.
export const isSafeSlug = (value: string): boolean => /^[a-z0-9][a-z0-9_-]{0,159}$/i.test(value);

// Decode + lowercase + validate in one step; null means "reject before fetch".
export const normalizeSlug = (value: string): string | null => {
  try {
    const clean = decodeURIComponent(value).trim().toLowerCase();
    return isSafeSlug(clean) ? clean : null;
  } catch {
    return null;
  }
};

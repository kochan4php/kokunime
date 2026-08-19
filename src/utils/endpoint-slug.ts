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
  const clean = endpoint.replace(/^https?:\/\/[^/]+\//i, "").replace(/^\/+|\/+$/g, "").trim();
  return clean || null;
};

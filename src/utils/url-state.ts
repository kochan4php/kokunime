export type UrlStateValues = Record<string, string>;

export interface UrlStateSchema {
  defaults: UrlStateValues;
  /** Rejects bad input: return null to fall back to the default for that key. */
  sanitize?: (key: string, value: string) => string | null;
}

// Adoption: URL values are user input, so they pass through the schema's
// sanitizer and unknown/invalid values fall back to their defaults.
export const readUrlState = (search: string, schema: UrlStateSchema): UrlStateValues => {
  const params = new URLSearchParams(search);
  const next: UrlStateValues = { ...schema.defaults };
  for (const key of Object.keys(schema.defaults)) {
    const raw = params.get(key);
    if (raw === null) continue;
    const clean = schema.sanitize ? schema.sanitize(key, raw) : raw;
    if (clean !== null) next[key] = clean;
  }
  return next;
};

// Serialization: values equal to their default leave the URL (clean links),
// and parameters outside the schema (e.g. UTM tags) survive untouched.
export const writeUrlState = (search: string, values: UrlStateValues, schema: UrlStateSchema): string => {
  const params = new URLSearchParams(search);
  for (const key of Object.keys(schema.defaults)) {
    const value = values[key];
    if (value === undefined || value === schema.defaults[key]) params.delete(key);
    else params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
};

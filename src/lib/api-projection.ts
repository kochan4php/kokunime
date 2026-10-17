// `fields=title,image` support: requesters pick attributes, unknown names are
// ignored (no error, no leak of undocumented keys).

export const parseFieldsParam = (raw: string | null, allowed: readonly string[]): string[] | null => {
  if (!raw) return null;
  const requested = raw
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
  const valid = requested.filter((field) => allowed.includes(field));
  return valid.length > 0 ? [...new Set(valid)] : null;
};

export const projectRecord = <T extends Record<string, unknown>>(
  record: T,
  fields: string[] | null,
): Partial<T> | T => {
  if (!fields) return record;
  const projected: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in record) projected[field] = record[field];
  }
  return projected as Partial<T>;
};

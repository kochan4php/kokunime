const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

// Removes prototype-polluting keys from parsed JSON before anything merges or
// spreads it into other objects. V8's JSON.parse alone owns the keys, but the
// moment a naive merge walks them the prototype chain is poisoned.
export const stripDangerousKeys = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map((item) => stripDangerousKeys(item)) as unknown as T;
  if (value && typeof value === "object") {
    const clean: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (DANGEROUS_KEYS.has(key)) continue;
      clean[key] = stripDangerousKeys(nested);
    }
    return clean as unknown as T;
  }
  return value;
};

export const parseSafeJson = <T = unknown>(text: string): T | null => {
  try {
    return stripDangerousKeys(JSON.parse(text) as T);
  } catch {
    return null;
  }
};

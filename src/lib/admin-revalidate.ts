export const MAX_REVALIDATE_PATHS = 20;

// Only relative same-site paths may be revalidated: no scheme, no
// protocol-relative "//", no traversal, no query/hash/backslash. Returns null
// when the payload is not a valid path list (caller responds 400).
export const sanitizeRevalidatePaths = (input: unknown): string[] | null => {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_REVALIDATE_PATHS) {
    return null;
  }

  const paths: string[] = [];
  for (const entry of input) {
    if (typeof entry !== "string") return null;
    const path = entry.trim();
    if (!path.startsWith("/") || path.startsWith("//")) return null;
    if (path.includes("..") || /[:?#\\]/.test(path)) return null;
    paths.push(path);
  }
  return paths;
};

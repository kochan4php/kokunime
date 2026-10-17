// Extracts the anime slug from a shared kusonime.com link (PWA share target).
// Returns null for anything that isn't a detail page.
const RESERVED_SEGMENTS = new Set([
  "page",
  "genres",
  "seasons",
  "search",
  "feed",
  "dmca",
  "faq",
  "request",
  "kontak",
  "contact",
  "about",
  "disclaimer",
  "privacy",
  "privasi",
  "donasi",
]);

export function extractKusonimeSlug(input: string): string | null {
  if (!input) return null;

  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (host !== "kusonime.com" && !host.endsWith(".kusonime.com")) return null;

  const segment = url.pathname.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
  if (!segment || RESERVED_SEGMENTS.has(segment)) return null;
  if (!/^[a-z0-9][a-z0-9-]{1,119}$/.test(segment)) return null;

  return segment;
}

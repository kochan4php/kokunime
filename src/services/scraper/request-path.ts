// Kusonime answers unknown slugs with a redirect to its homepage (HTTP 200),
// so the requested path must be verified before parsing: otherwise the
// homepage title becomes a fake anime detail page.
const signature = (url: URL): string => {
  let pathname = url.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep the encoded path when it is malformed; both sides are compared
    // the same way, so a malformed path simply fails to match.
  }
  return `${url.origin}${pathname.replace(/\/+$/, "").toLowerCase()}`;
};

export const isRequestedUpstreamPath = (finalUrl: string, baseUrl: string, path: string): boolean => {
  try {
    return signature(new URL(finalUrl)) === signature(new URL(path.replace(/^\/+/, ""), baseUrl));
  } catch {
    return false;
  }
};

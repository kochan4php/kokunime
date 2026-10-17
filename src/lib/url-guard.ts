// SSRF guard for outbound fetches whose URL comes from config: only public
// http(s) hosts, and redirects are followed manually so every hop is
// validated (a public URL must not 302 into 127.0.0.1 or cloud metadata).

// Edge-safe literal-IP detector (node:net's isIP is Node-only; this module is
// reachable from the Edge instrumentation via error-reporter).
const detectIpFamily = (host: string): 0 | 4 | 6 => {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return host.split(".").every((part) => Number(part) <= 255) ? 4 : 0;
  }
  return host.includes(":") ? 6 : 0;
};

const PRIVATE_V4 = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  // CGNAT 100.64.0.0/10
  /^100\.(6[4-9]|[7-9]\d|1[0-2]\d)\./,
];

const PRIVATE_V6 = /^(::1$|fc|fd|fe80|::ffff:(0\.|10\.|127\.|169\.254\.|192\.168\.))/i;

export const isPublicHttpUrl = (raw: string): boolean => {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
    if (!host) return false;
    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) {
      return false;
    }
    const family = detectIpFamily(host);
    if (family === 4) return !PRIVATE_V4.some((pattern) => pattern.test(host));
    if (family === 6) return !PRIVATE_V6.test(host);
    // DNS name — resolution-level pinning needs a custom resolver; the
    // hostname filter blocks the obvious internal targets.
    // shortcut: literal-IP + hostname filtering only; add DNS resolution
    // checks if a user-supplied URL ever needs stronger guarantees.
    return true;
  } catch {
    return false;
  }
};

export const fetchWithRedirectGuard = async (url: string, init?: RequestInit, maxHops = 3): Promise<Response> => {
  let target = url;
  for (let hop = 0; hop <= maxHops; hop++) {
    if (!isPublicHttpUrl(target)) throw new Error(`Blocked non-public URL: ${target}`);
    const response = await fetch(target, { ...init, redirect: "manual" });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return response;
      target = new URL(location, target).toString();
      continue;
    }
    return response;
  }
  throw new Error("Too many redirects");
};

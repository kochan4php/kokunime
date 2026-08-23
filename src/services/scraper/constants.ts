export const UPSTREAM_URL = "https://kusonime.com/";

// Effective scrape origin. Route through a same-network relay (e.g. a
// Cloudflare Worker) when the runtime egress IP is blocked by upstream's
// bot protection: set UPSTREAM_BASE_URL=https://<worker>.workers.dev/
// Parsed hrefs still point at the real site, so URL-stripping logic keeps
// using UPSTREAM_URL.
export const SCRAPE_BASE_URL = process.env.UPSTREAM_BASE_URL ?? UPSTREAM_URL;

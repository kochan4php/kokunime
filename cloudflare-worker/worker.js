// Kokunime upstream relay — Cloudflare Worker (free tier: 100k req/day).
//
// WHY: kusonime.com's Cloudflare challenges requests from Netlify's AWS IPs
// (403 + cf-mitigated: challenge). This Worker fetches kusonime from inside
// Cloudflare's own network, which is not challenged.
//
// DEPLOY (no tooling needed):
//   1. dash.cloudflare.com -> Workers & Pages -> Create application -> Create Worker
//   2. Replace the editor code with this file's contents -> Deploy
//   3. Test:  curl https://<your-worker>.workers.dev/page/2/   (expect real HTML)
//   4. Netlify dashboard -> Site configuration -> Environment variables:
//        UPSTREAM_BASE_URL = https://<your-worker>.workers.dev/
//   5. Redeploy the site. Verify at /api/health -> probes[].status should be 200.
//
// The target host is pinned to kusonime.com, so this is NOT an open proxy.

const UPSTREAM = "https://kusonime.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = new URL(url.pathname + url.search, UPSTREAM);

    const res = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        Referer: UPSTREAM + "/",
      },
      redirect: "follow",
    });

    const out = new Response(res.body, res);
    out.headers.set("Cache-Control", "public, max-age=120");
    return out;
  },
};

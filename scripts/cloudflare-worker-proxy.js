/**
 * Cloudflare Worker Reverse Proxy for Kokunime
 *
 * Deploy this to Cloudflare Workers (Free tier: 100,000 reqs/day):
 * 1. Go to https://dash.cloudflare.com -> Workers & Pages -> Create Worker.
 * 2. Paste this code and click Deploy.
 * 3. Copy your worker URL (e.g. https://kokunime-proxy.your-name.workers.dev).
 * 4. Add to Netlify Environment Variables:
 *    UPSTREAM_URL = https://kokunime-proxy.your-name.workers.dev
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = `https://kusonime.com${url.pathname}${url.search}`;

    const headers = new Headers(request.headers);
    headers.set("Host", "kusonime.com");
    headers.set("Referer", "https://kusonime.com/");
    headers.set(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};

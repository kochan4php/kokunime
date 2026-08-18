/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  // Partial CSP: blocks <base> hijacking, plugin/object injection, and
  // form-exfiltration without touching script-src (full CSP is theater for
  // Next.js: inline theme script + RSC payloads force unsafe-inline).
  { key: "Content-Security-Policy", value: "base-uri 'none'; form-action 'self'; object-src 'none'" },
];

// Dynamic SSR routes ship Cache-Control: no-store by default → Chrome can't
// put them in the back/forward cache (home → detail → back = full reload,
// 0.5-2s TTFB). Revalidate-on-every-visit for browsers (max-age=0 → bfcache
// OK) while s-maxage lets the CDN edge hold the page for 15m — without it,
// every visit revalidates at the origin serverless function (~0.6s TTFB
// even for static pages; verified via Cache-Status: fwd=stale; ttl=-15).
const dynamicCacheControl = {
  key: "Cache-Control",
  value: "public, max-age=0, s-maxage=900, stale-while-revalidate=900",
};

// /genres and /seasons paginate via ?page=N. Netlify's auto Netlify-Vary
// (query=__nextDataReq|_rsc) does NOT include `page`, so every ?page=N shares
// one edge-cache key and page 2/3/… all serve page 1's HTML (verified live).
// Extend the vary with the exact values Netlify already emits + page.
const pageVary = {
  key: "Netlify-Vary",
  value:
    "query=__nextDataReq|_rsc|page,header=x-nextjs-data|x-next-debug-logging|next-router-prefetch|next-router-segment-prefetch|next-router-state-tree|next-url|rsc|accept-encoding,cookie=__prerender_bypass|__next_preview_data",
};

const immutableCacheControl = {
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
};

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  async redirects() {
    // /page/1 duplicates "/" (the route 404s on page < 2) — consolidate.
    return [{ source: "/page/1", destination: "/", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/icon.svg", headers: [immutableCacheControl] },
      { source: "/manifest.webmanifest", headers: [immutableCacheControl] },
      // s-maxage=900: hold at the CDN edge (matches the 15m ISR revalidate);
      // max-age=0 keeps browsers revalidating (SW covers repeat visits) and
      // lets Chrome use the back/forward cache.
      { source: "/", headers: [dynamicCacheControl] },
      { source: "/page/:path*", headers: [dynamicCacheControl] },
      { source: "/anime/:path*", headers: [dynamicCacheControl] },
      { source: "/genres", headers: [dynamicCacheControl, pageVary] },
      { source: "/seasons", headers: [dynamicCacheControl, pageVary] },
      { source: "/genres/:path*", headers: [dynamicCacheControl] },
      { source: "/seasons/:path*", headers: [dynamicCacheControl] },
      { source: "/search/:path*", headers: [dynamicCacheControl] },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kusonime.com",
      },
      {
        protocol: "https",
        hostname: "**.kusonime.com",
      },
      {
        protocol: "https",
        hostname: "**.wp.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
      },
    ],
  },
};

export default nextConfig;

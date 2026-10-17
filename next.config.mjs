/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  // Partial CSP: blocks <base> hijacking, plugin/object injection, and
  // form-exfiltration without touching script-src (full CSP is theater for
  // Next.js: inline theme script + RSC payloads force unsafe-inline).
  { key: "Content-Security-Policy", value: "base-uri 'none'; form-action 'self'; object-src 'none'" },
  // Report-only full CSP: enforces nothing, but violations land in
  // /api/report-error (counted as csp_violation) so a future enforcing pass
  // is driven by real data instead of guesses.
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "report-uri /api/report-error",
    ].join("; "),
  },
];

const immutableCacheControl = {
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
};

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  env: {
    // Cache-busting token for the service worker URL (see public/sw.js): a new
    // build → new SW script URL → fresh cache namespace, no manual bumping.
    NEXT_PUBLIC_BUILD_ID:
      process.env.NEXT_PUBLIC_BUILD_ID || process.env.GITHUB_SHA?.slice(0, 12) || Date.now().toString(36),
  },
  async redirects() {
    // /page/1 duplicates "/" (the route 404s on page < 2) — consolidate.
    return [{ source: "/page/1", destination: "/", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/icon.svg", headers: [immutableCacheControl] },
      { source: "/manifest.webmanifest", headers: [immutableCacheControl] },
      {
        // 5 open graph image routes (home/genres/seasons/years/anime): generated
        // per request, near-static per path — cache hard at the CDN.
        source: "/:path*/opengraph-image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
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

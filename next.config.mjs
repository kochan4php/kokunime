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
// 0.5-2s TTFB). Revalidate-on-every-visit keeps data exactly as fresh as
// no-store while letting bfcache restore the page instantly.
const dynamicCacheControl = { key: "Cache-Control", value: "public, max-age=0, must-revalidate" };

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
      { source: "/anime/:path*", headers: [dynamicCacheControl] },
      { source: "/genres/:path*", headers: [dynamicCacheControl] },
      { source: "/seasons/:path*", headers: [dynamicCacheControl] },
      { source: "/search/:path*", headers: [dynamicCacheControl] },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kusonime.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;

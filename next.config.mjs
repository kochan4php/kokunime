/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  // Partial CSP: blocks <base> hijacking, plugin/object injection, and
  // form-exfiltration without touching script-src (full CSP is theater for
  // Next.js: inline theme script + RSC payloads force unsafe-inline).
  { key: "Content-Security-Policy", value: "base-uri 'none'; form-action 'self'; object-src 'none'" },
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
  async redirects() {
    // /page/1 duplicates "/" (the route 404s on page < 2) — consolidate.
    return [{ source: "/page/1", destination: "/", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/icon.svg", headers: [immutableCacheControl] },
      { source: "/manifest.webmanifest", headers: [immutableCacheControl] },
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

let config = nextConfig;

if (process.env.ANALYZE === "true") {
  try {
    const bundleAnalyzerModule = await import("@next/bundle-analyzer");
    const withBundleAnalyzer = bundleAnalyzerModule.default({
      enabled: true,
    });
    config = withBundleAnalyzer(nextConfig);
  } catch {}
}

export default config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: 'placehold.co' }],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;

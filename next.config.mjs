/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
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

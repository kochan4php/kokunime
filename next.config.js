/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;

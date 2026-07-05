/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fast-gas.com",
      },
    ],
  },
};

export default nextConfig;

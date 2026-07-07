import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fast-gas.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/all-in-one-bundle",
        destination: "/products/all-in-one-bundle",
      },
    ];
  },
};

export default nextConfig;

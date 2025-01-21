import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "repilicate.delivery",
      },
    ],
  },
};

export default nextConfig;

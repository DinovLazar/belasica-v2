import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to render Sanity assets (used by the content pages, 1.05+).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Second layer of build resilience, under `src/sanity/fetch.ts` (D-3.02F-C-3).
  // The build now prerenders ~270 pages, each making two Sanity reads, and a
  // transient `Connect Timeout Error` on any one of them fails the whole
  // deploy (D-3.05a-9). The read helper retries the *read*; this retries the
  // *page* if it still failed. It cannot mask a broken page — a retried render
  // either completes in full or the build fails loudly, exactly as before.
  experimental: {
    staticGenerationRetryCount: 2,
  },
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

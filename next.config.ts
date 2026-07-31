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
    // AVIF first, WebP second (3.09). This is a FORMAT change, not a quality
    // one: `quality` stays at next/image's default 75 on every photograph, and
    // D-3.04d-5 — archive photograph quality is never reduced to buy simulator
    // points — is untouched. It is the only lever left on the two routes whose
    // LCP is bytes rather than render delay (home, season detail), where the
    // trace showed `resourceLoadDuration` dominating the breakdown. Browsers
    // without AVIF fall through to WebP and then to the original (D-3.09-4).
    formats: ["image/avif", "image/webp"],
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

// Sanity connection env — read by the client, the image builder, and the
// embedded Studio config. Only NEXT_PUBLIC_* values + a pinned apiVersion; no
// token (the dataset is public-read, and the repo is public — see D-1.04-2).

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-15";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

// Served from the CDN — read-only, published content, no token needed.
export const useCdn = true;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

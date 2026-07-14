import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Build a cdn.sanity.io URL from a Sanity image field. Used by next/image in
// the content pages (Phase 1.05+).
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

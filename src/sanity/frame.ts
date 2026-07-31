import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "./image";
import type { FramedImage } from "@/components/home/PhotoFrameView";

/**
 * CSS object-position for a cover crop. When an editor has set a focal point in
 * Studio (the image field has `hotspot: true`), honour it. Otherwise bias the
 * crop toward the top — in archive portraits and team photos the faces sit
 * high, so the default center crop slices heads off and leaves torsos/legs.
 */
function focalPosition(image?: SanityImageSource | null): string {
  const hotspot =
    image && typeof image === "object" && "hotspot" in image
      ? (image as { hotspot?: { x?: number; y?: number } }).hotspot
      : undefined;
  if (
    hotspot &&
    typeof hotspot.x === "number" &&
    typeof hotspot.y === "number"
  ) {
    return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`;
  }
  return "50% 20%";
}

/**
 * Resolve a Sanity image field into the plain, serialisable pair a
 * `PhotoFrameView` needs — a CDN URL and a focal point.
 *
 * **Call this on the server.** It is the single seam that keeps
 * `@sanity/image-url` out of the browser: a client component receives the
 * result as props rather than importing the builder to compute it (D-3.09-1,
 * following the pattern D-3.05b-3 set for the lightbox).
 */
export function framedImage(
  image: SanityImageSource | null | undefined,
  width = 1200,
): FramedImage | null {
  if (!image) return null;
  return {
    src: urlFor(image).width(width).auto("format").url(),
    objectPosition: focalPosition(image),
  };
}

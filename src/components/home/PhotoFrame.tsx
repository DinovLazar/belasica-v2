import type { SanityImageSource } from "@sanity/image-url";
import { framedImage } from "@/sanity/frame";
import { PhotoFrameView } from "./PhotoFrameView";

/**
 * Photo frame — brand.md §Photo treatment. `fit` picks BOTH the crop and the
 * surround, because in this direction those are one decision (D-3.05-5):
 *
 *  - `"cover"` (default) — a **presentation** surface: hero, moment band, card
 *    lead. A hard-edged block, no mat, no border, no radius; the image fills
 *    the frame. The ground is navy so a transparent or still-loading image
 *    reads as part of the block rather than as a hole.
 *  - `"contain"` — an **archival set**: the scan's true aspect is information,
 *    so the whole image sits on a mist mat with a hairline border. A smaller
 *    scan simply gets a wider mat while the outer frame stays identical across
 *    the grid. That is brand.md's mixed-quality rule — never upscale or crop a
 *    small scan to fill.
 *
 * `ratio` fixes the frame's aspect. Omit it for **fill mode** (`h-full`): the
 * frame fills the height its parent gives it — used by the gallery mosaic and
 * by the hero, where the parent sets a responsive aspect.
 *
 * When no image is present the frame holds a placeholder chip on the matching
 * surface — the graceful empty state (no fabricated content).
 *
 * **Server only.** Since 3.09 this is the Sanity-aware half of the frame: it
 * resolves the asset to a CDN URL and a focal point and hands both to
 * `PhotoFrameView`, which owns the markup. A **client** component must import
 * `PhotoFrameView` directly and receive an already-resolved `FramedImage`,
 * or `@sanity/image-url` follows it into the browser bundle (D-3.09-1).
 */
export function PhotoFrame({
  image,
  alt,
  ratio,
  fit = "cover",
  sizes,
  width = 1200,
  priority = false,
  placeholderLabel,
  className,
  objectPosition,
}: {
  image?: SanityImageSource | null;
  alt: string;
  ratio?: "16/9" | "3/2" | "4/5";
  fit?: "cover" | "contain";
  sizes: string;
  width?: number;
  priority?: boolean;
  placeholderLabel: string;
  className?: string;
  /** Override the cover crop's focal point (defaults to the Sanity hotspot,
   *  else a top-biased crop that keeps faces in frame). Ignored when
   *  `fit="contain"` — a contained image is never cropped. */
  objectPosition?: string;
}) {
  return (
    <PhotoFrameView
      image={framedImage(image, width)}
      alt={alt}
      ratio={ratio}
      fit={fit}
      sizes={sizes}
      priority={priority}
      placeholderLabel={placeholderLabel}
      className={className}
      objectPosition={objectPosition}
    />
  );
}

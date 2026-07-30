import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";
import { cn } from "@/lib/utils";
import { PlaceholderChip } from "./PlaceholderChip";

// Fixed-ratio frames per brand.md §Photo treatment. Static class strings so
// Tailwind keeps them in the build (no dynamic `aspect-[…]`).
const RATIO: Record<"16/9" | "3/2" | "4/5", string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
};

/**
 * CSS object-position for the cover crop. When an editor has set a focal point
 * in Studio (the image field has `hotspot: true`), honour it. Otherwise bias
 * the crop toward the top — in archive portraits and team photos the faces sit
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
  const contain = fit === "contain";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        contain ? "border border-mist bg-mist" : "bg-navy",
        ratio ? RATIO[ratio] : "h-full",
        className,
      )}
    >
      {image ? (
        <Image
          src={urlFor(image).width(width).auto("format").url()}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          // `priority` marks the LCP candidate but Next 15.5 does not
          // priority-hint the request by itself; the explicit prop does.
          fetchPriority={priority ? "high" : undefined}
          className={contain ? "object-contain" : "object-cover"}
          style={
            contain
              ? undefined
              : { objectPosition: objectPosition ?? focalPosition(image) }
          }
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <PlaceholderChip label={placeholderLabel} onNavy={!contain} />
        </span>
      )}
    </div>
  );
}

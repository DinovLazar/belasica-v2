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
 * Matted photo frame — brand.md §Photo treatment: mist mat, 2px radius,
 * hairline border. The image sits inside with object-cover (cropped, never
 * stretched). When no image is present the mist mat is the greybox and holds
 * a placeholder chip — the graceful empty state (no fabricated content).
 *
 * `ratio` fixes the frame's aspect. Omit it for **fill mode** (`h-full`): the
 * frame fills the height its parent gives it — used by the gallery mosaic,
 * where the CSS-grid row tracks define the cell heights (Phase 1.06b).
 */
export function PhotoFrame({
  image,
  alt,
  ratio,
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
  sizes: string;
  width?: number;
  priority?: boolean;
  placeholderLabel: string;
  className?: string;
  /** Override the cover crop's focal point (defaults to the Sanity hotspot,
   *  else a top-biased crop that keeps faces in frame). */
  objectPosition?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-photo border border-mist bg-mist",
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
          className="object-cover"
          style={{ objectPosition: objectPosition ?? focalPosition(image) }}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <PlaceholderChip label={placeholderLabel} />
        </span>
      )}
    </div>
  );
}

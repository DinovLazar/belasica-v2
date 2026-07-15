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
 * Matted photo frame — brand.md §Photo treatment: mist mat, 2px radius,
 * hairline border. The image sits inside with object-cover (cropped, never
 * stretched). When no image is present the mist mat is the greybox and holds
 * a placeholder chip — the graceful empty state (no fabricated content).
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
}: {
  image?: SanityImageSource | null;
  alt: string;
  ratio: "16/9" | "3/2" | "4/5";
  sizes: string;
  width?: number;
  priority?: boolean;
  placeholderLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-photo border border-mist bg-mist",
        RATIO[ratio],
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
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <PlaceholderChip label={placeholderLabel} />
        </span>
      )}
    </div>
  );
}

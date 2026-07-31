import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlaceholderChip } from "./PlaceholderChip";

// Fixed-ratio frames per brand.md §Photo treatment. Static class strings so
// Tailwind keeps them in the build (no dynamic `aspect-[…]`).
const RATIO: Record<"16/9" | "3/2" | "4/5", string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
};

/** A frame's image, already resolved to a CDN URL on the server. */
export type FramedImage = {
  /** Built with `urlFor(...)` in a server component — never derived here. */
  src: string;
  /** CSS `object-position` for the cover crop (the Sanity hotspot, resolved). */
  objectPosition: string;
};

/**
 * The photo frame's **markup**, with no Sanity dependency of any kind.
 *
 * Split out of `PhotoFrame` at 3.09 for one measured reason: `LegendsBrowser`
 * is a client component, so everything it imports crosses the client boundary,
 * and through `RoleBandGrid → LegendCard → PhotoFrame → urlFor` that dragged
 * the whole `@sanity/image-url` builder into `/legendi`'s bundle — measured at
 * **17.3 KB** of client JS whose only job is to build a string the server
 * already knows (D-3.09-1). This file is the half a client component may
 * safely import; `PhotoFrame` is the half that talks to Sanity.
 *
 * It is the same pattern D-3.05b-3 established for the lightbox: the server
 * builds the URLs, the client receives plain serialisable data.
 *
 * The rendered markup is byte-identical to what `PhotoFrame` emitted before
 * the split — this is a data-plumbing change, not a layout one.
 */
export function PhotoFrameView({
  image,
  alt,
  ratio,
  fit = "cover",
  sizes,
  priority = false,
  placeholderLabel,
  className,
  objectPosition,
}: {
  image?: FramedImage | null;
  alt: string;
  ratio?: "16/9" | "3/2" | "4/5";
  fit?: "cover" | "contain";
  sizes: string;
  priority?: boolean;
  placeholderLabel: string;
  className?: string;
  /** Override the resolved hotspot. Ignored when `fit="contain"` — a contained
   *  image is never cropped. */
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
          src={image.src}
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
              : { objectPosition: objectPosition ?? image.objectPosition }
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

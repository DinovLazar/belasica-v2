import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";
import { cn } from "@/lib/utils";
import { PhotoFrame } from "@/components/home/PhotoFrame";

/** A season's lead photo (`teamPhoto` / `tablePhoto`), dereferenced with the
 *  asset's intrinsic pixel dimensions so the frame can take the scan's own
 *  aspect instead of forcing it into a fixed one. */
export type LeadPhoto = {
  image: SanityImageSource | null;
  caption: string | null;
  date: string | null;
  width: number | null;
  height: number | null;
};

/**
 * A single archival scan, matted at its **own** aspect ratio (D-3.04-3).
 *
 * The grid in „Фотографии" uses `PhotoFrame ratio="3/2" fit="contain"`, and
 * that is right there: identical outer frames are what let a mixed-quality set
 * line up (brand.md §Photo treatment / D-2.02-7). A *solo* lead image has
 * nothing to line up with, and the season leads are extreme: `teamPhoto`
 * aspects run 0.49→2.63 and `tablePhoto` 0.36→2.86 across the 83/87 live
 * assets. Dropping either end into one fixed frame leaves a mat several times
 * the image's own area — which reads as broken, not as deliberate. So the mat
 * here is a real mat: uniform padding around the whole scan, at its true shape.
 *
 * `maxHeightRem` caps the *height* (a 1960×4032 portrait scan would otherwise
 * be a two-viewport-tall lead); the frame also never renders wider than the
 * asset's native pixel width, so a low-res scan is matted, never upscaled.
 * Omit `maxHeightRem` where legibility outranks page length — the standings
 * scan has to be readable, which is the whole point of showing the table as an
 * image (D-3.01-2).
 *
 * If the asset has no dimension metadata we cannot know its shape, so it falls
 * back to the 2.02-spec'd fixed 3:2 contain frame rather than guessing.
 */
export function MattedPhoto({
  photo,
  alt,
  sizes,
  renderWidth = 1600,
  maxHeightRem,
  priority = false,
  tone = "onPaper",
  className,
}: {
  photo: LeadPhoto;
  alt: string;
  sizes: string;
  /** Width requested from the Sanity CDN (not the layout width). */
  renderWidth?: number;
  /** Cap the rendered height, in rem. Omit for no cap. */
  maxHeightRem?: number;
  priority?: boolean;
  /** Surface the frame sits on — drives the caption's text colour only. */
  tone?: "onPaper" | "onNavy";
  className?: string;
}) {
  if (!photo.image) return null;

  const hasDimensions = Boolean(photo.width && photo.height);

  // Cap by height (converted to a width via the ratio) and by the asset's own
  // pixel width, whichever is smaller — never upscale, never overflow.
  const bounds: string[] = ["100%"];
  if (hasDimensions && maxHeightRem) {
    const ratio = photo.width! / photo.height!;
    bounds.push(`${(maxHeightRem * ratio).toFixed(2)}rem`);
  }
  if (photo.width) bounds.push(`${photo.width}px`);
  const maxWidth = bounds.length > 1 ? `min(${bounds.join(", ")})` : undefined;

  return (
    <figure
      className={cn("mx-auto w-full", className)}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {hasDimensions ? (
        // The mat: mist ground + hairline border + real padding, so the scan
        // reads as a mounted print rather than a browser-placed image.
        <div className="border border-mist bg-mist p-2 md:p-3">
          <Image
            src={urlFor(photo.image).width(renderWidth).auto("format").url()}
            alt={alt}
            width={photo.width!}
            height={photo.height!}
            sizes={sizes}
            priority={priority}
            // Same reason as PhotoFrame: `priority` alone does not put
            // fetchpriority="high" on the request in Next 15.5.
            fetchPriority={priority ? "high" : undefined}
            className="h-auto w-full"
          />
        </div>
      ) : (
        <PhotoFrame
          image={photo.image}
          alt={alt}
          ratio="3/2"
          fit="contain"
          sizes={sizes}
          width={renderWidth}
          priority={priority}
          placeholderLabel="фотографија"
        />
      )}

      {(photo.date || photo.caption) && (
        // The same caption anatomy `PhotoGrid` uses (brand.md §Photo treatment
        // / D-2.02-9): short orange RULE marker + date overline + description,
        // below the frame and never clamped. Keeping it identical here is what
        // lets the lead photo carry its own `caption` AND `date`, so excluding
        // it from the gallery hides no archive data (D-3.04-2).
        //
        // The marker is the only orange: on paper the text is neutral-500 /
        // neutral-700 and on navy it is paper — orange text would fail AA on
        // paper at 2.8:1 (D-1.02-1 / D-2.02-9).
        //
        // Size on the wrapper, colour on the text — a layout choice, not a
        // merge workaround: cn()'s tailwind-merge is configured with the
        // project type scale in src/lib/utils.ts, so size and colour may
        // safely share one cn() call (D-3.04-12, fixed at 3.04d).
        <figcaption className="mt-3">
          {photo.date && (
            <div className="flex items-center gap-2 text-overline">
              <span aria-hidden className="h-1.5 w-5 shrink-0 bg-orange" />
              <p
                className={cn(
                  "font-bold uppercase tracking-overline",
                  tone === "onNavy" ? "text-paper/90" : "text-neutral-500",
                )}
              >
                {photo.date}
              </p>
            </div>
          )}
          {photo.caption && (
            <div
              className={cn(
                "flex items-start gap-2 text-small",
                photo.date && "mt-1.5",
              )}
            >
              {/* Without a date the caption carries the marker itself, so the
                  orange rule is never lost from the figure. */}
              {!photo.date && (
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-5 shrink-0 bg-orange"
                />
              )}
              <p
                className={cn(
                  photo.date && "ml-6",
                  tone === "onNavy" ? "text-paper" : "text-neutral-700",
                )}
              >
                {photo.caption}
              </p>
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
}

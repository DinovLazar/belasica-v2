import { Reveal } from "@/components/home/Reveal";
import {
  PhotoLightboxProvider,
  PhotoLightboxTrigger,
  type LightboxPhoto,
} from "@/components/archive/PhotoLightbox";
import type { RaznoPhoto } from "@/content/razno-photos";

/**
 * „Фотографии" on a „Разно" topic page (Phase 3.20).
 *
 * **Why this is not `PhotoGrid`.** The archive's grid is Sanity-shaped end to
 * end: it takes a `SanityImageSource`, builds CDN URLs with `urlFor()` and
 * renders through `PhotoFrame → framedImage()`, which resolves an asset ref
 * and a hotspot. These photographs are 64 static WebP files under `public/`
 * with no asset document behind them, so satisfying that component would mean
 * fabricating Sanity image objects — the long way round, for markup that is a
 * frame and an `<img>`. The **lightbox** is reused exactly as it stands: it
 * was already split so that the server hands the client plain
 * `url · width · height · caption` (D-3.05b-3), which is precisely the shape a
 * local file has. So the overlay behaviour the owner had fixed at 3.19 — the
 * arrows holding a real gutter beside the image instead of lying over it, and
 * wrapping beneath it below `sm` so they stay reachable on a phone — is the
 * same code here, not a second implementation of it.
 *
 * **Plain `<img>`, not `next/image`.** These files were optimised once, ahead
 * of time, at the size the grid shows them; running them back through the
 * image pipeline would buy nothing and put 64 more entries on the optimiser.
 * `width`/`height` come from the files themselves, so every cell reserves its
 * box before a byte arrives.
 *
 * **Uncaptioned scans stay uncaptioned.** Many of these arrived with
 * machine-generated filenames carrying no information about the picture. Those
 * render no caption and take `alt=""` — the image is decorative to a screen
 * reader only in the sense that the archive can say nothing true about it, and
 * a made-up description would be a fabricated fact (`CLAUDE.md` §Content
 * truth). The set is still announced: the section is labelled „Фотографии" and
 * each thumbnail's button is named by the lightbox's own „Архивска
 * фотографија" fallback.
 *
 * Server component. Frames, captions and reveals are server-rendered and
 * passed through the provider as `children`; only the button and the overlay
 * are client code.
 */
export function RaznoPhotoGrid({
  photos,
  label,
}: {
  photos: RaznoPhoto[];
  /** The lightbox dialog's accessible name — the topic, not the season. */
  label: string;
}) {
  const lightboxPhotos: LightboxPhoto[] = photos.map((photo) => ({
    // The path is already unique per topic and stable across builds.
    id: photo.src,
    url: photo.src,
    width: photo.width,
    height: photo.height,
    caption: photo.caption?.trim() || null,
    // These files carry no date of their own; the caption is all the archive
    // holds. Never derived from a year inside the caption — that would be
    // reading a fact out of a string rather than out of `facts.md`.
    date: null,
  }));

  return (
    <PhotoLightboxProvider photos={lightboxPhotos} label={label}>
      {/* Three up, matching the season gallery. A topic with 29 scans is ten
          rows of identical frames rather than a wall of ragged shapes — the
          same reason that grid mats at a fixed ratio (brand.md §Photo
          treatment / D-2.02-7): a small scan gets a wider mat, never a crop
          and never an upscale. */}
      <ul className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {photos.map((photo, i) => {
          const caption = photo.caption?.trim();

          return (
            <li key={photo.src}>
              <Reveal delayIndex={i % 3}>
                <figure>
                  <PhotoLightboxTrigger index={i} label={caption ?? null}>
                    <div className="relative aspect-[3/2] w-full overflow-hidden border border-mist bg-mist">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.src}
                        // Always `""`: this figure renders `caption` visibly in
                        // its own `<figcaption>` below, so an alt carrying the
                        // same string is the same sentence read twice. Same
                        // rule as `PhotoGrid`.
                        alt=""
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    </div>
                  </PhotoLightboxTrigger>

                  {caption && (
                    // The archive's caption anatomy without the date row: the
                    // short orange rule carries the marker, the text stays
                    // neutral-700 — orange text on paper is 2.8:1 and fails AA
                    // (D-1.02-1 / D-2.02-9). Never clamped.
                    <figcaption className="mt-3 flex items-start gap-2 text-small">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-5 shrink-0 bg-orange"
                      />
                      <p className="text-neutral-700">{caption}</p>
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </PhotoLightboxProvider>
  );
}

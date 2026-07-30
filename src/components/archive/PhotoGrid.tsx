import type { SanityImageSource } from "@sanity/image-url";
import { PhotoFrame } from "@/components/home/PhotoFrame";
import { Reveal } from "@/components/home/Reveal";
import {
  PhotoLightboxProvider,
  PhotoLightboxTrigger,
  type LightboxPhoto,
} from "@/components/archive/PhotoLightbox";
import { urlFor } from "@/sanity/image";

export type ArchivePhoto = {
  id: string;
  image: SanityImageSource | null;
  caption: string | null;
  date: string | null;
  /** The asset's intrinsic dimensions, for the lightbox's `next/image`. Only
   *  the season page projects them (3.05b); absent everywhere else. */
  width?: number | null;
  height?: number | null;
};

/**
 * Фотографии — the season's complete captioned set.
 *
 * Renders **every** season photo, including the one the hero uses (D-2.02-6):
 * the hero is a cropped presentation band that shows no caption, so excluding
 * `[0]` here would permanently hide that photo's caption and date — the
 * substance of a captioned-scan archive.
 *
 * Frames use `fit="contain"` (D-2.02-7), which is what makes brand.md's
 * mixed-quality rule real: identical outer frames across the grid, and a
 * smaller scan simply sits on a wider mat rather than being cropped or
 * upscaled to fill.
 *
 * `photo.provenance` is deliberately **not rendered** — it is the rights
 * paper-trail, and the 2.09 script writes a provisional internal string that
 * must never reach a page (handover §13 OQ-1).
 *
 * **`lightbox` is opt-in (3.05b).** The season page turns it on; the person
 * page passes the same component the same shape of data and is unchanged, per
 * the phase's scope. This component stays a **server** component either way —
 * it builds the overlay's image URLs here and hands the client only plain
 * serialisable data.
 */
export function PhotoGrid({
  photos,
  lightbox = false,
}: {
  photos: ArchivePhoto[];
  lightbox?: boolean;
}) {
  // Only a photo with an asset can be opened; one whose reference resolved to
  // a missing image renders its placeholder frame and stays inert, rather than
  // offering a button onto nothing.
  const openable = lightbox
    ? photos.filter(
        (p): p is ArchivePhoto & { image: SanityImageSource } => !!p.image,
      )
    : [];

  const lightboxPhotos: LightboxPhoto[] = openable.map((photo) => ({
    id: photo.id,
    // `fit("max")` caps a large scan at 2400px and leaves a small one at its
    // native size — brand.md's mixed-quality rule: never upscale a low-res
    // scan, here or in the grid.
    url: urlFor(photo.image).width(2400).fit("max").auto("format").url(),
    // The intrinsic ratio, which is all `next/image` needs these for. The
    // fallback matches the grid's own 3/2 frame and never fires on the season
    // page, which projects the real dimensions.
    width: photo.width ?? 1200,
    height: photo.height ?? 800,
    caption: photo.caption,
    date: photo.date,
  }));

  const indexById = new Map(openable.map((photo, i) => [photo.id, i]));

  const grid = (
    <ul className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {photos.map((photo, i) => {
        const frame = (
          <PhotoFrame
            image={photo.image}
            alt={photo.caption ?? "Архивска фотографија"}
            ratio="3/2"
            fit="contain"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            width={800}
            placeholderLabel="фотографија"
          />
        );
        const openIndex = indexById.get(photo.id);

        return (
          <li key={photo.id}>
            <Reveal delayIndex={i % 3}>
              <figure>
                {openIndex === undefined ? (
                  frame
                ) : (
                  <PhotoLightboxTrigger index={openIndex} label={photo.caption}>
                    {frame}
                  </PhotoLightboxTrigger>
                )}
                {(photo.date || photo.caption) && (
                  <figcaption className="mt-3">
                    {photo.date && (
                      <div className="flex items-center gap-2">
                        {/* Orange rule marker — the overline *text* is
                            neutral-500, since orange on paper is 2.8:1 and fails
                            AA (D-1.02-1 / D-2.02-9). */}
                        <span
                          aria-hidden
                          className="h-1.5 w-5 shrink-0 bg-orange"
                        />
                        <p className="text-overline font-bold uppercase tracking-overline text-neutral-500">
                          {photo.date}
                        </p>
                      </div>
                    )}
                    {photo.caption && (
                      // Never clamped: an archive caption has to be readable in
                      // full (unlike the homepage mosaic's overlay).
                      <p className="mt-1.5 text-small text-neutral-700">
                        {photo.caption}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );

  if (lightboxPhotos.length === 0) return grid;

  return (
    <PhotoLightboxProvider photos={lightboxPhotos}>{grid}</PhotoLightboxProvider>
  );
}

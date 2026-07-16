import type { SanityImageSource } from "@sanity/image-url";
import { PhotoFrame } from "@/components/home/PhotoFrame";
import { Reveal } from "@/components/home/Reveal";

export type ArchivePhoto = {
  id: string;
  image: SanityImageSource | null;
  caption: string | null;
  date: string | null;
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
 */
export function PhotoGrid({ photos }: { photos: ArchivePhoto[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {photos.map((photo, i) => (
        <li key={photo.id}>
          <Reveal delayIndex={i % 3}>
            <figure>
              <PhotoFrame
                image={photo.image}
                alt={photo.caption ?? "Архивска фотографија"}
                ratio="3/2"
                fit="contain"
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                width={800}
                placeholderLabel="фотографија"
              />
              {(photo.date || photo.caption) && (
                <figcaption className="mt-3">
                  {photo.date && (
                    <div className="flex items-center gap-2">
                      {/* Orange rule marker — the overline *text* is
                          neutral-500, since orange on paper is 2.8:1 and fails
                          AA (D-1.02-1 / D-2.02-9). */}
                      <span aria-hidden className="h-0.5 w-4 shrink-0 bg-orange" />
                      <p className="text-overline font-semibold uppercase tracking-overline text-neutral-500">
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
      ))}
    </ul>
  );
}

import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { PhotoFrame } from "@/components/home/PhotoFrame";
import { Reveal } from "@/components/home/Reveal";
import { decadeLabel } from "@/lib/archive";
import { focusOnPaper } from "@/lib/focus";

export type SeasonCardData = {
  title: string;
  slug: string;
  decade: number;
  leadPhoto: { image: SanityImageSource | null; caption: string | null } | null;
};

/**
 * Season card — brand.md §Components: 3:2 lead image, neutral meta overline,
 * serif navy title, 2px lift on hover (no shadow; brand.md defines no shadow
 * token).
 *
 * The whole card is one real `<a>` (not a JS click handler), so it is
 * keyboard-reachable and middle-clickable, and the focus ring lands on the
 * link rather than the inner frame (§8).
 *
 * With no lead photo, `PhotoFrame` renders its Mist greybox holding a
 * placeholder chip — the common post-2.09 state (§5.5). Title and decade are
 * both required in the model, so a card is never blank or broken.
 *
 * The `Reveal` sits *inside* the `<li>`: a `<ul>` may only contain `<li>`, so
 * wrapping the card from the outside would put Reveal's `<div>` straight into
 * the list and break both the markup and the announced item count.
 */
export function SeasonCard({
  season,
  delayIndex = 0,
}: {
  season: SeasonCardData;
  delayIndex?: number;
}) {
  return (
    <li>
      <Reveal delayIndex={delayIndex}>
        <Link
          href={`/arhiva/${season.slug}`}
          className={`group block overflow-hidden rounded-card border border-mist bg-white transition-transform duration-150 ease-out hover:-translate-y-0.5 ${focusOnPaper}`}
        >
          <PhotoFrame
            image={season.leadPhoto?.image ?? null}
            alt={season.leadPhoto?.caption ?? `Фотографија од ${season.title}`}
            ratio="3/2"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            width={800}
            placeholderLabel="фотографија од сезоната"
            // Flush to the card's top edge: the card already supplies the border
            // and radius, so the frame drops its own and keeps only the hairline
            // that separates image from body.
            className="rounded-none border-0 border-b border-mist"
          />
          <div className="p-5">
            {/* The decade, in neutral-500 — not orange (3.08:1 on white fails
                AA, D-1.02-1/D-2.02-1) and not a league (no such field exists). */}
            <p className="text-overline font-semibold uppercase tracking-overline text-neutral-500">
              {decadeLabel(season.decade)}
            </p>
            <h3 className="mt-1.5 font-serif text-h3 font-semibold text-navy decoration-2 underline-offset-4 group-hover:underline group-hover:decoration-orange">
              {season.title}
            </h3>
          </div>
        </Link>
      </Reveal>
    </li>
  );
}

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
 * Season card — brand.md §Components („Card"): a white block on the paper
 * page, 3:2 lead image flush to its edges, tracked decade meta and a condensed
 * caps title. Hover wipes the 6px orange bar in along the bottom edge and
 * lifts the card 4px; there is no shadow, because brand.md defines none.
 *
 * The whole card is one real `<a>` (not a JS click handler), so it is
 * keyboard-reachable and middle-clickable, and the focus ring lands on the
 * link rather than the inner frame.
 *
 * With no lead photo, `PhotoFrame` renders its navy block holding a
 * placeholder chip — the common post-2.09 state. Title and decade are both
 * required in the model, so a card is never blank or broken.
 *
 * The `Reveal` sits *inside* the `<li>`: a `<ul>` may only contain `<li>`, so
 * wrapping the card from the outside would put Reveal's `<div>` straight into
 * the list and break both the markup and the announced item count.
 */
export function SeasonCard({
  season,
  delayIndex = 0,
  priority = false,
}: {
  season: SeasonCardData;
  delayIndex?: number;
  /** Set on the FIRST card of the first decade only. Lighthouse's trace named
   *  that card's photograph as /arhiva's LCP element while it carried no
   *  priority hint at all, so the page's largest paint was competing with 95
   *  lazy siblings and the header crest's preload (D-3.09-2). */
  priority?: boolean;
}) {
  return (
    // `u-card` is `height: 100%`, which only resolves if every wrapper between
    // it and the grid track is full-height too — see the note on `LegendCard`.
    <li className="h-full">
      {/* A priority card is by definition in the first viewport, so it opts out
          of the reveal as well as the lazy queue — otherwise the LCP element
          waits for the observer before it paints (D-3.09-3). */}
      <Reveal
        delayIndex={delayIndex}
        immediate={priority}
        className="h-full"
      >
        <Link
          href={`/arhiva/${season.slug}`}
          className={`u-card u-card--light ${focusOnPaper}`}
        >
          <PhotoFrame
            image={season.leadPhoto?.image ?? null}
            // A real caption is real information and stays. The FALLBACK does
            // not: „Фотографија од Сезона 1992/93" only repeated the card's own
            // <h3>, one element below and inside the same link, so the link
            // announced the season twice and the reader learned nothing about
            // the photograph. With no caption the archive knows nothing about
            // the scan beyond which season it belongs to — which the card
            // already says — so it is decorative here.
            alt={season.leadPhoto?.caption ?? ""}
            ratio="3/2"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            width={800}
            priority={priority}
            placeholderLabel="фотографија од сезоната"
          />
          <div className="p-4">
            {/* The decade — not orange (2.8:1 on a light surface fails AA,
                brand rule 3) and not a league (no such field exists). */}
            <p className="text-overline font-bold uppercase tracking-overline text-neutral-500">
              {decadeLabel(season.decade)}
            </p>
            <h3 className="u-h3 mt-2 text-navy">{season.title}</h3>
          </div>
        </Link>
      </Reveal>
    </li>
  );
}

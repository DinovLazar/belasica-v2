import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  PhotoFrameView,
  type FramedImage,
} from "@/components/home/PhotoFrameView";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";
import { initials, orderedRoles } from "@/lib/people";
import { RoleChips } from "./RoleChips";

export type LegendCardData = {
  name: string | null;
  slug: string;
  role: string[] | null;
  playingYears: string | null;
  /** The book's all-time rank (1–80), or null for anyone it does not rank —
   *  every trainer and president, and the unranked players. */
  legendRank?: number | null;
  /** The appearance count the rank is built on, as the book PRINTS it: a
   *  string, because nine of the eighty are given as a range („120–135").
   *  See `person.legendAppearances` in the schema (D-3.15-4). */
  legendAppearances?: string | null;
  /** The authoritative career total — the same field the person page shows.
   *  The FALLBACK count: it is what the card prints for everyone the book does
   *  not list a printed figure for (3.19, owner: „кај сите играчи треба да има
   *  бројка на натпревари"). */
  careerStats?: { appearances: number | null } | null;
  /** Already resolved to a CDN URL by the server, via `framedImage()`. This
   *  card is reached through `LegendsBrowser`'s client boundary on /legendi, so
   *  it may not hold a raw Sanity asset or import the URL builder (D-3.09-1). */
  portrait: FramedImage | null;
};

/**
 * Legend card — brand.md §Components („Card"): a hard-edged block with the
 * portrait flush to its edges, no mat and no radius. Hover wipes the 6px
 * orange bar in along the BOTTOM edge and lifts the card 4px, so the motif
 * reads as the page's own bar arriving rather than a new decoration; there is
 * no shadow, because brand.md defines no shadow token.
 *
 * Two surfaces (brand.md §Components): `onNavy` gives the second navy value,
 * for a card sitting inside a navy block (the homepage marquee); the default
 * is a white card on a paper block (`/legendi`).
 *
 * The whole card is one real `<a>`, so it is keyboard-reachable and
 * middle-clickable and the focus ring lands on the link rather than an inner
 * element.
 *
 * The `Reveal` sits *inside* the `<li>`: a `<ul>` may only contain `<li>`, so
 * wrapping from the outside would put Reveal's `<div>` straight into the list
 * and break both the markup and the announced item count.
 */
export function LegendCard({
  person,
  delayIndex = 0,
  onNavy = false,
  priority = false,
  // Default matches /legendi's RoleBandGrid (1 col → sm:2 → lg:3). A grid
  // with other tracks (the homepage 2/3/5 marquee) passes its own string —
  // the default overfetches ~106 KiB there (Lighthouse image-delivery).
  sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
}: {
  person: LegendCardData;
  delayIndex?: number;
  /** Set for a card inside a navy block; default is a white card on paper. */
  onNavy?: boolean;
  /** The FIRST card of /legendi only — Lighthouse named its portrait as the
   *  route's LCP element. Carries the priority hint and opts out of the reveal
   *  (D-3.09-2, D-3.09-3). */
  priority?: boolean;
  sizes?: string;
}) {
  const roles = orderedRoles(person.role);
  const years = person.playingYears?.trim() || null;

  // The count is now independent of the rank (3.19). Until then it showed only
  // for the eighty players the book ranks AND prints a figure for, so most of
  // the roster carried no number at all; the owner asked for one on every
  // player. Two sources, in order:
  //
  //   1. `legendAppearances` — the book's printed figure, kept as a string
  //      because nine of the eighty are given as a range („120–135").
  //   2. `careerStats.appearances` — the authoritative career total, and the
  //      same number `/legendi/<slug>` prints under „Настапи". 48 players hold
  //      one of these and no printed figure.
  //
  // A person with neither renders no number — never a zero, a dash or a chip,
  // because the archive simply does not hold one (content truth; the no-`0`
  // rule from 2.04). `!= null` rather than falsiness, so a genuine recorded 0
  // survives, exactly as on the person page. Trainers and officials are
  // unaffected in practice: no one outside the Играчи band carries
  // `careerStats.appearances` today, and the field is only ever read, never
  // derived.
  const rank = person.legendRank ?? null;
  const career = person.careerStats?.appearances;
  const appearances =
    person.legendAppearances?.trim() ||
    (career != null ? String(career) : null);

  // Quieter than the name, on whichever surface the card sits: `paper/80` is
  // 9.90:1 on navy, `neutral-500` is 6.69:1 on the white card. Both clear AA
  // for body text, so the "quiet" here is hierarchy, not a contrast compromise.
  const quiet = onNavy ? "text-paper/80" : "text-neutral-500";

  return (
    // `u-card` is `height: 100%`, which only resolves if every wrapper between
    // it and the grid track is full-height too — otherwise cards in a row end
    // at different depths wherever one has an extra line (a second role chip,
    // a placeholder). The chain is `li → Reveal div → a`.
    <li className="h-full">
      <Reveal delayIndex={delayIndex} immediate={priority} className="h-full">
        <Link
          href={`/legendi/${person.slug}`}
          className={cn(
            "u-card",
            !onNavy && "u-card--light",
            onNavy ? focusOnNavy : focusOnPaper,
          )}
        >
          {person.portrait ? (
            <PhotoFrameView
              image={person.portrait}
              alt={person.name ?? "Архивски портрет"}
              ratio="4/5"
              fit="cover"
              sizes={sizes}
              priority={priority}
              placeholderLabel="портрет"
            />
          ) : (
            <MonogramBlock name={person.name} onNavy={onNavy} />
          )}

          <div className="p-4">
            {/* `1. Петар Андреев   555` — the rank reads as a list index at
                the name's own size but in the quiet ink, and the count is
                pushed to the end of the line by the name's `flex-1`. Baseline
                alignment, not centre: when a long name wraps to two lines the
                count stays level with the FIRST line, where the eye scans it.
                Both carry an `sr-only` qualifier, so the card announces „Ранг
                1. … 555 настапи" rather than two bare numbers. */}
            <h3
              className={cn(
                "u-h3 flex items-baseline gap-x-2",
                onNavy ? "text-paper" : "text-navy",
              )}
            >
              {rank !== null && (
                <span className={cn("shrink-0", quiet)}>
                  <span className="sr-only">Ранг </span>
                  {rank}.
                </span>
              )}

              <span className="min-w-0 flex-1">
                {/* `name` is required in the model, so this should never fire —
                    but a document could still be published without one, and an
                    invented fallback would be a made-up person on an archive
                    page. Show the gap instead (content-truth). */}
                {person.name ?? (
                  <PlaceholderChip label="име на личноста" onNavy={onNavy} />
                )}
              </span>

              {appearances && (
                <span className={cn("shrink-0 text-small tabular-nums", quiet)}>
                  {appearances}
                  <span className="sr-only"> настапи</span>
                </span>
              )}
            </h3>

            {roles.length > 0 && (
              <RoleChips roles={roles} onNavy={onNavy} className="mt-3" />
            )}

            {/* Missing years now **self-omit**, like every other gap on this
                site (D-2.02-3, D-2.08-2, D-3.15-6). Until 3.15 a player with no
                `playingYears` rendered a registered placeholder chip here; no
                published player is in that state today, and inventing years to
                clear a chip is exactly what content-truth forbids, so the line
                simply does not render. */}
            {years && <p className={cn("mt-3 text-small", quiet)}>{years}</p>}
          </div>
        </Link>
      </Reveal>
    </li>
  );
}

/**
 * The photo-less portrait state — brand.md §Photo treatment: a monogram block
 * on the deep navy with an orange inset keyline. Never a stand-in face, never
 * a grey box.
 *
 * This deliberately differs from the season *card*, which keeps PhotoFrame's
 * mist mat + chip. A season has no initials, so its mat is the honest empty
 * frame; a person does, so the block reads as a deliberate monogram rather
 * than a missing image. Most trainers and officials will never have a
 * portrait, so this is the common state, not an edge case.
 */
function MonogramBlock({
  name,
  onNavy,
}: {
  name: string | null;
  onNavy: boolean;
}) {
  const monogram = name ? initials(name) : null;

  return (
    // A 2px orange keyline, as a real border rather than an inset shadow —
    // brand rule 7 has no shadow token, and a keyline is not elevation.
    <div className="flex aspect-[4/5] w-full items-center justify-center border-2 border-orange/50 bg-navy">
      {monogram ? (
        // Decorative: the `<h3>` below already carries the name, so announcing
        // the initials again would just stutter.
        <span
          aria-hidden
          className="font-display text-h2 font-bold uppercase text-orange"
        >
          {monogram}
        </span>
      ) : (
        <PlaceholderChip label="портрет" onNavy={onNavy} />
      )}
    </div>
  );
}

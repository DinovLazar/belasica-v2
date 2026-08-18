import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  PhotoFrameView,
  type FramedImage,
} from "@/components/home/PhotoFrameView";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";
import {
  appearanceCountLabel,
  goalCountLabel,
  initials,
  orderedRoles,
  type LegendCategory,
} from "@/lib/people";
import { RoleChips } from "./RoleChips";

export type LegendCardData = {
  name: string | null;
  slug: string;
  role: string[] | null;
  /**
   * Every field below `role` is **optional as of 3.27**, and that is the type
   * doing real work rather than being loosened for convenience.
   *
   * The server projects a card for the tab it will appear in and sends only the
   * facts that tab renders (`/legendi/page.tsx`), so a Тренери card genuinely
   * has no `legendRank` and no `careerStats` on it — not null, absent. Required
   * fields would have forced a `null` for each, which is the same bundle payload
   * and a weaker statement about what a coaching card is.
   */
  playingYears?: string | null;
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
  /** The years the man COACHED — never his playing span. Rendered on the
   *  Тренери card only (3.27). */
  trainerYears?: string | null;
  /** The years he served as president or official. Претседатели card only. */
  officialYears?: string | null;
  /** WHOLE-CAREER figures — every club plus the national team, from public
   *  records. Rendered on the Репрезентативци card only, and never mixed with
   *  or substituted for `careerStats`, which is Belasica-only and has different
   *  provenance (D-2.01-3, OV-47). `sourceNote` is deliberately NOT here: the
   *  card prints no provenance, so the note would be bundle weight nobody
   *  reads. The person page selects it separately and renders it. */
  nationalStats?: { appearances: number | null; goals: number | null } | null;
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
  category = "player",
  delayIndex = 0,
  onNavy = false,
  priority = false,
  // Default matches /legendi's CategoryGrid (1 col → sm:2 → lg:3). A grid
  // with other tracks (the homepage 2/3/5 marquee) passes its own string —
  // the default overfetches ~106 KiB there (Lighthouse image-delivery).
  sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
}: {
  person: LegendCardData;
  /**
   * **The tab this card is in — which decides what it shows (3.27).**
   *
   * Passed in rather than derived from `person.role`, and the difference is the
   * whole point: one man can be a player, a coach and an international at once,
   * so his own roles cannot say which of his facts belong on the card. Only the
   * category he is being listed under can. Deriving it here is what produced the
   * defect this replaced — a coach's card carrying his player ranking.
   *
   * Defaults to `"player"`, which is exactly what the homepage marquee renders:
   * its ten are selected by `legendRank` in GROQ and it prints rank, years and
   * appearances. The default keeps that surface byte-identical and out of this
   * phase's scope.
   */
  category?: LegendCategory;
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

  /**
   * **One span per category (3.27).** Each tab prints the years that belong to
   * it and nothing else: a coach's card said „1982–1990" when that was when he
   * PLAYED, which on a page headed Тренери reads as when he coached. Ace's
   * instruction was that the years follow the role.
   *
   * Репрезентативци prints no span at all. `playingYears` is the man's Belasica
   * span, so printing it under a heading about his career elsewhere is the same
   * category error as printing his Belasica appearance count there (D-3.27-6).
   */
  const years =
    category === "player"
      ? person.playingYears?.trim() || null
      : category === "trainer"
        ? person.trainerYears?.trim() || null
        : category === "president"
          ? person.officialYears?.trim() || null
          : null;

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
  // survives, exactly as on the person page.
  //
  // **Both are Играчи-only since 3.27.** The rank is the book's ranking of
  // PLAYERS and the count is the Belasica figure it is built on; neither
  // describes a man's coaching or his presidency, and on the Репрезентативци tab
  // the Belasica count actively contradicts the heading above it (OV-47).
  //
  // Until 3.27 the safety here was accidental — trainers and officials were
  // unaffected only because nobody outside Играчи happened to carry
  // `careerStats.appearances`. That is no longer the mechanism, and it is a good
  // thing: 34 of the 211 are cross-listed, and the day a coach is given a career
  // total the old reasoning would have printed it under Тренери. The TAB decides
  // now, so a coach who is also ranked keeps his rank on Играчи and carries
  // neither the rank nor the count into Тренери.
  const rank = category === "player" ? (person.legendRank ?? null) : null;
  const career = person.careerStats?.appearances;
  const appearances =
    category === "player"
      ? person.legendAppearances?.trim() ||
        (career != null ? String(career) : null)
      : null;

  /**
   * The Репрезентативци figures — the man's WHOLE career, every club plus the
   * national team, which is the only scope that makes sense on a tab about what
   * he did beyond Беласица.
   *
   * Read from `nationalStats` and from nowhere else. There is deliberately **no
   * fallback to `careerStats`**: the two have different scopes and different
   * sources, so substituting one would print a number whose provenance the
   * reader cannot determine — exactly OV-47. Where the whole-career figure has
   * not been compiled yet the line simply does not render.
   *
   * `!= null` rather than falsiness, so a genuine recorded 0 survives — a
   * defender really can have scored none for his country, and „0 голови" is then
   * a fact rather than a gap.
   *
   * **Empty for all ten men today**, because this phase adds the field and
   * enters no data into it (the numbers come from Ace and from public records,
   * and a script inventing them would be inventing facts). The Репрезентативци
   * cards therefore show a name and chips until the content pass fills them in.
   */
  const nationalApps =
    category === "international"
      ? (person.nationalStats?.appearances ?? null)
      : null;
  const nationalGoals =
    category === "international" ? (person.nationalStats?.goals ?? null) : null;
  const wholeCareer =
    nationalApps != null || nationalGoals != null
      ? [
          nationalApps != null ? appearanceCountLabel(nationalApps) : null,
          nationalGoals != null ? goalCountLabel(nationalGoals) : null,
        ]
          .filter(Boolean)
          .join(", ")
      : null;

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

            {/* Репрезентативци only. The scope is stated in the line itself —
                „За репрезентацијата" — because that is the one thing a reader
                cannot infer from a bare number, and because the same card shows
                a Belasica figure on the Играчи tab. Never rendered beside the
                Belasica count: the two never appear on the same card, so there
                is no surface where a reader must guess which is which.

                3.30 narrowed the claim from whole-career totals to
                national-team caps: the whole-career figures proved
                unsourceable (Transfermarkt blocks automated reads, Wikipedia
                is league-only), while the caps agree across Ace's biographies
                and his book (D-3.30-1). */}
            {wholeCareer && (
              <p className={cn("mt-3 text-small tabular-nums", quiet)}>
                За репрезентацијата: {wholeCareer}
              </p>
            )}
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

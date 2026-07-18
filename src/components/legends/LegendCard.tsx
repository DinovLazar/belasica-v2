import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { PhotoFrame } from "@/components/home/PhotoFrame";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { focusOnPaper } from "@/lib/focus";
import { initials, orderedRoles } from "@/lib/people";
import { RoleChips } from "./RoleChips";

export type LegendCardData = {
  name: string | null;
  slug: string;
  role: string[] | null;
  playingYears: string | null;
  portrait: SanityImageSource | null;
};

/**
 * Legend card (handover §6.1) — 4:5 portrait, serif navy name, role chip(s),
 * playing years. brand.md §Components („Person card") plus the `SeasonCard`
 * card-lift: a 2px lift on hover and **no shadow**, because brand.md defines no
 * shadow token (the handover §1 calls for a „softened shadow"; the repo wins).
 *
 * The whole card is one real `<a>`, so it is keyboard-reachable and
 * middle-clickable and the focus ring lands on the link rather than an inner
 * element (§6.1 a11y).
 *
 * The `Reveal` sits *inside* the `<li>`: a `<ul>` may only contain `<li>`, so
 * wrapping from the outside would put Reveal's `<div>` straight into the list
 * and break both the markup and the announced item count (same as `SeasonCard`).
 */
export function LegendCard({
  person,
  delayIndex = 0,
}: {
  person: LegendCardData;
  delayIndex?: number;
}) {
  const roles = orderedRoles(person.role);
  const years = person.playingYears?.trim() || null;

  // A player's years are a *known-missing fact*, so they get a registered
  // placeholder — the homepage legends grid sets this precedent. A trainer or
  // president has no playing years to be missing, so the line simply omits
  // rather than accusing the archive of a gap that isn't one (§1 empty rule).
  const showYearsPlaceholder = !years && roles[0] === "player";

  return (
    <li>
      <Reveal delayIndex={delayIndex}>
        <Link
          href={`/legendi/${person.slug}`}
          className={`group block overflow-hidden rounded-card border border-mist bg-white transition-transform duration-150 ease-out hover:-translate-y-0.5 ${focusOnPaper}`}
        >
          {person.portrait ? (
            <PhotoFrame
              image={person.portrait}
              alt={person.name ?? "Архивски портрет"}
              ratio="4/5"
              fit="cover"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              width={800}
              placeholderLabel="портрет"
              // Flush to the card's top edge: the card already supplies the
              // border and radius, so the frame keeps only the hairline that
              // separates portrait from body.
              className="rounded-none border-0 border-b border-mist"
            />
          ) : (
            <InitialsTile name={person.name} />
          )}

          <div className="p-5">
            <h3 className="font-serif text-h3 font-semibold text-navy decoration-2 underline-offset-4 group-hover:underline group-hover:decoration-orange">
              {/* `name` is required in the model, so this should never fire —
                  but a document could still be published without one, and an
                  invented fallback would be a made-up person on an archive
                  page. Show the gap instead (content-truth). */}
              {person.name ?? <PlaceholderChip label="име на личноста" />}
            </h3>

            {roles.length > 0 && <RoleChips roles={roles} className="mt-3" />}

            {(years || showYearsPlaceholder) && (
              <p className="mt-3 text-small text-neutral-500">
                {years ?? <PlaceholderChip label="години на играње" />}
              </p>
            )}
          </div>
        </Link>
      </Reveal>
    </li>
  );
}

/**
 * The photo-less portrait state (handover §2 „States"): a solid navy tile
 * carrying the person's initials — never a greybox.
 *
 * This deliberately differs from the season *card*, which keeps `PhotoFrame`'s
 * Mist greybox + chip (2.02 §5.5/§7). A season has no initials, so its greybox
 * is the honest empty frame; a person does, so the tile reads as a deliberate
 * monogram rather than a missing image — the same reasoning as the season
 * page's navy title band (2.02 §6.2b). Most trainers and officials will never
 * have a portrait, so this is the common state, not an edge case.
 */
function InitialsTile({ name }: { name: string | null }) {
  const monogram = name ? initials(name) : null;

  return (
    <div className="flex aspect-[4/5] w-full items-center justify-center border-b border-mist bg-navy">
      {monogram ? (
        // Decorative: the `<h3>` below already carries the name, so announcing
        // the initials again would just stutter.
        <span
          aria-hidden
          className="font-serif text-display font-semibold text-paper"
        >
          {monogram}
        </span>
      ) : (
        <PlaceholderChip label="портрет" />
      )}
    </div>
  );
}

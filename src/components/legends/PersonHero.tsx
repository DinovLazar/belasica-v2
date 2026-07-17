import type { SanityImageSource } from "@sanity/image-url";
import { Container } from "@/components/Container";
import { PhotoFrame } from "@/components/home/PhotoFrame";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { initials, type PersonRole } from "@/lib/people";
import { RoleChips } from "./RoleChips";

/**
 * Person hero (handover §6.3) — portrait-left / text-right at desktop, stacked
 * at mobile. The person's name is the page's single `<h1>`.
 *
 * Two variants, mirroring the season hero (2.02 §6.2/§6.2b):
 *  - **with portrait** — the portrait sits on paper beside the name.
 *  - **photo-less** — a solid **navy band** carrying a monogram plate, never a
 *    greybox at hero scale. Most trainers and officials have no portrait, so
 *    this is the common state; it reads as a deliberate title band rather than
 *    as a missing image.
 */
export function PersonHero({
  name,
  roles,
  playingYears,
  portrait,
}: {
  name: string | null;
  roles: PersonRole[];
  playingYears: string | null;
  portrait: SanityImageSource | null;
}) {
  const years = playingYears?.trim() || null;

  if (!portrait) {
    return (
      <section aria-labelledby="person-heading" className="bg-navy py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <MonogramPlate name={name} />
            <PersonHeroText
              name={name}
              roles={roles}
              years={years}
              onNavy
            />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section aria-labelledby="person-heading" className="py-10 md:py-16">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          <div className="w-full shrink-0 md:w-[300px]">
            <PhotoFrame
              image={portrait}
              alt={name ?? "Архивски портрет"}
              ratio="4/5"
              fit="cover"
              sizes="(min-width:768px) 300px, 100vw"
              width={800}
              priority
              placeholderLabel="портрет"
            />
          </div>
          <PersonHeroText name={name} roles={roles} years={years} />
        </div>
      </Container>
    </section>
  );
}

/**
 * Name + roles + years, shared by both variants so they cannot drift apart.
 * On the navy band every value flips to paper (13.0:1); on paper the name is
 * navy (13.0:1) and the years neutral-500 (4.9:1). Both pass AA.
 */
function PersonHeroText({
  name,
  roles,
  years,
  onNavy = false,
}: {
  name: string | null;
  roles: PersonRole[];
  years: string | null;
  onNavy?: boolean;
}) {
  return (
    <div className="max-w-measure">
      <h1
        id="person-heading"
        className={`font-serif text-h1 font-semibold md:text-display ${
          onNavy ? "text-paper" : "text-navy"
        }`}
      >
        {/* `name` is required in the model, so this should never fire — but a
            document could still be published without one, and an invented
            fallback would be a made-up person on an archive page. */}
        {name ?? <PlaceholderChip label="име на личноста" />}
      </h1>

      {roles.length > 0 && (
        <RoleChips roles={roles} onNavy={onNavy} className="mt-5" />
      )}

      {years && (
        <p
          className={`mt-5 text-body-l ${
            onNavy ? "text-paper/80" : "text-neutral-500"
          }`}
        >
          {years}
        </p>
      )}
    </div>
  );
}

/**
 * The photo-less monogram — a bordered plate on the navy band, matching the
 * portrait's 4:5 so the two hero variants keep the same rhythm. Capped at 300px
 * to match the portrait column; a full-width monogram would dwarf the name.
 */
function MonogramPlate({ name }: { name: string | null }) {
  const monogram = name ? initials(name) : null;

  return (
    <div className="w-full shrink-0 md:w-[300px]">
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-photo border border-paper/30 bg-paper/5">
        {monogram ? (
          // Decorative: the `<h1>` beside it already carries the name.
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
    </div>
  );
}

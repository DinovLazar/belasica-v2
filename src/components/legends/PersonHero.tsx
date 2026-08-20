import type { SanityImageSource } from "@sanity/image-url";
import { Container } from "@/components/Container";
import { Breadcrumb, type Crumb } from "@/components/archive/Breadcrumb";
import { PhotoFrame } from "@/components/home/PhotoFrame";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { initials, type PersonRole } from "@/lib/people";
import { RoleChips } from "./RoleChips";

/**
 * Person hero — the person page's opening block, and the `PageHeader` pattern
 * with a portrait in it: breadcrumb → portrait beside name → roles → years, all
 * on the navy block that opens every page on the site (brand.md §Components).
 *
 * At 3.05 both variants moved onto navy. Before, a person WITH a portrait got a
 * paper hero and a person WITHOUT got a navy band — two different page openings
 * decided by whether a photograph happened to exist, which made the roster feel
 * inconsistent as you clicked through it. Now the block is constant and only
 * its left column changes: a portrait, or a monogram plate. That also makes the
 * text's contrast deterministic (paper on navy, 14.95:1) instead of depending
 * on the variant.
 *
 * Most trainers and officials have no portrait, so the monogram is the common
 * state, not an edge case — it reads as a deliberate plate, never a greybox.
 */
export function PersonHero({
  name,
  roles,
  playingYears,
  portrait,
  crumbs,
}: {
  name: string | null;
  roles: PersonRole[];
  playingYears: string | null;
  portrait: SanityImageSource | null;
  crumbs: Crumb[];
}) {
  const years = playingYears?.trim() || null;

  return (
    <section aria-labelledby="person-heading" className="bg-navy">
      <Container className="py-section">
        <Breadcrumb items={crumbs} onNavy />

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:gap-12">
          <div className="w-full shrink-0 md:w-[300px]">
            {portrait ? (
              <PhotoFrame
                image={portrait}
                // „Архивски портрет", never the name. The <h1> two elements
                // down IS the name, so `alt={name}` had a screen reader read it
                // twice in a row — flagged by axe as `image-redundant-alt` on
                // 141 of the 212 person pages. The archive holds no caption for
                // these scans, so the name was the whole of the alt and there
                // was nothing else in it to keep; what is left states what the
                // image is and claims nothing the archive has not verified.
                alt="Архивски портрет"
                ratio="4/5"
                fit="cover"
                sizes="(min-width:768px) 300px, 100vw"
                width={800}
                priority
                placeholderLabel="портрет"
              />
            ) : (
              <MonogramPlate name={name} />
            )}
          </div>

          <div className="max-w-measure">
            <h1 id="person-heading" className="u-h1 text-paper">
              {/* `name` is required in the model, so this should never fire —
                  but a document could still be published without one, and an
                  invented fallback would be a made-up person on an archive
                  page. */}
              {name ?? <PlaceholderChip label="име на личноста" onNavy />}
            </h1>

            {roles.length > 0 && (
              <RoleChips roles={roles} onNavy className="mt-5" />
            )}

            {years && (
              <p className="mt-5 text-body-l text-paper/80">{years}</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The photo-less monogram — a plate matching the portrait's 4:5 so both hero
 * variants keep the same rhythm, with the orange keyline the legend cards use.
 */
function MonogramPlate({ name }: { name: string | null }) {
  const monogram = name ? initials(name) : null;

  return (
    <div className="flex aspect-[4/5] w-full items-center justify-center border-2 border-orange/50 bg-navy-2">
      {monogram ? (
        // Decorative: the `<h1>` beside it already carries the name.
        <span aria-hidden className="u-display text-orange">
          {monogram}
        </span>
      ) : (
        <PlaceholderChip label="портрет" onNavy />
      )}
    </div>
  );
}

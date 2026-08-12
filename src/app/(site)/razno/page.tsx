import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/home/Reveal";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";
import {
  RAZNO_INTRO,
  RAZNO_META_DESCRIPTION,
  RAZNO_TITLE,
  RAZNO_TOPICS,
} from "@/content/razno";

/**
 * /razno — the index of the seven topics that belong to no single season and
 * no single person (Phase 3.16).
 *
 * A **static server component**, like `/pravni-informacii`: the copy is a
 * build-time constant in `@/content/razno`, so there is no Sanity read and no
 * `revalidate` — an ISR window on a page that never fetches would be noise
 * (the same reasoning D-3.07-8 records for the legal page).
 *
 * Shape follows `/legendi`: navy `PageHeader` with a real count, then a 3/2/1
 * grid of cards.
 *
 * The cards carried no photograph until the owner asked for one on 11.08.2026
 * („на секоја тема, нека има и мала слика од темата"). Each card now opens on
 * the single frame its topic names as `cardPhoto` — a member of that topic's
 * own `photos` array, chosen by hand, never the first file by default. A topic
 * that names none still renders a text-only card: **no empty frame and no
 * placeholder chip** goes where a picture is missing, which is the rule this
 * page has followed since 3.16 (brief decision 3).
 */

export const metadata: Metadata = {
  title: RAZNO_TITLE,
  description: RAZNO_META_DESCRIPTION,
};

/** „7 теми" — declined for 1 and for the general plural. Derived from the
 *  array's length rather than typed, so the page cannot contradict its own
 *  content (the `bandCountLabel` rule on /legendi). */
function topicCountLabel(count: number): string {
  return `${count} ${count === 1 ? "тема" : "теми"}`;
}

export default function RaznoPage() {
  return (
    <>
      <PageHeader
        title={RAZNO_TITLE}
        crumbs={[{ label: "Почетна", href: "/" }, { label: RAZNO_TITLE }]}
        intro={RAZNO_INTRO}
        meta={topicCountLabel(RAZNO_TOPICS.length)}
      />

      <Container className="py-section">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RAZNO_TOPICS.map((topic, i) => (
            // `u-card` is `height: 100%`, which only resolves if every wrapper
            // between it and the grid track is full-height too — the chain is
            // `li → Reveal div → a`, as on `LegendCard`. Without it the cards in
            // a row end at different depths wherever one summary wraps further.
            <li key={topic.slug} className="h-full">
              <Reveal delayIndex={i % 3} className="h-full">
                <Link
                  href={`/razno/${topic.slug}`}
                  className={cn(
                    // The standard card: white on the paper block, a 6px orange
                    // bar wiping in along the BOTTOM edge on hover plus a 4px
                    // lift, and no shadow (brand rule 7). `flex` overrides
                    // `u-card`'s `display: block` — utilities outrank the
                    // components layer.
                    //
                    // The padding moved off the link and onto the text block
                    // below, so the photograph sits flush to the card's edges —
                    // the same anatomy `SeasonCard` already uses (3:2 lead
                    // image, then a padded text block). No new token: the frame
                    // is `aspect-[3/2]`, `border-mist` and `bg-mist`, all of
                    // which the photo grid on the topic pages already uses.
                    "u-card u-card--light flex flex-col",
                    focusOnPaper,
                  )}
                >
                  {/* Owner feedback 11.08.2026 — „на секоја тема, нека има и
                      мала слика од темата, ќе делува попривлечно". The frame
                      renders only where the topic names one, so a future topic
                      with no photographs still produces a card rather than an
                      empty grey box.

                      `object-cover`, where the topic page's grid uses
                      `object-contain`: the grid is the archive view and must
                      not crop a scan, but the card is a teaser and a letterboxed
                      thumbnail with mist bars down both sides is exactly the
                      "unattractive" the owner is asking to fix. The uncropped
                      photograph is one click away.

                      `alt=""` — the picture is decorative here. The link's
                      accessible name is already the topic heading beneath it,
                      and the archive does not describe a photograph it has no
                      description for (`CLAUDE.md` §Content truth). */}
                  {topic.cardPhoto && (
                    <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-mist bg-mist">
                      {/* Plain `<img>`, as in `RaznoPhotoGrid`: these are static
                          WebP files already optimised at the size they render,
                          with no Sanity asset behind them. `width`/`height` are
                          the file's own, so the box is reserved before the bytes
                          arrive. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={topic.cardPhoto.src}
                        alt=""
                        width={topic.cardPhoto.width}
                        height={topic.cardPhoto.height}
                        // The first row is above the fold on every breakpoint.
                        loading={i < 3 ? "eager" : "lazy"}
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-3 p-6">
                    {/* `navTitle`, not `title`: „Стадион „Благој Истатов"" is
                        the page's H1, but „Средби со Партизан од Белград" set in
                        condensed caps runs to three lines in a card column. */}
                    <h2 className="u-h3 text-navy">{topic.navTitle}</h2>
                    <p className="text-body text-neutral-700">{topic.summary}</p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

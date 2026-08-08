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
 * grid of cards. The cards are `SeasonCard`/`LegendCard` minus the photograph —
 * photographs for these seven topics exist but are a separate phase, and this
 * page renders **no empty frame and no placeholder chip** where one will later
 * go (brief decision 3).
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
                    "u-card u-card--light flex flex-col gap-3 p-6",
                    focusOnPaper,
                  )}
                >
                  {/* `navTitle`, not `title`: „Стадион „Благој Истатов"" is the
                      page's H1, but „Средби со Партизан од Белград" set in
                      condensed caps runs to three lines in a card column. */}
                  <h2 className="u-h3 text-navy">{topic.navTitle}</h2>
                  <p className="text-body text-neutral-700">{topic.summary}</p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

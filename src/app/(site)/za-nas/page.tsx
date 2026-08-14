import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fetchOrThrow } from "@/sanity/fetch";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/home/Reveal";
import { focusOnPaper } from "@/lib/focus";
import {
  ABOUT_AUTHOR_PARAGRAPH,
  ABOUT_DEDICATION_PARAGRAPH,
  ABOUT_FATHER_NAME,
  UNOFFICIAL_ARCHIVE_LABEL,
  UNOFFICIAL_ARCHIVE_STATEMENT,
} from "@/lib/facts";

// Match the other routes (D-1.05-4). Since 3.15 this page does read Sanity —
// one tiny query for the father's person page — so the value is now doing real
// work rather than sitting there for consistency.
export const revalidate = 60;

export const metadata: Metadata = {
  // Its own path, relative — resolved against `metadataBase`, so the
  // domain cutover stays one environment variable (3.23, B2).
  alternates: { canonical: "/za-nas" },
  title: "За нас",
  description:
    "За неофицијалната архива на ФК Беласица — што е ова место и кој стои зад него.",
};

/**
 * /za-nas — **no longer provisional.**
 *
 * Until 3.15 this page opened with the provisional „в подготовка" banner and
 * four placeholder chips, because the two things it exists to say — who made
 * the archive (PL-1) and the thread about his father (PL-2) — were not yet
 * VERIFIED. The owner supplied the copy on 2026-08-08 in the author's own
 * words, so **the banner, the chips and D-2.05-1 all retire here** (D-3.15-7)
 * and this route renders zero placeholders.
 *
 * `/za-nas` was the last page carrying that banner, so its removal is also what
 * finally makes 3.10's unmet DoD line pass: the banner's headline string now
 * appears nowhere in `src/` outside the state files' record of it (D-3.10-9).
 *
 * The copy is rendered **verbatim** from `src/lib/facts.ts` — see the warning
 * on `ABOUT_AUTHOR_PARAGRAPH` before touching a character of it.
 *
 * Handover §4 also specs an **optional hero portrait**. Still omitted, and
 * still not by choice: the locked model (2.01) has no field to hold one, and
 * adding one is a schema change outside this phase (D-2.06-4). §4 says the hero
 * „omits otherwise", so an always-omitted hero is the spec's own empty state.
 */

/** Exactly one published person named „Томе Стојанов" → his slug; otherwise
 *  null. Written as a count + slug pair rather than `[0]` on purpose: if a
 *  second „Томе Стојанов" is ever published, the link must go away rather than
 *  quietly point at whichever document GROQ happened to return first. */
const FATHER_QUERY = /* groq */ `{
  "count": count(*[_type == "person" && name == $name && defined(slug.current)]),
  "slug": *[_type == "person" && name == $name && defined(slug.current)][0].slug.current
}`;

type FatherResult = { count: number; slug: string | null };

// A mid-sentence link, so `inline` rather than the `inline-block` the legal
// page uses for its standalone links — inline-block would stop the name
// wrapping with the paragraph. `border-b-2` at this size instead of the
// standalone links' 3px: the rule sits inside running copy, not under a lone
// address. Orange is the RULE, never the ink (D-1.02-1).
const inlineLink = cn(
  "border-b-2 border-orange pb-0.5 font-bold text-navy transition-colors hover:border-navy",
  focusOnPaper,
);

export default async function AboutPage() {
  let father: FatherResult = { count: 0, slug: null };
  try {
    father = await fetchOrThrow<FatherResult>(
      FATHER_QUERY,
      { name: ABOUT_FATHER_NAME },
      "the About-page father link",
    );
  } catch {
    // The copy is the page; the link is an affordance on top of it. A CDN
    // wobble (D-3.05a-9) must not take the whole About page down with it, so
    // this degrades to plain text — the same graceful-fallback reasoning the
    // homepage records, and the same outcome as „no such person".
    father = { count: 0, slug: null };
  }

  const fatherHref =
    father.count === 1 && father.slug ? `/legendi/${father.slug}` : null;

  // Split on the name so the rendered text is byte-identical to the constant
  // whether or not the link resolves. `split` on a substring that occurs once
  // yields exactly two parts; if the copy is ever edited so the name no longer
  // appears, `after` is undefined and the whole paragraph renders unlinked.
  const [beforeFather, afterFather] =
    ABOUT_DEDICATION_PARAGRAPH.split(ABOUT_FATHER_NAME);

  return (
    <>
      <PageHeader
        title="За нас"
        crumbs={[{ label: "Почетна", href: "/" }, { label: "За нас" }]}
      />

      {/* A narrower measure than the archive templates: this is one editorial
          column, not a data document (§4). */}
      <Container className="py-section">
        <div className="max-w-measure">
          <Reveal>
            <p className="text-body-l text-ink">{ABOUT_AUTHOR_PARAGRAPH}</p>

            <p className="mt-6 text-body-l text-ink">
              {fatherHref && afterFather !== undefined ? (
                <>
                  {beforeFather}
                  <Link href={fatherHref} className={inlineLink}>
                    {ABOUT_FATHER_NAME}
                  </Link>
                  {afterFather}
                </>
              ) : (
                ABOUT_DEDICATION_PARAGRAPH
              )}
            </p>
          </Reveal>

          {/* OV-3 — VERIFIED, rendered verbatim from `facts.md` via
              `@/lib/facts`. Set apart in a white block capped by the orange
              bar: this is the statement the whole site is built around, and
              brand rule 2 puts it on every page. It sits AFTER the author's
              copy now — his words open the page, the site's own framing closes
              it. */}
          <Reveal>
            <div className="u-cap mt-12 bg-white p-6 md:p-8">
              <p className="text-overline font-bold uppercase tracking-overline text-neutral-700">
                {UNOFFICIAL_ARCHIVE_LABEL}
              </p>
              <p className="mt-3 text-body-l text-ink">
                {UNOFFICIAL_ARCHIVE_STATEMENT}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/archive/Breadcrumb";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import {
  UNOFFICIAL_ARCHIVE_LABEL,
  UNOFFICIAL_ARCHIVE_STATEMENT,
} from "@/lib/facts";

// Match the other routes (D-1.05-4). Nothing on this page reads Sanity yet, but
// the value stays consistent across the site and is correct the moment the
// PL-1/PL-2 copy lands.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "За нас",
  description:
    "За неофицијалната архива на ФК Беласица — што е ова место и кој стои зад него.",
};

/**
 * /za-nas — **provisional** (D-2.05-1).
 *
 * This page opens before the second Ace sit-down, so the two things it exists
 * to say — who made the archive (PL-1) and the thread about his father (PL-2) —
 * are not yet VERIFIED in `facts.md` and render as visible placeholder chips.
 * The one thing that *is* verified is the unofficial-archive framing (OV-3),
 * rendered verbatim.
 *
 * Handover §4 also specs an **optional hero portrait**. It is omitted here, and
 * not by choice: the locked model (2.01) has no field to hold one —
 * `siteSettings` carries only `title`, `description` and
 * `footerUnofficialArchiveText`, and adding a field is a schema change this
 * phase must not make (D-2.06-4). §4 says the hero „omits otherwise", so an
 * always-omitted hero is the spec's own empty state, not a deviation.
 */
export default function AboutPage() {
  return (
    <>
      <Container className="py-5">
        <Breadcrumb
          items={[{ label: "Почетна", href: "/" }, { label: "За нас" }]}
        />
      </Container>

      {/* A narrower measure than the archive templates: this is one editorial
          column, not a data document (§4). */}
      <Container className="pb-16 md:pb-24">
        <div className="max-w-measure">
          <ProvisionalBanner />

          <h1 className="mt-10 font-serif text-h1 font-semibold text-navy md:text-display">
            За нас
          </h1>

          {/* OV-3 — VERIFIED, rendered verbatim from `facts.md` via
              `@/lib/facts`. Set apart with a navy left rule: this is the
              statement the whole site is built around, and brand rule 2 puts it
              on every page. Navy is a legal rule colour here; the text stays
              ink/neutral-700 (D-1.02-1 governs orange, not navy). */}
          <Reveal>
            <div className="mt-8 border-l-2 border-navy pl-5 md:pl-6">
              <p className="text-overline font-semibold uppercase tracking-overline text-neutral-700">
                {UNOFFICIAL_ARCHIVE_LABEL}
              </p>
              <p className="mt-3 text-body-l text-ink">
                {UNOFFICIAL_ARCHIVE_STATEMENT}
              </p>
            </div>
          </Reveal>

          {/* PL-1 — Ace's public name + the About body. Both UNVERIFIED in
              `facts.md` („deferred by owner to the About-page phase (3.03)"),
              so both are chips. Writing a plausible paragraph here would be
              exactly the invention content-truth forbids. */}
          <Reveal>
            <section aria-labelledby="story-heading" className="mt-14">
              <h2
                id="story-heading"
                className="font-serif text-h3 font-semibold text-navy"
              >
                Кој ја води архивата
              </h2>
              <p className="mt-4 flex flex-wrap items-center gap-2 text-body text-neutral-700">
                <PlaceholderChip label="јавно име на авторот на архивата" />
              </p>
              <p className="mt-3">
                <PlaceholderChip label="текст за архивата — кој ја создал и зошто" />
              </p>
            </section>
          </Reveal>

          {/* PL-2 — the father thread: former Belasica player, name + playing
              years UNVERIFIED, deferred to 3.03. */}
          <Reveal>
            <section aria-labelledby="father-heading" className="mt-14">
              <h2
                id="father-heading"
                className="font-serif text-h3 font-semibold text-navy"
              >
                Врската со клубот
              </h2>
              <p className="mt-4 flex flex-wrap items-center gap-2">
                <PlaceholderChip label="име на таткото (поранешен играч на Беласица)" />
                <PlaceholderChip label="години на играње" />
              </p>
            </section>
          </Reveal>
        </div>
      </Container>
    </>
  );
}

/**
 * The in-page provisional banner (§4). Structural copy — it describes the
 * archive's own state and claims no fact about the club, so it needs no
 * `facts.md` entry, exactly like `SeasonEmptyNotice`.
 *
 * Mist rather than orange: this is a quiet caveat, and orange text on paper is
 * 2.8:1 and fails AA (D-1.02-1). It is a `<p>`, not a `role="status"` — the
 * text is present on first paint, not announced.
 */
function ProvisionalBanner() {
  return (
    <div className="rounded-card border border-dashed border-mist bg-white p-5">
      <p className="text-overline font-semibold uppercase tracking-overline text-neutral-700">
        Страницата е во подготовка
      </p>
      <p className="mt-2 text-small text-neutral-700">
        Текстот за архивата и за луѓето зад неа сѐ уште се дополнува. Полињата
        означени подолу допрва се пополнуваат.
      </p>
    </div>
  );
}

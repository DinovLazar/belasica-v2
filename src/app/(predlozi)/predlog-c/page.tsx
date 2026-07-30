import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { decadeAnchor, decadeLabel, seasonCountLabel } from "@/lib/archive";
import { initials } from "@/lib/people";
import { Reveal } from "../_shared/Reveal";
import {
  CTA,
  DECADES_LEAD,
  HERO_HERITAGE,
  KICKER,
  LEGENDS_LEAD,
  QUICKLINKS_LEAD,
  QUICK_LINKS,
  RECORDS_LEAD,
  STORY_LEAD,
} from "../_shared/copy";
import { getHomeView } from "../_shared/home";
import { golos, oswald } from "./fonts";
import { TerraceHeader } from "./_components/TerraceHeader";
import { TerraceFooter } from "./_components/TerraceFooter";
import { Block, Chip, Label } from "./_components/parts";
import "./c.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Предлог В — Трибина",
  description:
    "Предлог за визуелен правец на неофицијалната архива на ФК Беласица.",
  robots: { index: false, follow: false },
};

/**
 * ПРЕДЛОГ В — „Трибина"
 *
 * A contemporary club identity: oversized condensed Cyrillic caps, hard-edged
 * navy/orange blocking, a crest-forward hero and a scoreboard stat strip. The
 * page alternates navy and paper blocks with no gap between them, so the whole
 * thing reads as stacked panels rather than a scroll of sections.
 *
 * Loud, but still an archive. There is no clock, no fixture, no ticker and no
 * generated number anywhere: every value on the scoreboard is a curated
 * `clubRecord` string rendered exactly as the editor wrote it. Content comes
 * from the same Sanity read as the other two directions
 * (`../_shared/home.ts`).
 */
export default async function PredlogC() {
  const view = await getHomeView();
  const { records, decades, legends, moment } = view;
  const [feature, ...restRecords] = records;

  return (
    <div
      className={`pv-c flex min-h-full flex-col ${oswald.variable} ${golos.variable}`}
    >
      <TerraceHeader />

      <main id="main" className="flex-1">
        {/* ── 1 · Hero — the matchday poster ─────────────────────────── *
         * Rebuilt on owner feedback (D-3.05a-10). The first cut put a small
         * crest on a white rectangle above the wordmark, in the left half of a
         * two-column split — which repeated the crest AND the wordmark the
         * sticky header carries ~60px above it, made the badge read as a
         * sticker, and used none of this direction's blocking.
         *
         * Now the photograph leads full-bleed and the crest is a paper BLOCK
         * pinned over its bottom edge — a badge on the hoarding, part of the
         * navy/paper/orange blocking rather than an image floating on navy.
         * Every word still sits on solid navy, so contrast is deterministic
         * (paper on `--pc-navy` = 14.95:1) rather than dependent on whichever
         * team photo ISR happens to serve. */}
        <section aria-labelledby="pc-hero" className="pc-block-navy">
          <div className="pc-hero-photo aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/8]">
            <Block
              image={view.heroPhoto}
              alt={view.heroAlt}
              ratio="pc-photo-fill"
              sizes="100vw"
              width={2400}
              priority
              objectPosition="50% 32%"
              placeholder="насловна фотографија"
            />
          </div>

          <div className="pc-wrap">
            {/* Badge + wordmark as one lockup along the photograph's bottom
                edge. Only the crest carries the negative margin, so it is the
                single element that overlaps the picture; the <h1> is bottom-
                aligned to it and therefore sits entirely on navy (14.95:1). */}
            <div className="pc-hero-lockup">
              <div className="pc-hero-crest">
                {/* The same 6px orange bar that opens the header, closes the
                    footer and caps every tile. */}
                <div className="pc-topbar" />
                <div className="pc-hero-crest-inner">
                  <Image
                    src="/crest.png"
                    alt=""
                    width={256}
                    height={362}
                    priority
                    className="h-20 w-auto md:h-28 lg:h-32"
                  />
                </div>
              </div>

              {/* No <br>: it sets on one line from `lg` up and wraps to two on
                  narrow screens, which is the right break for the lockup. */}
              <h1 id="pc-hero" className="pc-display pc-hero-name">
                ФК Беласица
              </h1>
            </div>

            <Reveal className="pb-12 pt-7 md:pb-16">
              <div className="grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <Label onNavy>{KICKER.hero}</Label>
                  <p className="pc-body pc-body--on-navy mt-4">
                    {HERO_HERITAGE}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/arhiva"
                    className="pc-btn pc-focus pc-focus--on-navy"
                  >
                    {CTA.archive}
                  </Link>
                  <Link
                    href="/legendi"
                    className="pc-btn pc-btn--ghost pc-focus pc-focus--on-navy"
                  >
                    {CTA.legends}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 2 · The club, on a paper block ─────────────────────────── */}
        <section
          aria-labelledby="pc-story"
          className="pc-block-paper pc-section pc-wrap"
        >
          <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-14">
            <div>
              <Label>{KICKER.story}</Label>
              <h2 id="pc-story" className="pc-h2 mt-6 max-w-[14ch]">
                {STORY_LEAD}
              </h2>
            </div>
            <div>
              {view.description ? (
                // Owner-authored copy, rendered with the editor's own
                // paragraph breaks and never reflowed (content-truth).
                <p className="pc-body whitespace-pre-line">
                  {view.description}
                </p>
              ) : (
                <Chip label="опис на архивата (Поставки на сајтот)" />
              )}
              <Link href="/za-nas" className="pc-link pc-focus mt-7">
                {CTA.about}
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── 3 · Legends ────────────────────────────────────────────── */}
        <section
          aria-labelledby="pc-legends"
          className="pc-block-navy pc-section"
        >
          <div className="pc-wrap">
            <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <div>
                <Label onNavy>{KICKER.legends}</Label>
                <h2
                  id="pc-legends"
                  className="pc-h2 pc-h2--on-navy mt-6 max-w-[18ch]"
                >
                  {LEGENDS_LEAD}
                </h2>
              </div>
              <Link
                href="/legendi"
                className="pc-link pc-link--on-navy pc-focus pc-focus--on-navy"
              >
                {CTA.allLegends}
              </Link>
            </Reveal>

            {legends.length > 0 ? (
              <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {legends.map((person, i) => (
                  <Reveal as="li" key={person.slug} delayIndex={i % 5}>
                    <Link
                      href={`/legendi/${person.slug}`}
                      className="pc-card pc-focus pc-focus--on-navy"
                    >
                      {person.portrait ? (
                        <Block
                          image={person.portrait}
                          alt={person.name ?? "Архивски портрет"}
                          ratio="aspect-[4/5]"
                          sizes="(min-width:1024px) 19vw, (min-width:640px) 31vw, 47vw"
                          width={700}
                          placeholder="портрет"
                        />
                      ) : (
                        // No portrait on file: a monogram block, never a
                        // stand-in face and never a grey box.
                        <div className="pc-card-empty">
                          {person.name ? (
                            <span aria-hidden className="pc-monogram">
                              {initials(person.name)}
                            </span>
                          ) : (
                            <Chip label="портрет" onNavy />
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="pc-h3 pc-h3--on-navy">
                          {person.name ?? <Chip label="име на личноста" onNavy />}
                        </h3>
                        <span className="pc-small pc-small--on-navy mt-2 block">
                          {person.playingYears?.trim() ?? (
                            <Chip label="години на играње" onNavy />
                          )}
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            ) : (
              <p className="mt-10">
                <Chip label="легенди (играчи) — сѐ уште не се објавени" onNavy />
              </p>
            )}
          </div>
        </section>

        {/* ── 4 · The scoreboard ─────────────────────────────────────── */}
        {records.length > 0 && (
          <section aria-labelledby="pc-records" className="pc-block-paper">
            <div className="pc-wrap pc-section">
              <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
                <div>
                  <Label>{KICKER.records}</Label>
                  <h2 id="pc-records" className="pc-h2 mt-6">
                    {RECORDS_LEAD}
                  </h2>
                </div>
                <Link href="/statistika" className="pc-link pc-focus">
                  {CTA.allStats}
                </Link>
              </Reveal>
            </div>

            {/* Full-bleed strip. `label` and `value` render exactly as
                curated — a record is a factual claim, never reformatted, and
                nothing here is computed (D-3.01-5). */}
            <Reveal className="pc-score grid-cols-1">
              <div className="pc-score-lead">
                <h3 className="pc-score-label pc-score-label--lead">
                  {feature.label}
                </h3>
                <p className="pc-stat pc-stat--lead mt-3">{feature.value}</p>
              </div>
              {restRecords.length > 0 && (
                <ul className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
                  {restRecords.map((record, i) => (
                    <li key={`${record.label}-${i}`} className="pc-score-cell">
                      <h3 className="pc-score-label">{record.label}</h3>
                      <p className="pc-stat mt-3">{record.value}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </section>
        )}

        {/* ── 5 · Decades ────────────────────────────────────────────── */}
        {decades.length > 0 && (
          <section
            aria-labelledby="pc-decades"
            className="pc-block-navy pc-section"
          >
            <div className="pc-wrap">
              <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
                <div>
                  <Label onNavy>{KICKER.decades}</Label>
                  <h2
                    id="pc-decades"
                    className="pc-h2 pc-h2--on-navy mt-6"
                  >
                    Разгледај по децении
                  </h2>
                </div>
                <p className="pc-body pc-body--on-navy max-w-[36ch]">
                  {DECADES_LEAD}
                </p>
              </Reveal>

              <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {decades.map(({ decade, count }, i) => (
                  <Reveal as="li" key={decade} delayIndex={i % 4}>
                    <Link
                      href={`/arhiva#${decadeAnchor(decade)}`}
                      className="pc-tile pc-focus pc-focus--on-navy"
                    >
                      <span className="pc-h3 pc-h3--on-navy tabular-nums">
                        {decadeLabel(decade)}
                      </span>
                      <span className="pc-tile-meta tabular-nums">
                        {seasonCountLabel(count)}
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── 6 · A moment from history ──────────────────────────────── */}
        {moment && (
          <section aria-labelledby="pc-moment" className="pc-block-paper">
            <h2 id="pc-moment" className="sr-only">
              {KICKER.moment}
            </h2>
            <figure className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
              <div className="relative min-h-[16rem] lg:min-h-[28rem]">
                <Block
                  image={moment.image}
                  alt={moment.caption || "Архивска фотографија на ФК Беласица"}
                  ratio="pc-photo-fill"
                  sizes="(min-width:1024px) 61vw, 100vw"
                  width={1800}
                  objectPosition="50% 35%"
                  placeholder="фотографија"
                />
              </div>
              <figcaption className="pc-moment-caption flex flex-col justify-center">
                <Label onNavy>{KICKER.moment}</Label>
                {moment.date && (
                  <p className="pc-score-label mt-6">{moment.date}</p>
                )}
                {moment.caption && (
                  <p className="pc-h2 pc-h2--on-navy mt-3">{moment.caption}</p>
                )}
              </figcaption>
            </figure>
          </section>
        )}

        {/* ── 7 · Where next ─────────────────────────────────────────── */}
        <section
          aria-labelledby="pc-quicklinks"
          className="pc-block-navy pc-section"
        >
          <div className="pc-wrap">
            <Reveal>
              <Label onNavy>{KICKER.quicklinks}</Label>
              <h2
                id="pc-quicklinks"
                className="pc-h2 pc-h2--on-navy mt-6"
              >
                {QUICKLINKS_LEAD}
              </h2>
            </Reveal>

            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {QUICK_LINKS.map((card, i) => (
                <Reveal as="li" key={card.href} delayIndex={i}>
                  <Link
                    href={card.href}
                    className="pc-tile pc-focus pc-focus--on-navy"
                  >
                    <h3 className="pc-h3 pc-h3--on-navy">{card.label}</h3>
                    <span className="pc-tile-meta">{card.sub}</span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <TerraceFooter />
    </div>
  );
}

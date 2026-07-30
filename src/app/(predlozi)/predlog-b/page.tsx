import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { decadeAnchor, decadeLabel, seasonCountLabel } from "@/lib/archive";
import { initials } from "@/lib/people";
import { urlFor } from "@/sanity/image";
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
import { commissioner, cormorant } from "./fonts";
import { Entrance } from "./_components/Entrance";
import { Plaque } from "./_components/Plaque";
import { Chip, Mounted, ObjectLabel, WallLabel } from "./_components/parts";
import "./b.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Предлог Б — Клупски музеј",
  description:
    "Предлог за визуелен правец на неофицијалната архива на ФК Беласица.",
  robots: { index: false, follow: false },
};

/**
 * ПРЕДЛОГ Б — „Клупски музеј"
 *
 * The archive as a room. Deep navy walls carry the whole page; the paper the
 * live site is built on survives only as mat board around the photographs and
 * as the text on the wall. Records are cast as plaques, decades hang as framed
 * plates, and the vertical rhythm is roughly double the live site's — the air
 * between objects is the design.
 *
 * The system: two navies (wall and raised panel) instead of a shadow, brass
 * hairlines instead of borders, and one spotlight gradient behind every mounted
 * photograph. Every fact comes from the same Sanity read as the other two
 * directions (`../_shared/home.ts`).
 */
export default async function PredlogB() {
  const view = await getHomeView();
  const { records, decades, legends, moment } = view;
  const [feature, ...restRecords] = records;

  return (
    <div
      className={`pv-b flex min-h-full flex-col ${cormorant.variable} ${commissioner.variable}`}
    >
      <Entrance />

      <main id="main" className="flex-1">
        {/* ── 1 · The hall — full-bleed photograph under a navy scrim ── */}
        <section aria-labelledby="pb-hero" className="relative w-full">
          <div className="relative min-h-[32rem] w-full overflow-hidden md:min-h-[44rem]">
            {view.heroPhoto ? (
              <Image
                src={urlFor(view.heroPhoto).width(2400).auto("format").url()}
                alt={view.heroAlt}
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: "50% 30%" }}
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <Chip label="насловна фотографија" />
              </span>
            )}

            <div aria-hidden className="pb-scrim" />

            <div className="pb-wrap absolute inset-x-0 bottom-0">
              <div className="max-w-[46rem] pb-14 pt-32 md:pb-20">
                <Reveal>
                  <WallLabel tight onPhoto>
                    {KICKER.hero}
                  </WallLabel>
                  <h1 id="pb-hero" className="pb-display mt-6">
                    {view.wordmark}
                  </h1>
                  <span aria-hidden className="pb-marker mt-8" />
                  <p className="pb-body mt-6">{HERO_HERITAGE}</p>
                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Link href="/arhiva" className="pb-btn pb-focus">
                      {CTA.archive}
                    </Link>
                    <Link href="/legendi" className="pb-link pb-focus">
                      {CTA.legends}
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2 · The introductory wall text ─────────────────────────── */}
        <section aria-labelledby="pb-story" className="pb-wrap pb-section">
          <Reveal className="grid gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-20">
            <div>
              <WallLabel>{KICKER.story}</WallLabel>
              <h2 id="pb-story" className="pb-h2 mt-7 max-w-[16ch]">
                {STORY_LEAD}
              </h2>
            </div>
            <div>
              {view.description ? (
                // Owner-authored copy, rendered with the editor's own
                // paragraph breaks and never reflowed (content-truth).
                <p className="pb-body whitespace-pre-line">
                  {view.description}
                </p>
              ) : (
                <Chip label="опис на архивата (Поставки на сајтот)" />
              )}
              <Link href="/za-nas" className="pb-link pb-focus mt-8">
                {CTA.about}
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── 3 · The portrait gallery ───────────────────────────────── */}
        <section
          aria-labelledby="pb-legends"
          className="pb-hairline pb-wrap pb-section"
        >
          <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div>
              <WallLabel>{KICKER.legends}</WallLabel>
              <h2 id="pb-legends" className="pb-h2 mt-7 max-w-[20ch]">
                {LEGENDS_LEAD}
              </h2>
            </div>
            <Link href="/legendi" className="pb-link pb-focus">
              {CTA.allLegends}
            </Link>
          </Reveal>

          {legends.length > 0 ? (
            <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8">
              {legends.map((person, i) => (
                <Reveal as="li" key={person.slug} delayIndex={i % 5}>
                  <Link
                    href={`/legendi/${person.slug}`}
                    className="pb-mount-link pb-focus block"
                  >
                    <figure>
                      {person.portrait ? (
                        <Mounted
                          image={person.portrait}
                          alt={person.name ?? "Архивски портрет"}
                          ratio="aspect-[4/5]"
                          sizes="(min-width:1024px) 18vw, (min-width:640px) 30vw, 45vw"
                          width={700}
                          placeholder="портрет"
                          size="gallery"
                          // The wash reads as light on a wall behind one large
                          // object; repeated five-up it reads as five leaks.
                          spotlit={false}
                        />
                      ) : (
                        // No portrait in the collection: the mount stays, the
                        // object is a monogram. An empty frame is honest; a
                        // stand-in face would not be.
                        <div className="pb-mat pb-mat--gallery">
                          <div className="pb-mount-empty">
                            {person.name ? (
                              <span aria-hidden className="pb-monogram">
                                {initials(person.name)}
                              </span>
                            ) : (
                              <Chip label="портрет" />
                            )}
                          </div>
                        </div>
                      )}
                      <figcaption className="mt-5">
                        <h3 className="pb-mount-title pb-h3 transition-colors duration-200">
                          {person.name ?? <Chip label="име на личноста" />}
                        </h3>
                        <span className="pb-label pb-label--tight mt-2">
                          {person.playingYears?.trim() ?? (
                            <Chip label="години на играње" />
                          )}
                        </span>
                      </figcaption>
                    </figure>
                  </Link>
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-12">
              <Chip label="легенди (играчи) — сѐ уште не се објавени" />
            </p>
          )}
        </section>

        {/* ── 4 · The plaque wall ────────────────────────────────────── */}
        {records.length > 0 && (
          <section
            aria-labelledby="pb-records"
            className="pb-hairline pb-wrap pb-section"
          >
            <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
              <div>
                <WallLabel>{KICKER.records}</WallLabel>
                <h2 id="pb-records" className="pb-h2 mt-7">
                  {RECORDS_LEAD}
                </h2>
              </div>
              <Link href="/statistika" className="pb-link pb-focus">
                {CTA.allStats}
              </Link>
            </Reveal>

            {/* Both `label` and `value` render exactly as curated — a record is
                a factual claim and is never reformatted or split (D-3.01-5). */}
            <Reveal className="mt-14">
              <div className="pb-plaque pb-plaque--lead">
                <h3 className="pb-label pb-label--tight">{feature.label}</h3>
                <p className="pb-numeral pb-numeral--lead mt-4">
                  {feature.value}
                </p>
              </div>
            </Reveal>

            {restRecords.length > 0 && (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restRecords.map((record, i) => (
                  <Reveal as="li" key={`${record.label}-${i}`} delayIndex={i % 3}>
                    <div className="pb-plaque">
                      <h3 className="pb-label pb-label--tight">{record.label}</h3>
                      <p className="pb-numeral mt-4">{record.value}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ── 5 · The archive wing ───────────────────────────────────── */}
        {decades.length > 0 && (
          <section
            aria-labelledby="pb-decades"
            className="pb-hairline pb-wrap pb-section"
          >
            <Reveal>
              <WallLabel>{KICKER.decades}</WallLabel>
              <h2 id="pb-decades" className="pb-h2 mt-7">
                Разгледај по децении
              </h2>
              <p className="pb-body mt-5">{DECADES_LEAD}</p>
            </Reveal>

            <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {decades.map(({ decade, count }, i) => (
                <Reveal as="li" key={decade} delayIndex={i % 4}>
                  <Link
                    href={`/arhiva#${decadeAnchor(decade)}`}
                    className="pb-frame pb-focus"
                  >
                    <span className="pb-h3 tabular-nums">
                      {decadeLabel(decade)}
                    </span>
                    <span className="pb-label pb-label--tight tabular-nums">
                      {seasonCountLabel(count)}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        {/* ── 6 · The lit object ─────────────────────────────────────── */}
        {moment && (
          <section
            aria-labelledby="pb-moment"
            className="pb-hairline pb-wrap pb-section"
          >
            <Reveal>
              <WallLabel>{KICKER.moment}</WallLabel>
              <h2 id="pb-moment" className="sr-only">
                {KICKER.moment}
              </h2>
              <figure className="mt-12">
                <Mounted
                  image={moment.image}
                  alt={moment.caption || "Архивска фотографија на ФК Беласица"}
                  ratio="aspect-[3/2] md:aspect-[2/1]"
                  sizes="(min-width:768px) 90vw, 100vw"
                  width={2000}
                  placeholder="фотографија"
                />
                <ObjectLabel meta={moment.date} className="mt-10">
                  {moment.caption}
                </ObjectLabel>
              </figure>
            </Reveal>
          </section>
        )}

        {/* ── 7 · The other rooms ────────────────────────────────────── */}
        <section
          aria-labelledby="pb-quicklinks"
          className="pb-hairline pb-wrap pb-section"
        >
          <Reveal>
            <WallLabel>{KICKER.quicklinks}</WallLabel>
            <h2 id="pb-quicklinks" className="pb-h2 mt-7">
              {QUICKLINKS_LEAD}
            </h2>
          </Reveal>

          <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((card, i) => (
              <Reveal as="li" key={card.href} delayIndex={i}>
                <Link href={card.href} className="pb-frame pb-focus">
                  <h3 className="pb-h3">{card.label}</h3>
                  <span className="pb-label pb-label--tight">{card.sub}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>

      <Plaque />
    </div>
  );
}

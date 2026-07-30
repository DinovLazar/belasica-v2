import type { Metadata } from "next";
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
import { playfair, ptSansNarrow, ptSerif } from "./fonts";
import { Masthead } from "./_components/Masthead";
import { Colophon } from "./_components/Colophon";
import { Chip, Cut, CutCaption, Kicker } from "./_components/parts";
import "./a.css";

export const revalidate = 60;

// Exploration route: never indexed, never in the sitemap, never linked from
// the site's navigation. It exists for one owner decision and then goes away.
export const metadata: Metadata = {
  title: "Предлог А — Спортски весник",
  description:
    "Предлог за визуелен правец на неофицијалната архива на ФК Беласица.",
  robots: { index: false, follow: false },
};

/**
 * ПРЕДЛОГ А — „Спортски весник"
 *
 * The archive as a digitised vintage sports newspaper. The seven homepage
 * zones are re-cut as front-page furniture: a masthead, a lead story with its
 * two-ink photograph, a column-set feature, a row of portrait cuts, a box
 * score, an index with dotted leaders, a full-measure picture, a section strip
 * and a colophon.
 *
 * The system: paper dominates, navy is the only structural ink, hairline rules
 * do all the dividing that whitespace does on the live site, and orange never
 * becomes a letterform — it is a 8px square and a 2px caption marker, nothing
 * else. Every fact on the page comes from the same Sanity read as the other
 * two directions (`../_shared/home.ts`).
 */
export default async function PredlogA() {
  const view = await getHomeView();
  const { records, decades, legends, moment } = view;
  const [feature, ...restRecords] = records;

  return (
    <div
      className={`pv-a flex min-h-full flex-col ${playfair.variable} ${ptSerif.variable} ${ptSansNarrow.variable}`}
    >
      <Masthead />

      <main id="main" className="flex-1">
        {/* ── 1 · Lead story ─────────────────────────────────────────── */}
        <section aria-labelledby="pa-hero" className="pa-wrap pt-6 md:pt-9">
          <Reveal>
            <Kicker>{KICKER.hero}</Kicker>

            <div className="mt-4 grid gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <h1 id="pa-hero" className="pa-headline pa-headline--lead">
                  {view.wordmark}
                </h1>
                <div className="pa-rule-hair mt-5 pt-5">
                  <p className="pa-deck max-w-[38ch]">{HERO_HERITAGE}</p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href="/arhiva"
                    className="pa-btn pa-focus"
                  >
                    {CTA.archive}
                  </Link>
                  <Link href="/legendi" className="pa-link pa-focus py-1">
                    {CTA.legends}
                  </Link>
                </div>
              </div>

              <figure className="md:col-span-7">
                <Cut
                  image={view.heroPhoto}
                  alt={view.heroAlt}
                  ratio="aspect-[4/3] md:aspect-[3/2]"
                  sizes="(min-width:768px) 58vw, 100vw"
                  width={1800}
                  priority
                  placeholder="насловна фотографија"
                />
                <CutCaption meta={KICKER.hero} className="mt-3">
                  {view.heroAlt}
                </CutCaption>
              </figure>
            </div>
          </Reveal>
        </section>

        {/* ── 2 · The club's story — the column-set feature ───────────── */}
        <section
          aria-labelledby="pa-story"
          className="pa-wrap pa-rule-thick mt-[var(--pa-section)] pt-6"
        >
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <Kicker>{KICKER.story}</Kicker>
              <Link href="/za-nas" className="pa-link pa-focus py-1">
                {CTA.about}
              </Link>
            </div>

            <h2 id="pa-story" className="pa-headline mt-4 max-w-[22ch]">
              {STORY_LEAD}
            </h2>

            <div className="pa-rule-hair mt-6 pt-6">
              {view.description ? (
                <div className="pa-body pa-body--columns pa-body--drop">
                  {/* `whitespace-pre-line` keeps the editor's own paragraph
                      breaks — the description is owner-authored copy and is
                      never reflowed or rewritten (content-truth). */}
                  <p className="whitespace-pre-line">{view.description}</p>
                </div>
              ) : (
                <Chip label="опис на архивата (Поставки на сајтот)" />
              )}
            </div>
          </Reveal>
        </section>

        {/* ── 3 · Legends — the row of portrait cuts ──────────────────── */}
        <section
          aria-labelledby="pa-legends"
          className="pa-wrap pa-rule-thick mt-[var(--pa-section)] pt-6"
        >
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <Kicker>{KICKER.legends}</Kicker>
              <Link href="/legendi" className="pa-link pa-focus py-1">
                {CTA.allLegends}
              </Link>
            </div>
            <h2 id="pa-legends" className="pa-headline mt-4 max-w-[26ch]">
              {LEGENDS_LEAD}
            </h2>
          </Reveal>

          {legends.length > 0 ? (
            <ul className="pa-rule-hair mt-6 grid grid-cols-2 gap-x-5 gap-y-8 pt-6 sm:grid-cols-3 lg:grid-cols-5">
              {legends.map((person, i) => (
                <Reveal as="li" key={person.slug} delayIndex={i % 5}>
                  <Link
                    href={`/legendi/${person.slug}`}
                    className="pa-cut-link pa-focus block"
                  >
                    <figure>
                      {person.portrait ? (
                        <Cut
                          image={person.portrait}
                          alt={person.name ?? "Архивски портрет"}
                          ratio="aspect-[4/5]"
                          sizes="(min-width:1024px) 19vw, (min-width:640px) 31vw, 47vw"
                          width={700}
                          tone="bw"
                          placeholder="портрет"
                        />
                      ) : (
                        // No photograph on file. A ruled box carrying the
                        // person's initial cap — an honest empty frame, not a
                        // stand-in portrait and not a grey box.
                        <div className="pa-frame flex aspect-[4/5] w-full items-center justify-center">
                          {person.name ? (
                            <span
                              aria-hidden
                              className="pa-headline pa-headline--lead"
                            >
                              {initials(person.name)}
                            </span>
                          ) : (
                            <Chip label="портрет" />
                          )}
                        </div>
                      )}
                      <figcaption className="mt-3">
                        <h3 className="pa-cut-title pa-headline pa-headline--small">
                          {person.name ?? <Chip label="име на личноста" />}
                        </h3>
                        <span className="pa-agate mt-1 block">
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
            <p className="pa-rule-hair mt-6 pt-6">
              <Chip label="легенди (играчи) — сѐ уште не се објавени" />
            </p>
          )}
        </section>

        {/* ── 4 · The club in numbers — the box score ─────────────────── */}
        {records.length > 0 && (
          <section
            aria-labelledby="pa-records"
            className="pa-band-sunk mt-[var(--pa-section)]"
          >
            <div className="pa-rule-thick" />
            <div className="pa-wrap py-8 md:py-11">
              <Reveal>
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                  <Kicker>{KICKER.records}</Kicker>
                  <Link href="/statistika" className="pa-link pa-focus py-1">
                    {CTA.allStats}
                  </Link>
                </div>
                <h2 id="pa-records" className="pa-headline mt-4">
                  {RECORDS_LEAD}
                </h2>

                {/* The lead record gets the banner treatment a paper gives its
                    top line; the rest run as the box score beneath it. Both
                    render `label` and `value` exactly as curated — a record is
                    a factual claim and is never reformatted. */}
                <div className="pa-rule-hair mt-6 pt-5">
                  <h3 className="pa-agate-caps">{feature.label}</h3>
                  <p className="pa-headline pa-headline--sub mt-2 max-w-[30ch]">
                    {feature.value}
                  </p>
                </div>
              </Reveal>

              {restRecords.length > 0 && (
                <Reveal className="mt-7 overflow-x-auto">
                  <table className="pa-table">
                    <caption className="pa-agate-caps pb-3">
                      Останати клупски рекорди
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Рекорд</th>
                        <th scope="col">Податок</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restRecords.map((record, i) => (
                        <tr key={`${record.label}-${i}`}>
                          <th scope="row">{record.label}</th>
                          <td>{record.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* ── 5 · The archive index ──────────────────────────────────── */}
        {decades.length > 0 && (
          <section
            aria-labelledby="pa-decades"
            className="pa-wrap pa-rule-thick mt-[var(--pa-section)] pt-6"
          >
            <Reveal>
              <Kicker>{KICKER.decades}</Kicker>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
                <h2 id="pa-decades" className="pa-headline">
                  Разгледај по децении
                </h2>
                <p className="pa-deck max-w-[40ch]">{DECADES_LEAD}</p>
              </div>
            </Reveal>

            <Reveal className="pa-rule-hair mt-6 pt-2">
              <ul className="md:columns-2 md:gap-x-12 lg:columns-3">
                {decades.map(({ decade, count }) => (
                  <li key={decade} className="break-inside-avoid">
                    <Link
                      href={`/arhiva#${decadeAnchor(decade)}`}
                      className="pa-cut-link pa-index-row pa-focus"
                    >
                      <span className="pa-cut-title pa-headline pa-headline--small shrink-0 tabular-nums">
                        {decadeLabel(decade)}
                      </span>
                      <span aria-hidden className="pa-index-leader" />
                      <span className="pa-agate shrink-0 tabular-nums">
                        {seasonCountLabel(count)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        )}

        {/* ── 6 · A moment from history — the full-measure picture ────── */}
        {moment && (
          <section
            aria-labelledby="pa-moment"
            className="mt-[var(--pa-section)]"
          >
            <div className="pa-rule-thick" />
            <div className="pa-wrap py-8 md:py-11">
              <Reveal>
                <Kicker>{KICKER.moment}</Kicker>
                <h2 id="pa-moment" className="sr-only">
                  {KICKER.moment}
                </h2>
                <figure className="mt-4">
                  <Cut
                    image={moment.image}
                    alt={moment.caption || "Архивска фотографија на ФК Беласица"}
                    ratio="aspect-[3/2] md:aspect-[21/9]"
                    sizes="100vw"
                    width={2000}
                    placeholder="фотографија"
                  />
                  <CutCaption meta={moment.date} className="mt-3 max-w-[70ch]">
                    {moment.caption}
                  </CutCaption>
                </figure>
              </Reveal>
            </div>
          </section>
        )}

        {/* ── 7 · Section strip ──────────────────────────────────────── */}
        <section
          aria-labelledby="pa-quicklinks"
          className="pa-wrap pa-rule-thick mt-[var(--pa-section)] pb-[var(--pa-section)] pt-6"
        >
          <Reveal>
            <Kicker>{KICKER.quicklinks}</Kicker>
            <h2 id="pa-quicklinks" className="pa-headline mt-4">
              {QUICKLINKS_LEAD}
            </h2>
          </Reveal>

          <ul className="pa-rule-hair mt-6 grid grid-cols-1 pt-2 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((card, i) => (
              <Reveal
                as="li"
                key={card.href}
                delayIndex={i}
                className="pa-divide border-b last:border-b-0 sm:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <Link
                  href={card.href}
                  className="pa-cut-link pa-focus block py-4 lg:px-5 lg:first:pl-0"
                >
                  <h3 className="pa-cut-title pa-headline pa-headline--sub">
                    {card.label}
                  </h3>
                  <span className="pa-agate mt-1 block">{card.sub}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>

      <Colophon />
    </div>
  );
}

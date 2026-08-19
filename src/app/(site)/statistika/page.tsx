import type { Metadata } from "next";
import { fetchOrThrow } from "@/sanity/fetch";
import { Container } from "@/components/Container";
import { JumpNav, type JumpItem } from "@/components/JumpNav";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/archive/SectionHeading";
import { BalanceSummary } from "@/components/stats/BalanceSummary";
import { ClubRecordList } from "@/components/stats/ClubRecordList";
import { StatsEmptyNotice } from "@/components/stats/StatsEmptyNotice";
import {
  StatTable,
  type StatColumn,
  type StatRow,
} from "@/components/stats/StatTable";
import { Reveal } from "@/components/home/Reveal";
import {
  PlainRankedSourceTable,
  RankedSourceTable,
  SeasonScorersTable,
} from "@/components/stats/AceTables";
import {
  MACEDONIAN_LEAGUE,
  SEASON_SCORERS,
  SEASON_SCORERS_COLUMN_LINE,
  SEASON_SCORERS_INTRO,
  YUGOSLAV_TABLES,
} from "@/content/statistika-extra";
import { seasonCountLabel } from "@/lib/archive";
import {
  aggregateClubBalance,
  groupClubRecords,
  type BalanceSeasonInput,
  type ClubRecordInput,
} from "@/lib/stats";

// Match the archive (D-1.05-4): career totals and final tables are hand-curated
// in Studio and appear within ~a minute of publishing, without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  // Its own path, relative — resolved against `metadataBase`, so the
  // domain cutover stays one environment variable (3.23, B2).
  alternates: { canonical: "/statistika" },
  title: "Статистика",
  description:
    "Најдобри стрелци, најмногу настапи и севкупниот биланс на ФК Беласица — неофицијална архива.",
};

/**
 * Lowest goal total the „Најдобри стрелци" table lists (owner, 2026-08-02).
 * 21 is Ристо Панов's total — the owner named him as the last name that
 * belongs on the list, so the bound is inclusive. 28 of the 55 players with a
 * recorded total clear it.
 */
const SCORER_MIN_GOALS = 21;

/**
 * Lowest appearance total the „Најмногу настапи" table lists (owner, 3.24).
 *
 * A THRESHOLD, deliberately, and not a row cap — the same shape as
 * `SCORER_MIN_GOALS` above (D-3.12-2/D-3.12-5). A fixed-length list has to push
 * somebody off whenever a new figure is entered in Studio; a threshold lets a
 * player who later gains his 130th appearance enter on his own merits, and lets
 * the table's length follow the archive instead of a number typed here.
 *
 * Like the scorers' cut it is a DISPLAY rule and not a data change: every total
 * stays in Sanity and still shows on the player's own page and in the
 * appearances column of the scorers table above.
 *
 * 3.24 set this to 46 against a stale belief that the table held 71 rows. It
 * holds 119, so 46 cut only three men and left 116 — a list, not a table.
 * The owner chose 130 (3.30, resolving OV-57). Measured on the live archive:
 *
 *   ≥46 → 116 rows   ≥130 → 48 rows   ≥131 → 46 rows
 *
 * ⚠️ NO THRESHOLD YIELDS THE 47 THE OWNER ORIGINALLY ASKED FOR — Александар
 * Коцев and Митко Џорлев are tied on exactly 130, so the count steps 48 → 46
 * with nothing in between. 130 is the owner's call and the row count follows
 * from it, never the other way round (D-3.30-2).
 *
 * ⚠️ Known and accepted: Горан Пандев (38), Ацо Стојков (35) and Горан Попов
 * (26) are NOT in this table. Their Беласица totals are small precisely because
 * they left young; they belong to the Репрезентативци tab, which is where Ace
 * asked for them.
 */
const APPEARANCE_MIN = 130;

/**
 * Four reads in one round trip.
 *
 * (d) is the curated records section (3.02F). `clubRecord` carries the
 * all-time facts the model cannot aggregate — trophy counts, scorer lists,
 * appearance milestones (D-3.01-5). Ordered here for a deterministic cold
 * read; `groupClubRecords` re-sorts to the same key, so the render does not
 * depend on which of the two ran.
 *
 * (a)/(b) rank **only** `person.careerStats`, the authoritative career total
 * (D-2.01-3). `season.squad` is per-season detail and is never summed into a
 * career total — a partial archive would produce a confidently wrong number.
 * A player whose total was never entered is omitted: an unknown cannot be
 * ranked, and showing it as 0 would invent a fact. Since 3.24 both express that
 * through their threshold rather than through `defined(...)` — `>= n` is false
 * for an undefined field, so the explicit guard (b) used to carry is redundant,
 * not dropped. A genuine recorded `0` is still a number and is still treated as
 * one; it simply does not clear a cut of 21 or 46, which is a different thing
 * from being filtered out for being falsy.
 *
 * (a) also stops at `SCORER_MIN_GOALS`. The owner set the cut at 3.12 — „во
 * листата со стрелци треба да се оди до 21 гол (до Ристо Панов), не треба да се
 * наведува некој што дал 8, 12 или 15 гола" — because below it the table stops
 * being a list of the club's scorers and becomes a list of everyone whose goals
 * happen to have been recorded, which for a defender with four is not a
 * distinction. The threshold is a display rule, not a data change: every total
 * stays in Sanity and still shows on the player's own page (D-3.12-5).
 *
 * (c) feeds the balance aggregate. Ordered like the archive index (D-2.02-2):
 * every slug starts with a 4-digit year, so `decade desc, slug.current desc` is
 * chronological, newest first.
 */
const STATS_QUERY = /* groq */ `{
  "scorers": *[_type == "person" && "player" in role && careerStats.goals >= ${SCORER_MIN_GOALS}]
    | order(careerStats.goals desc, name asc){
      "id": _id,
      name,
      "slug": slug.current,
      playingYears,
      "goals": careerStats.goals,
      "appearances": careerStats.appearances
    },
  "appearances": *[_type == "person" && "player" in role && careerStats.appearances >= ${APPEARANCE_MIN}]
    | order(careerStats.appearances desc, name asc){
      "id": _id,
      name,
      "slug": slug.current,
      playingYears,
      "goals": careerStats.goals,
      "appearances": careerStats.appearances
    },
  "balanceSeasons": *[_type == "season" && defined(slug.current) && defined(decade) && count(finalTable) > 0]
    | order(decade desc, slug.current desc){
      title,
      "slug": slug.current,
      decade,
      finalTable[]{
        position, club, played, wins, draws, losses, goalsFor, goalsAgainst, points
      }
    },
  "records": *[_type == "clubRecord"]
    | order(order asc, label asc){
      label,
      value,
      category,
      order
    }
}`;

type PlayerStat = {
  id: string;
  name: string | null;
  slug: string | null;
  playingYears: string | null;
  goals: number | null;
  appearances: number | null;
};

type StatsData = {
  scorers: PlayerStat[] | null;
  appearances: PlayerStat[] | null;
  balanceSeasons: BalanceSeasonInput[] | null;
  records: ClubRecordInput[] | null;
};

/** Shared by both player tables — only the column order differs. */
const PLAYER_COLUMNS: Record<
  "player" | "goals" | "appearances" | "years",
  StatColumn
> = {
  player: { key: "player", short: "Играч", full: "Играч", numeric: false },
  goals: { key: "goals", short: "Голови", full: "Голови", numeric: true },
  appearances: {
    key: "appearances",
    short: "Настапи",
    full: "Настапи",
    numeric: true,
  },
  years: {
    key: "years",
    short: "Години",
    full: "Години на играње",
    numeric: false,
  },
};

const SCORER_COLUMNS = [
  PLAYER_COLUMNS.player,
  PLAYER_COLUMNS.goals,
  PLAYER_COLUMNS.appearances,
  PLAYER_COLUMNS.years,
];

const APPEARANCE_COLUMNS = [
  PLAYER_COLUMNS.player,
  PLAYER_COLUMNS.appearances,
  PLAYER_COLUMNS.goals,
  PLAYER_COLUMNS.years,
];

/** The season page is built in 2.05 — these links may 404 until then, which is
 *  expected (handover §6.5). */
function playerRow(player: PlayerStat): StatRow {
  return {
    id: player.id,
    cells: {
      player: {
        kind: "text",
        text: player.name,
        href: player.slug ? `/legendi/${player.slug}` : null,
        placeholder: "име на играч",
      },
      goals: { kind: "number", value: player.goals },
      appearances: { kind: "number", value: player.appearances },
      years: { kind: "text", text: player.playingYears },
    },
  };
}

const BALANCE_COLUMNS: StatColumn[] = [
  { key: "season", short: "Сезона", full: "Сезона", numeric: false },
  { key: "position", short: "#", full: "Позиција", numeric: true },
  { key: "played", short: "Од", full: "Одиграни", numeric: true },
  { key: "wins", short: "Поб", full: "Победи", numeric: true },
  { key: "draws", short: "Нер", full: "Нерешени", numeric: true },
  { key: "losses", short: "Пор", full: "Порази", numeric: true },
  { key: "goalsFor", short: "ДГ", full: "Дадени голови", numeric: true },
  { key: "goalsAgainst", short: "ПГ", full: "Примени голови", numeric: true },
  { key: "points", short: "Бод", full: "Бодови", numeric: true },
];

export default async function StatisticsPage() {
  // Retried, then loud (3.23, C3). Like /arhiva this page carries no try/catch
  // and that is deliberate: every section here already has an honest empty
  // notice, but reaching them because the CDN blinked would publish „no
  // scorers" as though it were the archive's record. The helper adds five
  // bounded attempts; the failure mode past them is unchanged.
  const data = await fetchOrThrow<StatsData>(
    STATS_QUERY,
    {},
    "the statistics tables",
  );

  const scorers = data?.scorers ?? [];
  const appearances = data?.appearances ?? [];
  const balance = aggregateClubBalance(data?.balanceSeasons ?? []);
  const recordGroups = groupClubRecords(data?.records ?? []);

  // Every label leads the heading it jumps to (D-3.13-1) — „Севкупен биланс" is
  // that heading's own opening words, not a paraphrase of it. The first three
  // sections always render (each carries its own empty notice); the records
  // section self-omits when there are no records, and the rail follows it, so
  // it can never offer a jump to a heading that is not in the document.
  const railItems: JumpItem[] = [
    { id: "strelci", label: "Најдобри стрелци" },
    { id: "nastapi", label: "Најмногу настапи" },
    { id: "bilans", label: "Севкупен биланс" },
    ...(recordGroups.length > 0
      ? [{ id: "rekordi", label: "Клупски рекорди" }]
      : []),
    // The three transcribed sections (3.34). Each label still leads its
    // heading (D-3.13-1); the first carries the heading's full wording rather
    // than its opening words alone, because „Најдобри стрелци“ on its own is
    // already the label of the Sanity-backed section at the top of the page
    // and two identical rail labels would jump to two different tables.
    { id: "strelci-sezoni", label: "Најдобри стрелци по сезони" },
    { id: "jugoslavija", label: "Југословенска лига" },
    { id: "makedonija", label: "Прва македонска лига" },
  ];

  // Sorting „Сезона" descending must mean newest first, whatever a title looks
  // like („Сезона 1950" vs „Беласица 1922–1926"). The query already ordered the
  // seasons chronologically, so the negated index carries that order into the
  // client sort instead of an alphabetical compare on the title.
  const balanceRows: StatRow[] = balance.seasons.map((season, i) => ({
    id: season.slug,
    cells: {
      season: {
        kind: "text",
        text: season.title,
        href: `/arhiva/${season.slug}`,
        sortValue: -i,
        placeholder: "име на сезона",
      },
      position: { kind: "number", value: season.row.position },
      played: { kind: "number", value: season.row.played },
      wins: { kind: "number", value: season.row.wins },
      draws: { kind: "number", value: season.row.draws },
      losses: { kind: "number", value: season.row.losses },
      goalsFor: { kind: "number", value: season.row.goalsFor },
      goalsAgainst: { kind: "number", value: season.row.goalsAgainst },
      points: { kind: "number", value: season.row.points },
    },
  }));

  return (
    <>
      <PageHeader
        title="Статистика"
        crumbs={[{ label: "Почетна", href: "/" }, { label: "Статистика" }]}
        // Structural copy — describes the page's own state, claims no fact.
        intro="Збирни бројки од архивата. Прегледот се пополнува како што се внесуваат сезоните и играчите."
      />

      <JumpNav items={railItems} ariaLabel="Скок низ статистиката" />

      {/* The scorers lead the page (owner, 2026-08-09): „Најдобри стрелци" is
          the table readers open this page for, so it is the first thing under
          the header, and the curated records — a shorter, editorial list — now
          close it instead of standing in front of it.
          Leading the page, this section takes no hairline: its top edge is
          already the navy rail's colour change, and a rule there would be a
          second boundary drawn on top of the first. */}
      <section
        id="strelci"
        aria-labelledby="scorers-heading"
        // Clear BOTH sticky bars when jumped to: the site header
        // (`--spacing-header`) plus the jump rail's own height.
        className="scroll-mt-[calc(var(--spacing-header)+3.25rem)] py-section"
      >
        <Container>
          <Reveal>
            <SectionHeading id="scorers-heading">
              Најдобри стрелци
            </SectionHeading>
            {/* States the cut rather than leaving a reader to wonder why a
                player they know is not in the table (D-3.12-5). Structural
                copy: it describes the table, it claims nothing about the club. */}
            {/* „внесени" added at 3.23 (A2/P2). Without it the sentence read as
                a completeness claim — „every player with 21+ goals is here" —
                which the data does not support and which the page contradicts
                three sections below, where the curated „Ранг-листа на голгетери"
                record names players the table has no entered total for. The
                empty notice a few lines down was already careful to say
                „внесени"; this line simply had not been (D-3.23-13). No query
                changed: the note now describes what the archive HOLDS, not what
                the book records. */}
            {scorers.length > 0 && (
              <p className="mt-4 max-w-[60ch] text-small text-neutral-700">
                Листата ги опфаќа играчите со внесени {SCORER_MIN_GOALS} или
                повеќе првенствени голови за Беласица.
              </p>
            )}
          </Reveal>
          <div className="mt-8">
            {scorers.length === 0 ? (
              <StatsEmptyNotice
                // Since 3.11 the section can also be empty because nobody
                // clears the threshold, so the note no longer claims the
                // stronger „нема внесени голови за ниту еден играч".
                note={`Сѐ уште нема играч со ${SCORER_MIN_GOALS} или повеќе внесени голови, па нема што да се подреди.`}
                pending="голови по играч"
              />
            ) : (
              <StatTable
                columns={SCORER_COLUMNS}
                rows={scorers.map(playerRow)}
                defaultSort={{ key: "goals", direction: "desc" }}
                tieBreakKey="player"
                caption="Најдобри стрелци во историјата на клубот"
                scrollLabel="Најдобри стрелци — скролувај хоризонтално"
              />
            )}
          </div>
        </Container>
      </section>

      <section
        id="nastapi"
        aria-labelledby="appearances-heading"
        className="scroll-mt-[calc(var(--spacing-header)+3.25rem)] border-t border-mist py-section"
      >
        <Container>
          <Reveal>
            <SectionHeading id="appearances-heading">
              Најмногу настапи
            </SectionHeading>
            {/* The cut is stated, for the same reason the scorers' is (3.24).
                A reader who knows Горан Пандев played for Беласица and cannot
                find him in a table headed „Најмногу настапи" is owed the reason
                — otherwise the table reads as incomplete rather than as
                bounded. „внесени" carries the same load it carries above
                (D-3.23-13): this describes what the archive HOLDS, not what the
                club's history contains. */}
            {appearances.length > 0 && (
              <p className="mt-4 max-w-[60ch] text-small text-neutral-700">
                Листата ги опфаќа играчите со {APPEARANCE_MIN} или повеќе
                внесени првенствени настапи за Беласица.
              </p>
            )}
          </Reveal>
          <div className="mt-8">
            {appearances.length === 0 ? (
              <StatsEmptyNotice
                // Since 3.24 the section can also be empty because nobody
                // clears the threshold, so the note no longer claims the
                // stronger „нема внесени настапи за ниту еден играч" — the same
                // correction the scorers' notice took at 3.11.
                note={`Сѐ уште нема играч со ${APPEARANCE_MIN} или повеќе внесени настапи, па нема што да се подреди.`}
                pending="настапи по играч"
              />
            ) : (
              <StatTable
                columns={APPEARANCE_COLUMNS}
                rows={appearances.map(playerRow)}
                defaultSort={{ key: "appearances", direction: "desc" }}
                tieBreakKey="player"
                caption="Играчи со најмногу настапи за клубот"
                scrollLabel="Најмногу настапи — скролувај хоризонтално"
              />
            )}
          </div>
        </Container>
      </section>

      <section
        id="bilans"
        aria-labelledby="balance-heading"
        className="scroll-mt-[calc(var(--spacing-header)+3.25rem)] border-t border-mist py-section"
      >
        <Container>
          <Reveal>
            <SectionHeading id="balance-heading">
              Севкупен биланс на клубот
            </SectionHeading>
          </Reveal>

          {balance.seasons.length === 0 ? (
            <div className="mt-8">
              <StatsEmptyNotice
                note="Ниту една сезона сѐ уште нема внесена конечна табела, па билансот не може да се состави."
                pending="конечни табели по сезони"
              />
            </div>
          ) : (
            <>
              <div className="mt-8">
                <BalanceSummary balance={balance} />
              </div>

              {/* The coverage line keeps a partial aggregate from reading as a
                  complete one — every number above is a sum over these seasons
                  only, not over the club's whole history. */}
              <div className="mt-4 max-w-measure space-y-1.5 text-small text-neutral-700">
                <p>
                  Составено од {seasonCountLabel(balance.seasons.length)} со
                  внесена конечна табела.
                </p>
                {balance.seasonsWithTable > balance.seasons.length && (
                  <p>
                    Во уште{" "}
                    {seasonCountLabel(
                      balance.seasonsWithTable - balance.seasons.length,
                    )}{" "}
                    има конечна табела, но во неа не е пронајден ред за
                    Беласица.
                  </p>
                )}
                {balance.partial && (
                  <p>
                    Во некои сезони не се внесени сите бројки — збировите се
                    однесуваат само на внесеното.
                  </p>
                )}
              </div>

              <div className="mt-8">
                <StatTable
                  columns={BALANCE_COLUMNS}
                  rows={balanceRows}
                  defaultSort={{ key: "season", direction: "desc" }}
                  tieBreakKey="season"
                  caption="Биланс на клубот по сезони"
                  scrollLabel="Биланс по сезони — скролувај хоризонтално"
                  minWidthClass="min-w-[640px]"
                />
              </div>
            </>
          )}
        </Container>
      </section>

      {/* The curated records close the page (owner, 2026-08-09). They are the
          club's headline facts and they used to lead, but they are an
          editorial selection standing in front of the three tables the page
          exists for; behind them they read as the summary they are.
          Unlike those three, this section has no empty notice — with no
          records there is nothing to say that the page does not already say,
          so it omits itself entirely (D-2.02-3). It now always follows a paper
          section, so its hairline is unconditional. */}
      {recordGroups.length > 0 && (
        <section
          id="rekordi"
          aria-labelledby="records-heading"
          className="scroll-mt-[calc(var(--spacing-header)+3.25rem)] border-t border-mist py-section"
        >
          <Container>
            <Reveal>
              <SectionHeading id="records-heading">
                Клупски рекорди
              </SectionHeading>
            </Reveal>
            <ClubRecordList groups={recordGroups} />
          </Container>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          Аце's transcribed statistics, Phase 3.34.

          Three sections, appended after the four Sanity-backed ones above,
          which are untouched. The brief said „after «Севкупен биланс»“ while
          believing „Клупски рекорди“ still LED this page; it has closed it
          since 2026-08-09, so appending here satisfies that instruction
          literally — these do follow the balance — and keeps the four
          existing sections contiguous instead of splitting them (D-3.34-2).

          Every figure, name, period and sentence below is read from
          `src/content/statistika-extra.ts`, generated from Аце's document.
          Nothing on these three sections is authored here.
          ────────────────────────────────────────────────────────────────── */}

      <section
        id="strelci-sezoni"
        aria-labelledby="season-scorers-heading"
        className="scroll-mt-[calc(var(--spacing-header)+3.25rem)] border-t border-mist py-section"
      >
        <Container>
          <Reveal>
            <SectionHeading id="season-scorers-heading">
              Најдобри стрелци по сезони
            </SectionHeading>
            {/* His own sentence above the table, not a description of it
                written here. */}
            <p className="mt-4 max-w-measure text-small text-neutral-700">
              {SEASON_SCORERS_INTRO}
            </p>
          </Reveal>
          <div className="mt-8">
            <SeasonScorersTable
              rows={SEASON_SCORERS}
              columnLine={SEASON_SCORERS_COLUMN_LINE}
            />
          </div>
        </Container>
      </section>

      <section
        id="jugoslavija"
        aria-labelledby="yugoslav-heading"
        className="scroll-mt-[calc(var(--spacing-header)+3.25rem)] border-t border-mist py-section"
      >
        <Container>
          <Reveal>
            <SectionHeading id="yugoslav-heading">
              Југословенска лига
            </SectionHeading>
          </Reveal>

          {/* Four ranked tables, each under Аце's own ALL-CAPS header and each
              carrying his intro and his tail lines verbatim. */}
          {YUGOSLAV_TABLES.map((table) => (
            <div key={table.line} className="mt-12 first:mt-8">
              <h3 className="u-h3 text-navy">{table.heading}</h3>
              <RankedSourceTable
                intro={table.intro}
                columnLine={table.columnLine}
                rows={table.rows}
                tail={table.tail}
                caption={table.heading}
                scrollLabel={`${table.heading} — скролувај хоризонтално`}
              />
            </div>
          ))}
        </Container>
      </section>

      <section
        id="makedonija"
        aria-labelledby="macedonian-heading"
        className="scroll-mt-[calc(var(--spacing-header)+3.25rem)] border-t border-mist py-section"
      >
        <Container>
          <Reveal>
            <SectionHeading id="macedonian-heading">
              Прва македонска лига
            </SectionHeading>
          </Reveal>

          <h3 className="u-h3 mt-8 text-navy">{MACEDONIAN_LEAGUE.heading}</h3>

          {/* The 14-season aggregate and the three lines under it. The last of
              them is Аце's own note that he counted 1992/93 and 1993/94 wins as
              three points though they were two at the time — it travels with
              the paragraphs it qualifies, and neither it nor the season tables
              (which still show 1992/93 at 34 points) was reconciled to the
              other. */}
          <div className="mt-5 max-w-measure space-y-4 text-body text-neutral-700">
            {MACEDONIAN_LEAGUE.narrative.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10">
            <PlainRankedSourceTable
              table={MACEDONIAN_LEAGUE.appearances}
              caption="Играчи со над 60 првенствени настапи во Првата македонска лига"
              scrollLabel="Настапи во Првата македонска лига — скролувај хоризонтално"
            />
          </div>

          <div className="mt-10">
            <PlainRankedSourceTable
              table={MACEDONIAN_LEAGUE.goals}
              caption="Најефикасни играчи во Првата македонска лига"
              scrollLabel="Голови во Првата македонска лига — скролувај хоризонтално"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

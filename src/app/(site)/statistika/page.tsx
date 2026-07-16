import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/archive/Breadcrumb";
import { SectionHeading } from "@/components/archive/SectionHeading";
import { BalanceSummary } from "@/components/stats/BalanceSummary";
import { StatsEmptyNotice } from "@/components/stats/StatsEmptyNotice";
import {
  StatTable,
  type StatColumn,
  type StatRow,
} from "@/components/stats/StatTable";
import { Reveal } from "@/components/home/Reveal";
import { seasonCountLabel } from "@/lib/archive";
import { aggregateClubBalance, type BalanceSeasonInput } from "@/lib/stats";

// Match the archive (D-1.05-4): career totals and final tables are hand-curated
// in Studio and appear within ~a minute of publishing, without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Статистика",
  description:
    "Најдобри стрелци, најмногу настапи и севкупниот биланс на ФК Беласица — неофицијална архива.",
};

/**
 * Three reads in one round trip.
 *
 * (a)/(b) rank **only** `person.careerStats`, the authoritative career total
 * (D-2.01-3). `season.squad` is per-season detail and is never summed into a
 * career total — a partial archive would produce a confidently wrong number.
 * `defined(...)` omits players whose total was never entered: an unknown cannot
 * be ranked, and showing it as 0 would invent a fact.
 *
 * (c) feeds the balance aggregate. Ordered like the archive index (D-2.02-2):
 * every slug starts with a 4-digit year, so `decade desc, slug.current desc` is
 * chronological, newest first.
 */
const STATS_QUERY = /* groq */ `{
  "scorers": *[_type == "person" && "player" in role && defined(careerStats.goals)]
    | order(careerStats.goals desc, name asc){
      "id": _id,
      name,
      "slug": slug.current,
      playingYears,
      "goals": careerStats.goals,
      "appearances": careerStats.appearances
    },
  "appearances": *[_type == "person" && "player" in role && defined(careerStats.appearances)]
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
};

/** Shared by both player tables — only the column order differs. */
const PLAYER_COLUMNS: Record<"player" | "goals" | "appearances" | "years", StatColumn> = {
  player: { key: "player", short: "Играч", full: "Играч", numeric: false },
  goals: { key: "goals", short: "Голови", full: "Голови", numeric: true },
  appearances: { key: "appearances", short: "Настапи", full: "Настапи", numeric: true },
  years: { key: "years", short: "Години", full: "Години на играње", numeric: false },
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
  const data = await client.fetch<StatsData>(STATS_QUERY);

  const scorers = data?.scorers ?? [];
  const appearances = data?.appearances ?? [];
  const balance = aggregateClubBalance(data?.balanceSeasons ?? []);

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
      <Container className="py-5">
        <Breadcrumb
          items={[{ label: "Почетна", href: "/" }, { label: "Статистика" }]}
        />
      </Container>

      <Container className="pb-12">
        <h1 className="font-serif text-h1 font-semibold text-navy md:text-display">
          Статистика
        </h1>
        {/* Structural copy — describes the page's own state, claims no fact. */}
        <p className="mt-4 max-w-measure text-body-l text-neutral-700">
          Збирни бројки од архивата. Прегледот се пополнува како што се внесуваат
          сезоните и играчите.
        </p>
      </Container>

      <section
        aria-labelledby="scorers-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionHeading id="scorers-heading">Најдобри стрелци</SectionHeading>
          </Reveal>
          <div className="mt-8">
            {scorers.length === 0 ? (
              <StatsEmptyNotice
                note="Сѐ уште нема внесени голови за ниту еден играч, па нема што да се подреди."
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
        aria-labelledby="appearances-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionHeading id="appearances-heading">Најмногу настапи</SectionHeading>
          </Reveal>
          <div className="mt-8">
            {appearances.length === 0 ? (
              <StatsEmptyNotice
                note="Сѐ уште нема внесени настапи за ниту еден играч, па нема што да се подреди."
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
        aria-labelledby="balance-heading"
        className="border-t border-mist py-16 md:py-24"
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
                    има конечна табела, но во неа не е пронајден ред за Беласица.
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
    </>
  );
}

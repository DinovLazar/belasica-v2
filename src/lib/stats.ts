/**
 * All-time club balance — aggregation for `/statistika`.
 *
 * Every number here is a sum of values an editor entered into
 * `season.finalTable`; nothing is invented and nothing is inferred from a
 * season that did not record it. The club's own row is found with
 * `isBelasicaRow` (D-2.02-4) — a season whose table has no Беласица row
 * contributes nothing rather than being guessed at.
 *
 * Scope note (D-2.04-1): the locked model carries no competition dimension —
 * `finalTable` has no league name — so this is one all-time club total, not a
 * per-competition split.
 */
import { isBelasicaRow } from "./archive";

/** The club's own row, exactly the locked `season.finalTable` fields. */
export type ClubRow = {
  position: number | null;
  club: string | null;
  played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  goalsFor: number | null;
  goalsAgainst: number | null;
  points: number | null;
};

export type BalanceSeasonInput = {
  title: string | null;
  slug: string;
  decade: number;
  finalTable: ClubRow[] | null;
};

/** One season that contributed to the aggregate, in query order. */
export type BalanceSeason = {
  title: string | null;
  slug: string;
  decade: number;
  row: ClubRow;
};

/** The summable columns. `position` is deliberately absent — a league position
 *  is not a quantity that adds up across seasons. */
export const BALANCE_METRICS = [
  "played",
  "wins",
  "draws",
  "losses",
  "goalsFor",
  "goalsAgainst",
  "points",
] as const;

export type BalanceMetric = (typeof BALANCE_METRICS)[number];

/**
 * `contributing` is how many of the counted seasons actually recorded this
 * metric. It is what makes a partial aggregate detectable: a sum over 3 of 5
 * seasons is a real number, but it is not the club's total, and the page has to
 * be able to say so.
 */
export type MetricTotal = { sum: number | null; contributing: number };

export type ClubBalance = {
  /** Seasons whose table contained a Беласица row — the aggregate's basis. */
  seasons: BalanceSeason[];
  /** Seasons that had a `finalTable` at all. Larger than `seasons.length` when
   *  a table exists but names no Беласица row. */
  seasonsWithTable: number;
  totals: Record<BalanceMetric, MetricTotal>;
  /** `goalsFor - goalsAgainst`, or null when either side was never recorded. */
  goalDifference: number | null;
  /** Percent 0–100, or null when played/wins were never recorded. */
  winRate: number | null;
  /** True when at least one metric is missing from at least one counted season. */
  partial: boolean;
};

export function aggregateClubBalance(
  seasons: BalanceSeasonInput[],
): ClubBalance {
  const counted: BalanceSeason[] = [];
  let seasonsWithTable = 0;

  for (const season of seasons) {
    const table = season.finalTable ?? [];
    if (table.length === 0) continue;
    seasonsWithTable += 1;

    const row = table.find((r) => isBelasicaRow(r.club));
    if (!row) continue;

    counted.push({
      title: season.title,
      slug: season.slug,
      decade: season.decade,
      row,
    });
  }

  const totals = {} as Record<BalanceMetric, MetricTotal>;
  for (const metric of BALANCE_METRICS) {
    let sum: number | null = null;
    let contributing = 0;
    for (const season of counted) {
      const value = season.row[metric];
      if (value == null) continue;
      sum = (sum ?? 0) + value;
      contributing += 1;
    }
    totals[metric] = { sum, contributing };
  }

  const goalsFor = totals.goalsFor.sum;
  const goalsAgainst = totals.goalsAgainst.sum;
  const goalDifference =
    goalsFor != null && goalsAgainst != null ? goalsFor - goalsAgainst : null;

  // A win rate needs both halves of the fraction. With `wins` unrecorded the
  // honest answer is „unknown", not 0%.
  const played = totals.played.sum;
  const wins = totals.wins.sum;
  const winRate =
    played != null && played > 0 && wins != null ? (wins / played) * 100 : null;

  const partial = BALANCE_METRICS.some(
    (metric) => totals[metric].contributing < counted.length,
  );

  return {
    seasons: counted,
    seasonsWithTable,
    totals,
    goalDifference,
    winRate,
    partial,
  };
}

/** Goal difference reads as a difference, so a positive total keeps its sign.
 *  `0` is a real value and renders as `0`, never as `—`. */
export function formatGoalDifference(value: number | null): string {
  if (value == null) return "—";
  return value > 0 ? `+${value}` : String(value);
}

/** One decimal, Macedonian decimal comma. */
export function formatWinRate(value: number | null): string {
  if (value == null) return "—";
  return `${value.toLocaleString("mk-MK", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

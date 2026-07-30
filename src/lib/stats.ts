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

/* ------------------------------------------------------------------ *
 * Curated club records — grouping for „Клупски рекорди" (Phase 3.02F).
 *
 * `clubRecord` (D-3.01-5) holds the records that cannot be aggregated from
 * the model: trophy counts, all-time scorer lists, appearance milestones.
 * Nothing here computes or reformats — `label` and `value` render exactly as
 * the editor curated them (content-truth). This function only decides which
 * group a record belongs to and in what order the groups and rows appear.
 * ------------------------------------------------------------------ */

export type ClubRecordInput = {
  label: string | null;
  value: string | null;
  category: string | null;
  order: number | null;
};

/**
 * The four groups, in page order, titled with the Studio's own
 * `clubRecord.category` option titles **verbatim** — an editor who files a
 * record under „Трофеи и признанија" must find it under that exact heading.
 *
 * The order is honours → scorers → appearances → other: trophies are the
 * headline, then the two ranking dimensions the tables below expand on.
 * ⚠️ This is deliberately NOT the homepage strip's order (D-3.03-3 runs
 * honours → appearances → scorers), because the homepage leads with the
 * appearance record it features; here the group order mirrors the two ranking
 * tables further down the page, which run scorers first.
 */
export const RECORD_GROUPS = [
  { key: "honours", title: "Трофеи и признанија" },
  { key: "scorers", title: "Стрелци" },
  { key: "appearances", title: "Настапи" },
  { key: "other", title: "Друго" },
] as const;

export type RecordGroupKey = (typeof RECORD_GROUPS)[number]["key"];

export type ClubRecordGroup = {
  key: RecordGroupKey;
  title: string;
  /** Non-empty by construction — an empty group is dropped (D-2.02-3). */
  records: ClubRecordInput[];
};

/**
 * Group the records, drop what cannot be rendered, and drop empty groups.
 *
 * `category` is optional in the schema, so a record can arrive with none, or
 * with a value outside the Studio list. Such a record falls into „Друго"
 * rather than vanishing: it is real curated content, and silently hiding it
 * would be the archive losing a record it holds.
 *
 * A record missing `label` or `value` **is** dropped — both are required in
 * Studio, and half a record states nothing truthfully.
 */
export function groupClubRecords(
  records: ClubRecordInput[],
): ClubRecordGroup[] {
  const usable = records.filter((r) => r.label?.trim() && r.value?.trim());

  return RECORD_GROUPS.map(({ key, title }) => ({
    key,
    title,
    records: usable
      .filter((record) => recordGroupKey(record.category) === key)
      .sort(compareRecords),
  })).filter((group) => group.records.length > 0);
}

const GROUP_KEYS = new Set<string>(RECORD_GROUPS.map((group) => group.key));

function recordGroupKey(category: string | null): RecordGroupKey {
  return category && GROUP_KEYS.has(category)
    ? (category as RecordGroupKey)
    : "other";
}

/** `order` ascending with unset last, then label — a curated position wins,
 *  and an uncurated one still lands somewhere deterministic. */
function compareRecords(a: ClubRecordInput, b: ClubRecordInput): number {
  const oa = a.order ?? Number.MAX_SAFE_INTEGER;
  const ob = b.order ?? Number.MAX_SAFE_INTEGER;
  if (oa !== ob) return oa - ob;
  return (a.label ?? "").localeCompare(b.label ?? "", "mk");
}

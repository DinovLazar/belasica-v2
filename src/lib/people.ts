/**
 * People display helpers — pure formatting + placement rules for the /legendi
 * templates. No facts here: every string either labels a real counted value or
 * renders data straight from the locked model (content-truth).
 *
 * The schema field is `role` (an array — „Едно лице може да има повеќе улоги."),
 * not `roles`; the 2.05 handover §6.1 calls it `roles[]`, but the locked model
 * wins (2.01).
 */

/** The three values `person.role` may hold (schema `person.ts` options.list). */
export type PersonRole = "player" | "trainer" | "president";

/** Chip label for a single role — the Studio titles, verbatim. */
export const ROLE_LABEL: Record<PersonRole, string> = {
  player: "Играч",
  trainer: "Тренер",
  president: "Претседател",
};

/** The band a role owns, in fixed top→bottom order (handover §2). */
export const BAND_TITLE: Record<PersonRole, string> = {
  player: "Играчи",
  trainer: "Тренери",
  president: "Раководство",
};

/**
 * Band order **and** placement priority in one list (D-2.05-2): a person holding
 * several roles is placed exactly once, in the band of their highest-priority
 * role — player > trainer > president — and never duplicated across bands.
 * Their other roles still show as chips on the card, so nothing is hidden.
 */
export const ROLE_PRIORITY: readonly PersonRole[] = [
  "player",
  "trainer",
  "president",
] as const;

function isPersonRole(value: string): value is PersonRole {
  return value in ROLE_LABEL;
}

/**
 * The roles this person actually holds, ordered by priority so the card's first
 * chip is the one that placed them. Unknown strings are dropped rather than
 * rendered: `role` is a free `string` array in the schema, so a value outside
 * the Studio list could exist, and showing it raw would put an unlabelled,
 * untranslated token on the page.
 */
export function orderedRoles(role: string[] | null | undefined): PersonRole[] {
  const held = new Set((role ?? []).filter(isPersonRole));
  return ROLE_PRIORITY.filter((candidate) => held.has(candidate));
}

/**
 * The band this person belongs in, or `null` when they hold no recognised role
 * — such a person is placed in no band (they would otherwise need an invented
 * fourth band). Their `/legendi/<slug>` page still renders; only the roster
 * placement is skipped.
 */
export function primaryRole(
  role: string[] | null | undefined,
): PersonRole | null {
  return orderedRoles(role)[0] ?? null;
}

/**
 * Initials for the photo-less navy tile (handover §2 „States"). Two at most —
 * Macedonian names here are „Име Презиме", and a longer string would shrink the
 * tile's type below the rest of the grid.
 */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("mk") ?? "")
    .join("");
}

/**
 * Locale-aware Cyrillic collation (handover §2 „Order within a band").
 * A plain `<` compares UTF-16 code units, which orders Macedonian Cyrillic
 * wrongly — „Ѓ" (U+0403) would sort after „Ш" instead of between „Г" and „Д".
 */
export function compareByName(a: string, b: string): number {
  return a.localeCompare(b, "mk");
}

/** The shape `compareByLegendRank` needs — a subset of the roster row. */
export type RankedPerson = {
  name?: string | null;
  legendRank?: number | null;
  careerStats?: { appearances?: number | null } | null;
};

/**
 * Order for the Играчи band (D-3.12-2): the club's all-time appearance ranking,
 * most-capped first, as the owner asked — „наредете ги според број на
 * натпревари, а не по азбучен ред".
 *
 * Three tiers, in this order:
 *
 *  1. `legendRank` — the book's own list of the eighty most-capped players.
 *     It is the ranking, not a proxy for it, and it is used ahead of
 *     `careerStats.appearances` because fifteen of those eighty are ranked on a
 *     count the book states only as a range („120–135"): sorting on the number
 *     alone would drop Панче Пантазиев (#9) and Васо Цветков (#20) to the
 *     bottom of the page. Where the book shares a rank across several players
 *     (54–55, 57–60 …) they all carry the first number of the span and the name
 *     breaks the tie, which is exactly how the book prints them.
 *  2. Players the book does not rank, by recorded career appearances, most
 *     first — so a player with a real number still beats one with none.
 *  3. Everyone else, alphabetically.
 *
 * Only the Играчи band is ordered this way. Тренери and Раководство are ordered
 * by **most recent service** instead (`compareByRecency`, D-3.13-4) — still not
 * a ranking, which no source gives for them, but a chronology derived from data
 * the archive already holds.
 */
export function compareByLegendRank(a: RankedPerson, b: RankedPerson): number {
  const rankA = a.legendRank ?? null;
  const rankB = b.legendRank ?? null;
  if (rankA !== rankB) {
    if (rankA == null) return 1;
    if (rankB == null) return -1;
    if (rankA !== rankB) return rankA - rankB;
  }

  const appsA = a.careerStats?.appearances ?? null;
  const appsB = b.careerStats?.appearances ?? null;
  if (rankA == null && appsA !== appsB) {
    if (appsA == null) return 1;
    if (appsB == null) return -1;
    return appsB - appsA;
  }

  return compareByName(a.name ?? "", b.name ?? "");
}

/**
 * The year a season slug opens on: `"1952-53"` → `1952`, `"1922-26"` → `1922`.
 * Null when the slug does not start with four digits — every one of the 96
 * published slugs does, so that branch is a guard, not a live case.
 */
export function seasonStartYear(
  slug: string | null | undefined,
): number | null {
  const match = /^(\d{4})/.exec(slug ?? "");
  return match ? Number.parseInt(match[1], 10) : null;
}

/**
 * Trainer name → the latest season they are recorded as coaching, built once
 * from every season carrying a `trainer` string.
 *
 * A season's `trainer` is one or more names separated by commas, so each is
 * split and trimmed, and the index keys on the **exact** trimmed name.
 * Deliberately not a substring match: „Благој Истатов" is a substring of seven
 * different multi-name season strings, and matching loosely would credit
 * seasons to the wrong man. A name that never matches a person document simply
 * never gets looked up, and a person the index does not hold sorts to the end
 * of their band (`compareByRecency`) rather than to a guessed year.
 */
export function buildTrainerYearIndex(
  seasons: { slug: string | null; trainer: string | null }[],
): Map<string, number> {
  const index = new Map<string, number>();

  for (const season of seasons) {
    const year = seasonStartYear(season.slug);
    if (year === null) continue;

    for (const part of (season.trainer ?? "").split(",")) {
      const name = part.trim();
      if (!name) continue;
      const known = index.get(name);
      index.set(name, known === undefined ? year : Math.max(known, year));
    }
  }

  return index;
}

/**
 * The latest four-digit year in a biography's opening line — the end of an
 * official's term. The 3.02F pass wrote that line in exactly two shapes,
 * „Претседател на ФК Беласица во 1922 година." and „…во периодот 2015–2024.",
 * so the largest year in it is the end of the term either way.
 *
 * Null when the line holds no year, which sorts that person to the end of their
 * band instead of to a guessed date.
 */
export function tenureEndYear(
  bioLead: string | null | undefined,
): number | null {
  const years = (bioLead ?? "").match(/\b(1[89]\d{2}|20\d{2})\b/g);
  return years === null ? null : Math.max(...years.map(Number));
}

/** The shape `compareByRecency` needs — a subset of the roster row. */
export type DatedPerson = {
  name?: string | null;
  sortYear?: number | null;
};

/**
 * Order for the Тренери and Раководство bands (D-3.13-4): most recent service
 * first, so the club's latest coach and its last president open their bands
 * rather than sitting mid-list under an alphabet.
 *
 * The year is derived, never stored and never rendered — trainers from the
 * latest `season.trainer` they appear in, officials from the term in their own
 * biography. Anyone with no derivable year sorts to the **end** of the band,
 * alphabetically, and equal years break the same way. That fallback is the
 * whole safety story: if a biography is ever rewritten without a year, that one
 * person moves to the bottom and nothing else on the page changes.
 *
 * `compareByName`, never a raw `<` — the latter compares UTF-16 code units and
 * would order „Ѓ" (U+0403) after „Ш" instead of between „Г" and „Д".
 */
export function compareByRecency(a: DatedPerson, b: DatedPerson): number {
  const yearA = a.sortYear ?? null;
  const yearB = b.sortYear ?? null;

  if (yearA !== yearB) {
    if (yearA === null) return 1;
    if (yearB === null) return -1;
    return yearB - yearA;
  }

  return compareByName(a.name ?? "", b.name ?? "");
}

/**
 * Macedonian count label per band, same singular rule as D-2.02-12: only 1 takes
 * the singular. Each band counts its own noun — „3 играчи" reads naturally under
 * „Играчи", where a generic „3 личности" would not. Раководство counts members,
 * since the band is the body rather than a role name.
 */
const BAND_COUNT_NOUN: Record<PersonRole, [singular: string, plural: string]> =
  {
    player: ["играч", "играчи"],
    trainer: ["тренер", "тренери"],
    president: ["член", "членови"],
  };

export function bandCountLabel(role: PersonRole, count: number): string {
  const [singular, plural] = BAND_COUNT_NOUN[role];
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * The roster total for the /legendi header, same singular rule again. It counts
 * across all three bands, so it takes the neutral „личност" rather than a role
 * noun — „160 играчи" would be a false claim about people who are not players.
 * The caller only reaches this with a real, non-zero count: a roster of nobody
 * renders the page's empty branch instead of a „0" line.
 */
export function personCountLabel(count: number): string {
  return `${count} ${count === 1 ? "личност" : "личности"}`;
}

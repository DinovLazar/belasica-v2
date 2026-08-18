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

/**
 * The four categories /legendi is divided into since the owner's feedback of
 * 11.08.2026 („кога завршуваат играчите, не сакам да продолжуваат тренерите —
 * туку нека се во 3 теми", plus a fourth for the internationals).
 *
 * A category is NOT a role. Three of them are named after a role and hold
 * everyone who has it; the fourth, `international`, is a membership list Ace
 * supplies by hand (`@/content/legendi`) and corresponds to no schema value.
 * The two ideas were the same thing until 3.22 and are now deliberately apart.
 */
export type LegendCategory = PersonRole | "international";

/** Category order on the page and in the tab rail, top→bottom, left→right. */
export const CATEGORY_ORDER: readonly LegendCategory[] = [
  "player",
  "trainer",
  "president",
  "international",
] as const;

/** The section heading each category renders. */
export const CATEGORY_TITLE: Record<LegendCategory, string> = {
  player: "Играчи",
  trainer: "Тренери",
  president: "Претседатели",
  international: "Репрезентативци и интернационалци",
};

/**
 * The tab's own label, which is the heading everywhere it fits.
 *
 * „Репрезентативци и интернационалци" is 34 characters — as a tab it pushes the
 * other three off a phone screen and turns a four-item rail into a scroll. The
 * tab therefore carries the first noun and the section heading below it carries
 * Ace's full phrase, so nothing is renamed and nothing is truncated mid-word.
 */
export const CATEGORY_TAB_LABEL: Record<LegendCategory, string> = {
  ...{
    player: "Играчи",
    trainer: "Тренери",
    president: "Претседатели",
  },
  international: "Репрезентативци",
};

/**
 * The `<section id>` each category renders on, and therefore the target its tab
 * controls. Latin slugs, like every other anchor on the site (`prikazna`,
 * `rezultati`, `fotografii`), so a shared `#…` survives copy-paste out of a URL
 * bar.
 */
export const CATEGORY_ANCHOR: Record<LegendCategory, string> = {
  player: "igraci",
  trainer: "treneri",
  president: "pretsedateli",
  international: "reprezentativci",
};

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
 * Only the Играчи band is ordered this way. Тренери and Претседатели are ordered
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
 * Trainer name → a **sort key** for how recently they last coached, built once
 * from every season carrying a `trainer` string.
 *
 * The key is `year + position-within-that-season`, and only its ORDER is
 * meaningful — it is never rendered, never printed and never compared to a real
 * date. The fraction is what makes 3.22 correct: a season's `trainer` holds one
 * or more names „listed in the order they held the job" (`facts.md`), so within
 * 2025/26 — „Александар Стојанов, Панче Стојанов" — Панче took the job second
 * and is therefore the more recent of the two. Keying on the year alone made
 * them tie, and the alphabet then put Александар first, which is the reverse of
 * both the season's own story („Александар Стојанов си даде оставка, а на негово
 * место дојде Панче Стојанов") and of Ace's list. The fraction is strictly less
 * than 1, so it can never lift a coach past a man from a later season.
 *
 * Each name is split and trimmed, and the index keys on the **exact** trimmed
 * name. Deliberately not a substring match: „Благој Истатов" is a substring of
 * seven different multi-name season strings, and matching loosely would credit
 * seasons to the wrong man. A name that never matches a person document simply
 * never gets looked up, and a person the index does not hold sorts to the end of
 * their category (`compareByRecency`) rather than to a guessed year.
 */
export function buildTrainerYearIndex(
  seasons: { slug: string | null; trainer: string | null }[],
): Map<string, number> {
  const index = new Map<string, number>();

  for (const season of seasons) {
    const year = seasonStartYear(season.slug);
    if (year === null) continue;

    const names = (season.trainer ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    names.forEach((name, position) => {
      // Strictly inside (0, 1): a lone coach lands mid-year rather than on the
      // boundary, so no key can collide with a bare `year` from anywhere else.
      const key = year + (position + 1) / (names.length + 1);
      const known = index.get(name);
      index.set(name, known === undefined ? key : Math.max(known, key));
    });
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

/**
 * A president's sort year — the fix for the one ordering bug the owner could see
 * on the page (11.08.2026: „Исто и кај претседателите, првин Славе Пинда, па се
 * оди со Петар Мишовски, Ванчо Таковски и назад").
 *
 * `tenureEndYear` alone got this wrong. It reads the largest year out of the
 * biography's opening line, and the two most recent presidents both yield
 * **2015** — Славчо Васков-Пинда because his term opened in 2015 and has not
 * closed, Петар Мишевски because his term closed in it. A tie falls to the
 * alphabet, and „Петар" precedes „Славчо", so the club's sitting president sat
 * second on his own page.
 *
 * `playingYears` settles it. For these men the 3.02F pass wrote their TERM into
 * that field, not a playing span — „2015–", „2007–2015", „1999–2007" — so an
 * open-ended value is a term still running, and sorts ahead of every closed one.
 *
 * Read **only for a president who holds no other role**. For a man who also
 * played, `playingYears` means what its name says and would be his playing span,
 * not his presidency: Александар Трендов's „1950–1959" is when he played. He
 * falls through to the biography line, exactly as before.
 *
 * `Number.POSITIVE_INFINITY` rather than a hardcoded future year, so this needs
 * no maintenance when the calendar moves; `compareByRecency` only ever compares
 * these values, never prints one.
 */
export function tenureSortYear(person: {
  role?: string[] | null;
  playingYears?: string | null;
  bioLead?: string | null;
}): number | null {
  const roles = orderedRoles(person.role);
  const presidentOnly = roles.length === 1 && roles[0] === "president";

  if (presidentOnly) {
    const term = (person.playingYears ?? "").trim();
    // „2015–" / „2015-" — an opening year and no closing one.
    if (/^(1[89]\d{2}|20\d{2})\s*[–-]\s*$/.test(term)) {
      return Number.POSITIVE_INFINITY;
    }
    // „2007–2015" — take the closing year.
    const closed =
      /^(?:1[89]\d{2}|20\d{2})\s*[–-]\s*(1[89]\d{2}|20\d{2})$/.exec(term);
    if (closed) return Number.parseInt(closed[1], 10);
  }

  return tenureEndYear(person.bioLead);
}

/** The shape `compareByRecency` needs — a subset of the roster row. */
export type DatedPerson = {
  name?: string | null;
  sortYear?: number | null;
};

/**
 * Order for the Тренери and Претседатели bands (D-3.13-4): most recent service
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
 * „Играчи", where a generic „3 личности" would not. Since 3.14 that holds for
 * the officials too: their category is named „Претседатели" after the role it
 * holds rather than after the body, so it counts претседатели and no longer
 * членови (D-3.14-1). The fourth category counts репрезентативци.
 */
const CATEGORY_COUNT_NOUN: Record<
  LegendCategory,
  [singular: string, plural: string]
> = {
  player: ["играч", "играчи"],
  trainer: ["тренер", "тренери"],
  president: ["претседател", "претседатели"],
  international: ["репрезентативец", "репрезентативци"],
};

export function categoryCountLabel(
  category: LegendCategory,
  count: number,
): string {
  const [singular, plural] = CATEGORY_COUNT_NOUN[category];
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * The roster total for the /legendi header, same singular rule again. It counts
 * DISTINCT people, not category memberships — since 3.22 a player-coach is in
 * two categories and would otherwise be counted twice — so it takes the neutral
 * „личност" rather than a role
 * noun — „160 играчи" would be a false claim about people who are not players.
 * The caller only reaches this with a real, non-zero count: a roster of nobody
 * renders the page's empty branch instead of a „0" line.
 */
export function personCountLabel(count: number): string {
  return `${count} ${count === 1 ? "личност" : "личности"}`;
}

/**
 * „38 настапи" / „1 настап" and „16 голови" / „1 гол" — the same singular rule as
 * every other count on the site (D-2.02-12): only 1 takes the singular.
 *
 * Added at 3.27 for the Репрезентативци card, which is the first surface to
 * print a figure that needs its own noun rather than a bare number in a column.
 * The Играчи card still prints its count bare beside the name, with an `sr-only`
 * qualifier — that layout is unchanged.
 *
 * These label a WHOLE-CAREER figure wherever they are used today. They are
 * deliberately scope-neutral all the same: the label states the noun, and the
 * caller states the scope („Цела кариера: …"), so neither can silently start
 * describing the other's numbers.
 */
export function appearanceCountLabel(count: number): string {
  return `${count} ${count === 1 ? "настап" : "настапи"}`;
}

export function goalCountLabel(count: number): string {
  return `${count} ${count === 1 ? "гол" : "голови"}`;
}

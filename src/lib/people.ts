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
export function primaryRole(role: string[] | null | undefined): PersonRole | null {
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

/**
 * Macedonian count label per band, same singular rule as D-2.02-12: only 1 takes
 * the singular. Each band counts its own noun — „3 играчи" reads naturally under
 * „Играчи", where a generic „3 личности" would not. Раководство counts members,
 * since the band is the body rather than a role name.
 */
const BAND_COUNT_NOUN: Record<PersonRole, [singular: string, plural: string]> = {
  player: ["играч", "играчи"],
  trainer: ["тренер", "тренери"],
  president: ["член", "членови"],
};

export function bandCountLabel(role: PersonRole, count: number): string {
  const [singular, plural] = BAND_COUNT_NOUN[role];
  return `${count} ${count === 1 ? singular : plural}`;
}

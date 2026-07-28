/**
 * Phase 3.05a — the structural copy every direction renders, verbatim from the
 * live homepage. Identical copy across all three variants is what makes the
 * owner's pick a pick about *design*.
 *
 * Content-truth: none of these lines makes a factual claim. They describe what
 * the archive IS and where its links go — no founding year, no season count,
 * no city, no honours. `facts.md` has the club's founding year as UNVERIFIED
 * and records nothing about a home town, so no masthead dateline, no „од 1922",
 * and no „Струмица" appears in any variant (D-3.05a-6).
 */

/** VERIFIED site self-description (facts.md, Ace via Lazar, 2026-07-16). */
export const UNOFFICIAL_ARCHIVE = "Неофицијална архива";

export const HERO_HERITAGE =
  "Сезоните, легендите и рекордите на клубот — собрани и зачувани на едно место.";

export const STORY_LEAD = "Историјата на клубот, собрана на едно место.";

export const DECADES_LEAD =
  "Сезоните од целата историја на клубот, групирани по децении.";

export const LEGENDS_LEAD = "Луѓето што ја одбележаа историјата";

export const RECORDS_LEAD = "Клубот во бројки";

export const QUICKLINKS_LEAD = "Каде понатаму";

/** Section kickers, in page order. Navigation copy, not claims. */
export const KICKER = {
  hero: UNOFFICIAL_ARCHIVE,
  story: "За клубот",
  legends: "Легенди",
  records: "Статистика",
  decades: "Архива",
  moment: "Момент од историјата",
  quicklinks: "Истражи",
} as const;

export const QUICK_LINKS: { href: string; label: string; sub: string }[] = [
  { href: "/arhiva", label: "Архива", sub: "Сезона по сезона" },
  { href: "/legendi", label: "Легенди", sub: "Играчи и личности" },
  { href: "/statistika", label: "Статистика", sub: "Рекорди и табели" },
  { href: "/za-nas", label: "За нас", sub: "За овој проект" },
];

/** Calls to action, shared so the three headers/heroes stay comparable. */
export const CTA = {
  archive: "Разгледај ја архивата",
  legends: "Легенди на клубот",
  allLegends: "Сите легенди",
  allStats: "Сите рекорди и статистика",
  about: "За архивата",
} as const;

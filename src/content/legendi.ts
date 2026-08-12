/**
 * Owner-supplied data for /legendi that has no home in the Sanity model.
 *
 * Two facts live here, both stated by Ace (chat via Lazar, 11.08.2026) and both
 * recorded in `facts.md` — this module is their machine-readable form, not a
 * second source. Neither is derived, inferred or extended: if Ace names someone
 * new, he is added here and to `facts.md` together, and nowhere else.
 *
 * They sit in `@/content` rather than `@/lib/people`, which states outright that
 * it holds no facts — only formatting and placement rules.
 */

/**
 * The fourth category on /legendi, „Репрезентативци и интернационалци", by slug.
 *
 * Source: Ace's own numbered Drive folder `010. Репрезентативци на Македонија`,
 * whose file order IS this order — the folder is his list, numbered 1–10 by him.
 * His message of 11.08.2026 names the same men in the same head order („Горан
 * Пандев, Стојков, Попов, Ѓузелов, Бандулиев…") and ends „…", so it is a partial
 * restatement of the folder rather than a replacement for it.
 *
 * By **slug**, never by name: a slug is the stable key, and a person renamed in
 * Studio would otherwise fall silently out of this category. A slug that matches
 * nobody is dropped rather than rendered as a gap — see the resolution note in
 * `/legendi/page.tsx`.
 *
 * ⚠️ FOUR MEN ACE NAMED ARE NOT HERE. Васил Рингов, Благој Георгиев, Сашко
 * Пандев and Дејан Илиев have no person document in Sanity at all, so there is
 * nothing to list. They are owed, not omitted — the register in
 * `current-state.md` carries them.
 *
 * Membership does NOT remove anyone from Играчи: these men keep their place in
 * the appearance ranking and appear here as well (owner decision, 11.08.2026 —
 * „не е проблем и да се споменуваат и кај играчи и кај тренери").
 */
export const INTERNATIONAL_SLUGS: readonly string[] = [
  "goran-pandev",
  "aco-stojkov",
  "goran-popov",
  "robert-popov",
  "igor-gjuzelov",
  "panche-stojanov",
  "deni-masev-dancho-masev",
  "zoran-baldovaliev",
  "nikola-tanushev",
  "toni-banduliev",
] as const;

/**
 * A coach's latest year of service where the archive holds no season to derive
 * it from. Keyed by `person.name`, the same key `buildTrainerYearIndex` uses.
 *
 * The Тренери order is „од последниот, па назад" (D-3.13-4) and is read from
 * `season.trainer`. That works for every coach the archive has a season for, and
 * fails for exactly one man: Ace states Мартин Алаѓозовски is the 2026 coach,
 * and there is no 2026/27 season document — so he would sort to the BOTTOM of
 * the band, when Ace's own list opens with him.
 *
 * `facts.md` carried this as UNVERIFIED („both are consistent with him being the
 * 2026/27 coach, a season that has no record yet. Needs Ace."). Ace's message of
 * 11.08.2026 answers it in his own words: „Треneri, нека се од последниот па
 * назад: Martin Alagjozovski 2026 / Pance Stojanov 2025-2026 / …".
 *
 * An override wins over the season index, so this cannot be quietly contradicted
 * by a season document appearing later — it will simply keep applying until it
 * is removed here. Empty this map the moment a 2026/27 season is published.
 */
export const COACH_YEAR_OVERRIDE: Readonly<Record<string, number>> = {
  "Мартин Алаѓозовски": 2026,
};

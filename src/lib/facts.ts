/**
 * Verified copy from `facts.md`, as code constants.
 *
 * The rule (CLAUDE.md, content-truth): a factual claim rendered on the site
 * comes only from `facts.md`, and only from a VERIFIED entry. Strings here are
 * transcribed **verbatim** — never reworded, never "improved". Change one only
 * when `facts.md` changes, and quote the entry.
 */

/**
 * **OV-3 — VERIFIED** (Ace, sit-down via Lazar, 2026-07-16).
 *
 * `facts.md` records this as the "Confirmed footer wording (exact, **as
 * rendered**)" — Ace confirmed the wording he was shown, which is the string
 * `SiteFooter` hardcodes. Both strings below are byte-identical to `facts.md`.
 *
 * ⚠ Two things this constant deliberately does **not** do:
 *
 *  1. It does not touch `SiteFooter`, which still hardcodes its own copy of
 *     these strings (out of scope for 2.06). The two are identical today; this
 *     module is the place to converge them in a later chrome phase.
 *  2. It does not read `siteSettings.footerUnofficialArchiveText`. That field
 *     is populated in the `production` dataset with **different** wording
 *     („…создадена од љубов кон клубот. Сајтот не е официјална страница на
 *     клубот и не е поврзан со него.") that no page renders and that Ace was
 *     therefore never shown — so it is *not* the VERIFIED OV-3 string. Wiring
 *     it up would silently ship unverified copy. See the owed-verification
 *     register (OV-6).
 */
export const UNOFFICIAL_ARCHIVE_LABEL = "неофицијална архива";

export const UNOFFICIAL_ARCHIVE_STATEMENT =
  "Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот.";

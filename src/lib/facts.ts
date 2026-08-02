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

/**
 * **VERIFIED** (owner, chat, 2026-07-31) — `facts.md` §Contact & links.
 *
 * The archive's one contact address, and the address §10 of
 * `/pravni-informacii` promises a takedown request will reach. It lives here
 * rather than in three components because it now renders on three surfaces —
 * the footer's „Контакт" column, `/kontakt`'s direct-contact block and the
 * legal page — and three hardcoded copies would drift the day it changes.
 *
 * Clears the email half of PL-3 / PL-9; until 2026-07-31 every one of those
 * surfaces rendered a `PlaceholderChip` instead (D-2.07-4).
 */
export const CONTACT_EMAIL = "info@belasicahistory.mk";

/**
 * **VERIFIED** (owner, chat, 2026-08-02) — `facts.md` §Contact & links.
 *
 * A Belasica **fan page**, supplied by Ace. It is neither the club's official
 * account nor a profile this archive runs, so the footer names it „Фејсбук
 * страница на навивачите" — calling it „Следете нѐ на Фејсбук" would claim an
 * account we do not have, on a site whose whole premise is that it is
 * unofficial.
 *
 * Scoped to the **footer only**, at the owner's instruction („only the
 * footer"). `/kontakt`'s direct-contact block therefore still renders the
 * PL-15 chip — the placeholder is cleared on one of its two surfaces, not
 * both (D-3.12-6).
 */
export const FACEBOOK_FAN_PAGE = "https://www.facebook.com/share/1FK4bKq9wx/";

export const FACEBOOK_FAN_PAGE_LABEL = "Фејсбук страница на навивачите";

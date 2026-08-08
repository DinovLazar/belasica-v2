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
 * **VERIFIED** (owner, chat, 2026-08-08) — `facts.md` §Contact & links.
 *
 * The archive's two social profiles. **Both are authored and edited by Аце
 * Стојанов**, the same person who wrote this site's texts and the book — which
 * is why the „фан-страница" framing 3.12 used is retired here (D-3.15-2,
 * superseding D-3.12-6). The About copy the owner supplied on 2026-08-08 states
 * the authorship outright, so labelling the Facebook profile as somebody else's
 * fan page would have the site contradict its own „За нас" page.
 *
 * They render on **two** surfaces now — the footer's „Следете нѐ" column and
 * `/kontakt`'s direct-contact block — which closes PL-15 on both.
 *
 * The Instagram address the owner supplied carried
 * `?utm_source=qr&igsh=…` — a QR-scan tracking payload, not part of the
 * address. Stripped (D-3.15-3); the bare URL resolves to the same profile.
 */
export const FACEBOOK_URL = "https://www.facebook.com/share/1FK4bKq9wx/";

export const INSTAGRAM_URL = "https://www.instagram.com/belasica1956.2006";

/**
 * The visible label and the accessible name differ on purpose. „Фејсбук" is
 * what the eye needs beside a recognisable glyph; a screen reader announcing
 * „Фејсбук" alone, out of the footer's context, would not say *whose*. The
 * visible word is a substring of the accessible name, so WCAG 2.5.3 (Label in
 * Name) holds.
 */
export const SOCIAL_LINKS = [
  {
    href: FACEBOOK_URL,
    label: "Фејсбук",
    accessiblePrefix: "Беласица на ",
    icon: "facebook",
  },
  {
    href: INSTAGRAM_URL,
    label: "Инстаграм",
    accessiblePrefix: "Беласица на ",
    icon: "instagram",
  },
] as const;

/**
 * **VERIFIED** (owner, chat, 2026-08-08) — `facts.md` §Naming & identity.
 *
 * The site's stated copy posture, rendered in the footer's bottom bar.
 *
 * ⚠ It asks for **permission**; it does not claim **ownership** — and that is
 * deliberate, not a wording slip to be tidied later. This archive publishes
 * newspaper scans and material whose rights sit elsewhere, and
 * `/pravni-informacii` §5 promises an unconditional takedown on request. A line
 * claiming the site owned every photograph would contradict its own legal page
 * (D-3.15-1).
 */
export const CONTENT_PERMISSION_NOTICE =
  "Текстовите и фотографиите објавени на оваа страница не смеат да се преземаат, копираат, објавуваат или користат на друго место без претходна дозвола од авторот.";

/**
 * **VERIFIED** (owner, chat, 2026-08-08) — `facts.md` §People (About us).
 *
 * The „За нас" body, in the author's own words, supplied by the owner and
 * rendered **verbatim**. It carries four factual claims, all of which check out
 * against the archive's own data: Аце Стојанов is the author (this closes PL-1);
 * Томе Стојанов (1953–2020) is his father and a Belasica player (PL-2); his
 * **328** first-team matches match `careerStats.appearances` on
 * `person-tome-stojanov` exactly; and his **14 seasons** match his
 * `playingYears` of 1976–1990.
 *
 * ⚠ **Do not edit this copy.** No humanizer pass, no restructuring, no
 * "improving". Specifically, and each for a reason somebody will otherwise
 * undo:
 *
 *  - The **book is named**, superseding the standing intake rule „The site
 *    never mentions Ace's book" — the owner supplied this copy himself
 *    (D-3.15-8). The rule is marked SUPERSEDED in `facts.md`, not deleted.
 *  - The book title takes Macedonian quotes „…" (U+201E/U+201C) per D-3.07-9,
 *    and the **hyphen inside the title is the author's**, kept as typed.
 *  - **FK Belasica 1956-2006** is a proper name — Latin script, hyphen — not a
 *    year range to be normalised to an en dash.
 *  - The father's life years **do** take the en dash (1953–2020), matching all
 *    160 person records.
 *  - „веб сајт" in one paragraph and „веб страна" in the other is the author's;
 *    so is the comma inside „(328 првенствени натпревари, во 14 сезони)".
 */
export const ABOUT_AUTHOR_PARAGRAPH =
  "Автор на текстот и уредник на овој веб сајт, FB профилот FK Belasica 1956-2006 и книгата „ФК Беласица - гордоста на Струмица“ е Аце Стојанов.";

export const ABOUT_DEDICATION_PARAGRAPH =
  "Оваа веб страна е инспирирана од фудбалската кариера на мојот покоен татко, Томе Стојанов (1953–2020), фудбалска легенда на ФК Беласица (328 првенствени натпревари, во 14 сезони), па му ја посветувам на него и на сите негови соиграчи, но и на сите други играчи, тренери, претседатели и други спортски работници на ФК Беласица низ овие досегашни 104 години историја.";

/**
 * The father's name, exactly as it appears inside
 * `ABOUT_DEDICATION_PARAGRAPH` and as `person.name` in Sanity. The About page
 * splits the paragraph on this substring to hang a link on it, so the rendered
 * text stays byte-identical to the constant whether the link resolves or not.
 */
export const ABOUT_FATHER_NAME = "Томе Стојанов";

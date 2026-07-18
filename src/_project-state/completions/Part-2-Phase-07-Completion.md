# Part 2 · Phase 07 · Code — Completion Report

**Date:** 2026-07-18 · **Outcome (one line):** `/kontakt` is built — the last 404 in the six-item nav is gone, and the contact form is fully built, waiting on one config value (the Formspree endpoint) rather than on more code.

---

## 1. What shipped (plain language)

The Contact page now exists at `/kontakt`, so every link in the site's top navigation lands on a real page for the first time. It has a working contact form with four states (empty, sending, thank-you, error) and a direct-contact block. The form's destination address isn't set up yet (that's a later step), so today the form shows as clearly **disabled** with a note explaining it's being connected — it can't silently swallow a visitor's message. Everything else on the page (heading, the "page in preparation" notice, the direct-contact block) renders normally.

---

## 2. Definition of Done

**Verifiable by the executor**

- ✅ `/kontakt` returns 200 and no longer 404s; all six nav links land on a real page — evidence: `curl` returned `200 /kontakt` and 200 for `/`, `/arhiva`, `/arhiva/1992-93`, `/statistika`, `/legendi`, `/legendi/vaso-cvetkov`, `/za-nas`.
- ✅ Page is a server component; `ContactForm` is the only new client component; no Sanity query added — evidence: `src/app/(site)/kontakt/page.tsx` has no `"use client"` and no `client.fetch`; only `src/components/contact/ContactForm.tsx` is `"use client"`.
- ✅ Section order matches handover §5: breadcrumb → heading → provisional banner → two-column form + direct block — evidence: desktop screenshot.
- ✅ Two columns at 1280 with `border-l border-mist`; single column at 375 with form first and `border-t border-mist` above the direct block — evidence: 1280 and 375 screenshots; `md:grid-cols-2` + `border-t … md:border-l md:border-t-0`.
- ✅ All four states built and demonstrated: idle, submitting (button disabled „Се испраќа…", no layout shift via `min-w-[13rem]`), success (`role="status"`, form replaced), error (`role="alert"` above form, **input retained**, button „Испрати повторно") — evidence: four screenshots + DOM assertions (error run retained `Петар Тест`/`petar@example.com`/message; success gave `role=status` `aria-live=polite`, form removed; submitting gave disabled button + `aria-busy=true` + disabled inputs). See §7 on how (temporary in-file mock, stripped).
- ✅ All UI copy Macedonian; „Пошаљи"/„Шаље се…"/„Хвада!"/„Пошаљи поново" appear nowhere — evidence: `grep` for those strings in the diff returns nothing; button labels are „Испрати"/„Се испраќа…"/„Ви благодариме!"/„Испрати повторно".
- ✅ With endpoint unset: form renders visibly disabled with a notice + `PlaceholderChip`, rest of page renders, nothing throws, no submit possible — evidence: disabled-state screenshots (1280 + 375); DOM check `formPresent:false, fieldsetDisabled:true` (disabled variant is a `<fieldset disabled>`, there is no `<form>`).
- ✅ `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in `.env.example` (empty) and absent from `.env.local`/Vercel; no secret added — evidence: `.env.example` committed with `NEXT_PUBLIC_FORMSPREE_ENDPOINT=`; `.env.local` unchanged (`git add --dry-run .env.local` → ignored); trackable via `!.env.example`.
- ✅ Email + every social render as `PlaceholderChip`s; no `mailto:` with a real address and no footer-social link in the diff — evidence: page source uses `<PlaceholderChip label="адреса за е-пошта">` and `<PlaceholderChip label="профили на социјалните мрежи">`; no `mailto:`/`href` to demo socials in the page.
- ⚠️ Every input has a bound `<label>`; keyboard-operable with a visible focus ring — **verified with two limits.** Bound labels: ✅ confirmed (`el.labels` → „Име *"/„Е-пошта *"/„Порака *", each `for` matching its input). Focus ring: ✅ confirmed rendering on keyboard-style focus (`focusOnPaper` navy 2px ring + paper 2px offset, `:focus-visible` matched). **A physical field-by-field Tab-through could not be executed** — the in-app preview browser does not deliver `Tab` keystrokes to the page focus manager, and no real Chrome is connected to the extension. Native focusable elements in correct DOM order (name→email→message→submit) with no `tabindex` overrides make it keyboard-operable by construction; a device-level tab-through should be spot-checked on the preview. See §7.
- ✅ Every new text/bg pair ≥ 4.5:1; measured values listed below — evidence: computed in-browser (WCAG formula).
- ✅ Single `h1`, `h2` for sections, order unbroken — evidence: one `<h1>` „Контакт"; `<h2>` „Испратете порака" / „Директен контакт"; provisional banner is overline-led (no heading). (Title is a direct `<h1>`, not `SectionHeading` — D-2.07-6.)
- ✅ No new dependency (`package.json`/lockfile unchanged); no new `brand.md` token — evidence: `git status` shows neither `package.json` nor `package-lock.json` nor `brand.md`.
- ✅ No schema change; `src/sanity/` untouched — evidence: `git status` lists no `src/sanity/` path.
- ✅ `SiteFooter`, `src/lib/facts.ts` and every other route untouched — evidence: diff touches only `kontakt/page.tsx`, `contact/ContactForm.tsx`, `.env.example`, `.gitignore`, and the three state files.
- ✅ The temporary mock is stripped before commit — evidence: `grep -niE "TEMP-MOCK|activeEndpoint|mock\.test|URLSearchParams|useEffect"` in `ContactForm.tsx` → no matches; the committed file uses a real `fetch`.
- ✅ `npm run build` and `npm run lint` both clean — evidence: lint no output; build „✓ Generating static pages (18/18)", `/kontakt` = `○ (Static)`.
- ✅ Sibling routes still 200 and visually unregressed — evidence: 200 checks above; diff is additive-only (no sibling file touched).
- ✅ Vercel preview URL verified 200 with the real page at 1280 + 375 — **URL:** `https://belasica-v2-git-phase-207-contact-page-dinovlazars-projects.vercel.app` · `/kontakt` returns **200** and renders the real page at both widths (disabled-form state, all three chips: PL-14/PL-3/PL-15; h1 „Контакт"; no `<form>`, `fieldset[disabled]`); `/`, `/arhiva`, `/statistika`, `/legendi`, `/za-nas` also 200 — no sibling regression. Verified **before requesting merge** — the gate is not waived (the D-2.04-7 waiver was a one-off outage). Production runtime renders identically to localhost (no env-only surprise).
- ✅ `current-state.md`, `file-map.md`, `decisions.md` updated: `NEXT:` set, PL-14/PL-15 added, PL-3 marked visible, OV-8 added, `D-2.07-1..6` logged — evidence: §6.

**Measured contrast (WCAG AA needs 4.5:1) — all pass:**

| Pair | Ratio |
|---|---|
| navy on paper (h1/h2/labels/links) | 13.12 |
| neutral-700 on paper (intro/overlines/chip) | 10.37 |
| neutral-500 on paper (required-fields note) | 4.94 |
| error on paper (required `*`) | 5.98 |
| paper on navy (submit button) | 13.12 |
| neutral-700 on white (banner/notice/success/error body) | 11.40 |
| navy on white (success „Ви благодариме!") | 14.43 |
| error on white (error-alert heading) | 6.57 |
| ink on white (input value text) | 17.24 |
| neutral-500 on white (input placeholder) | 5.43 |

Lowest = 4.94:1 (neutral-500 on paper). All ≥ 4.5:1.

**Owed to Lazar (register, not checked here)**

- ⚠️ **OV-8** — the submitting/success/error (and idle) states have never run against a real Formspree endpoint. Fixture-verified only. Clears in 3.03.

---

## 3. Decisions I made during this phase

All are logged in `decisions.md` (needs a decision-log entry: **YES** for each):

- **D-2.07-1** — Contact copy is **Macedonian, not the handover's Serbian** · the site is Macedonian-only (three in-repo sources + the brief's own correction table) · alt rejected: follow the handover verbatim (ships Serbian on a Macedonian site).
- **D-2.07-2** — The endpoint is a **public form action** read from `NEXT_PUBLIC_FORMSPREE_ENDPOINT`; `.env.example` committed via a `!.env.example` `.gitignore` negation · a Formspree action is not a secret (like the `NEXT_PUBLIC_SANITY_*` values) · alt rejected: a server-only var (no security gain, extra plumbing).
- **D-2.07-3** — Unset endpoint → **visibly disabled form**, never enabled-but-silently-failing · a contact page must not drop a visitor's message · alts rejected: enabled-and-fails, hide the form, throw/404.
- **D-2.07-4** — Email + socials render as `PlaceholderChip`s; the footer's demo values are **not** propagated · `facts.md` has no verified contact data, and PL-9 is a known cutover blocker · alts rejected: reuse the footer demos, invent an address.
- **D-2.07-5** — Reuse the existing `PlaceholderChip`, **not** the handover's „amber" chip · no amber token exists and none may be added (same as D-2.06-5) · alt rejected: add an amber token / one-off chip.
- **D-2.07-6** — The page title is a **direct `<h1>`**, not `SectionHeading` (which is an `<h2>`) · the single-`h1` DoD rule + both sibling routes do this · alt rejected: use `SectionHeading` (no `h1`), or add a level prop to a shipped component.

---

## 4. Deviations from the brief / spec

- The brief lists „`SectionHeading` — „Контакт"" for the title; I rendered a direct `<h1>` instead, to satisfy the single-`h1` accessibility rule and match `/statistika` + `/za-nas` (D-2.07-6). Visual treatment differs slightly (plain serif h1 vs. orange-rule marker); heading order is correct.
- The keyboard **tab-through** was verified structurally (native elements in order, bound labels, focus ring on keyboard focus) but **not** as a physical Tab-by-Tab walk — the preview browser doesn't deliver `Tab` keystrokes and no real Chrome is connected. Flagged honestly rather than claimed. (See §2 and §7.)
- Otherwise built to the brief and to handover §5/§6.4 (with the brief's documented handover-corrections applied).

---

## 5. Changed files / deliverables

**Code (new):**
- `src/app/(site)/kontakt/page.tsx` — the route (server component).
- `src/components/contact/ContactForm.tsx` — the client form (state machine + disabled variant).
- `.env.example` — env template, `NEXT_PUBLIC_FORMSPREE_ENDPOINT=` (empty). **No secret.**

**Code (edited):**
- `.gitignore` — added `!.env.example`.
- `src/_project-state/current-state.md`, `file-map.md`, `decisions.md` — state sync + decisions.
- `src/_project-state/completions/Part-2-Phase-07-Completion.md` — this report.

**Branch / PR / preview:**
- Branch `phase-2.07-contact-page`; **PR #17** → `main`: https://github.com/DinovLazar/belasica-v2/pull/17
- **Vercel preview:** `https://belasica-v2-git-phase-207-contact-page-dinovlazars-projects.vercel.app` — verified 200, `/kontakt` renders at 1280 + 375, siblings unregressed, **before requesting merge** (the D-2.04-7 waiver was a one-off outage, not a precedent). PR left open for Lazar's diff-review + merge.

**Not created (correctly):** no Formspree account/endpoint (3.03), no `.env.local`/Vercel env value, no secret anywhere.

---

## 6. State updates done

- `current-state.md` — `NEXT:` set to 2.08; 2.07 summary bullet added; stubbed/current-phase lines updated; **PL-14** + **PL-15** added, **PL-3** marked visible; **OV-8** added (open items now 4, verification-phase flag raised); built-pages list updated.
- `file-map.md` — `/kontakt`, `ContactForm`, `.env.example`, `.gitignore` note, and the completion report added.
- `00_stack-and-config.md` — **not touched (correct): no dependency added or upgraded.**

---

## 7. Risks, follow-ups, what the next phase needs to know

- **OV-8 (the headline follow-up).** The four live states are **fixture-verified only** — proven against a temporary in-file mock (a `?mock=success|error` + `?state=` harness that overrode the endpoint and replaced `fetch`), which was **stripped before commit** (grep-confirmed). What actually runs in production today is the **disabled** state (endpoint unset), and that IS content-verified. In **3.03**: create the Formspree endpoint, set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in `.env.local` + Vercel (Prod + Preview), then submit once for real (confirm success + delivery) and once against a bad endpoint (confirm the error banner shows and input is retained).
- **Keyboard tab-through limitation.** Verified structurally, not as a physical walk (preview browser can't deliver `Tab`, no real Chrome connected). The elements are native and in order, so it's keyboard-operable by construction — but a real device tab-through is worth a 10-second spot-check on the preview.
- **Provisional page.** `/kontakt` ships provisional (D-2.05-1); the second Ace sit-down still gates any Contact revision, alongside About (3.03).
- **Owed-verification register is at 4 open items (OV-4/-6/-7/-8)** — its own rule flags the next phase as a verification phase. Three of the four clear on real content / real config, not code.
- **`.gitignore` negation** — only `.env.example` is un-ignored; any future committed env template must add its own `!` line.

---

## 8. What's now possible that wasn't before

The navigation is complete — every top-level link resolves — and the contact form is fully built, so **3.03 becomes a one-value config step (set the Formspree endpoint), not a build phase**: the moment the env var is set, the form enables itself with no code change.

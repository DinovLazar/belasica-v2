# Part 3 · Phase 3.03b — Formspree endpoint (Completion)

**Date:** 2026-07-31
**Branch:** `phase-3.03b-formspree-endpoint` → `main` · **PR:** [#39](https://github.com/DinovLazar/belasica-v2/pull/39)
**Preview:** `https://belasica-v2-ljvyzwojx-sunset-services-team.vercel.app/kontakt`
**Type:** Configuration. No feature work, no logic change, no dependency, no schema change, no Sanity write, no `brand.md` token change.

---

## 1. What shipped

**The contact form is live.** Since 2.07 `/kontakt` had rendered its form inside a disabled `<fieldset>` with the notice „Формуларот сѐ уште не е активен" and a `[PLACEHOLDER]` chip, because `NEXT_PUBLIC_FORMSPREE_ENDPOINT` was never set. 3.03 was assigned that step (D-0.00-7) and shipped without it, so the placeholder has been the production state for two weeks. The owner supplied the endpoint and it is now wired.

**Configuration (the actual deliverable):**

| Where | Value | Environments |
| --- | --- | --- |
| `.env.local` (git-ignored, local only) | `https://formspree.io/f/mojgzzep` | local dev |
| Vercel · `sunset-services-team/belasica-v2` | same | **Production + Preview** |
| `.env.example` (committed) | **empty**, by design | template only |

Production + Preview matches the placement of the three existing `NEXT_PUBLIC_SANITY_*` variables, and matches OV-8's own written instruction. Development was deliberately **not** added — `.env.local` already covers local dev, and adding it would make `vercel env pull` a trap that overwrites `.env.local`.

**Source edits — four, all narrow:**

- `src/app/(site)/kontakt/page.tsx` — the provisional banner's second sentence, „Контакт-каналите подолу допрва се поставуваат", became untrue the moment the form worked. Rewritten to „Формуларот и е-поштата се активни; профилите на социјалните мрежи допрва се поставуваат." (D-3.03b-2) — revised again on the merge with 3.07, which cleared PL-3. Doc comment updated.
- `src/components/contact/ContactForm.tsx` — doc comment only. **No logic touched**; the component already read the variable and already had all four states.
- `.env.example` — comment updated, value stays empty; added the note that `NEXT_PUBLIC_*` is inlined at build time.
- `src/_project-state/*` — snapshot, decisions, this report.

`src/_project-state/file-map.md` **was** synced — this report is a new file, and while adding it I found **eight** other completion reports (2.08, 3.02F, 3.03, 3.04d, 3.05, 3.05a, 3.05b, 3.09) that earlier phases had left unlisted. All nine are now mapped.

## 2. Verification

`npm run build` **270/270** pages, `npm run lint` clean, `npx tsc --noEmit` clean.

**Build output inspected directly**, not inferred: the endpoint string is present in `.next/server/app/kontakt.html`, and „Формуларот сѐ уште не е активен" is **absent** from it — so the production build prerenders the live form, not the disabled one.

**OV-8 is cleared, and both halves ran against the real service** (in-browser, 1280, local dev). 2.07 could only prove these states against a temporary in-file mock.

- **(a) Success, against the live endpoint.** State sequence observed via `MutationObserver`, not a screenshot: `idle → „Се испраќа…" → success panel`. Formspree returned **2xx** — the handler throws on non-ok, so reaching the success panel *is* the proof of an accepted POST. Success panel carries `role="status"` / `aria-live="polite"` and replaces the form.
- **(b) Error, against a deliberately dead endpoint** (`https://formspree.io/f/zzzznotreal`): `idle → „Се испраќа…" → error`. The `role="alert"` banner sits **above** the form — verified by `compareDocumentPosition`, not by eye — **all three typed values were retained**, the fields re-enabled, and the button read „Испрати повторно".

Page state after wiring: real `<form>`, no `fieldset[disabled]`, no „not active" notice, Formspree chip gone. **After the merge with 3.07 the only chip left in `<main>` is PL-15 (социјални мрежи)** — 3.07 cleared PL-3 (е-пошта) hours later, so the two phases together took the page from three chips to one.

**Vercel preview confirmed** (the gate was not waived): `https://belasica-v2-ljvyzwojx-sunset-services-team.vercel.app/kontakt` returns **200**, its HTML carries the endpoint, and both „Формуларот сѐ уште не е активен" and the Formspree chip are **absent**. That closes the one caveat this phase would otherwise have carried — since `NEXT_PUBLIC_*` is inlined at build time, local dev alone could not prove the Vercel variable was picked up.

## 3. Decisions logged

- **D-3.03b-1** — The Formspree endpoint is wired, and OV-8 is cleared against the live form.
- **D-3.03b-2** — The provisional banner narrows to the direct contacts only.
- **D-3.03b-3** — Reconciling that banner with 3.07, which cleared PL-3 mid-branch (logged as a new entry rather than an edit — `decisions.md` is append-only).

## 4. Register changes

- **PL-14** (Formspree endpoint not configured) — **CLEARED**.
- **OV-8** (form states never run against a real endpoint) — **RESOLVED**.
- **PL-15** (socials) — untouched, still open, and now **the only placeholder left on `/kontakt`**.
- **PL-3** (email) — not this phase's work, but cleared by **3.07** (D-3.07-5) while this branch was open. The two phases landed within hours of each other and between them took `<main>` from 3 chips to 1. The page still stays provisional under D-2.05-1; the second Ace sit-down still has not happened.

## 5. Owed to Lazar

1. ⚠️ **Delete the test message.** One real submission („ТЕСТ — Claude Code", 2026-07-31) is in the Formspree inbox for `mojgzzep`. It was the only way to prove the endpoint accepts posts.
2. ⚠️ **Production is still disabled until this merges.** `NEXT_PUBLIC_*` is inlined at **build time**, so setting the Vercel variable changed nothing on its own — the live site picks it up on the redeploy the merge triggers. Confirm on `https://belasica-v2.vercel.app/kontakt` after deploy.
3. **The `NEXT:` pointer resolved itself.** It read „NEXT: 3.06" (stale — 3.06, 3.06a and 3.09 had all shipped); 3.07 landed mid-branch and set it to **3.08 — Domain cutover to `www.belasicahistory.mk`**, which is better-informed than the guess this phase would have made, so 3.08 is what the merge kept.
4. **PL-15 (socials) is the last chip on the page.** 3.07 cleared PL-3 while this branch was open, so the form and the email are both live and only the social profiles are still missing — the Ace sit-down gates those.

## 6. Eyeball checklist (5 items)

1. `/kontakt` shows a **real, usable form** — three fields, no grey-out, no „Формуларот сѐ уште не е активен" box.
2. The banner reads „…Формуларот и е-поштата се активни; профилите на социјалните мрежи допрва се поставуваат."
3. Submitting a message swaps the form for the navy-on-white „ВИ БЛАГОДАРИМЕ!" panel, and the message lands in Formspree.
4. The right-hand „Директен контакт" column shows the **real email** (3.07) above a single `[PLACEHOLDER]` chip for the socials — one chip, not two.
5. Footer is untouched **by this phase** — 3.07 put the real email there; its socials chip (PL-15) remains.

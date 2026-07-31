# Part 3 · Phase 3.03b — Formspree endpoint (Completion)

**Date:** 2026-07-31
**Branch:** `phase-3.03b-formspree-endpoint` → `main`
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

- `src/app/(site)/kontakt/page.tsx` — the provisional banner's second sentence, „Контакт-каналите подолу допрва се поставуваат", became untrue the moment the form worked. Narrowed to „Формуларот е активен; директните контакти допрва се поставуваат." (D-3.03b-2). Doc comment updated.
- `src/components/contact/ContactForm.tsx` — doc comment only. **No logic touched**; the component already read the variable and already had all four states.
- `.env.example` — comment updated, value stays empty; added the note that `NEXT_PUBLIC_*` is inlined at build time.
- `src/_project-state/*` — snapshot, decisions, this report.

`src/_project-state/file-map.md` needed **no sync**: no file was added, renamed or deleted.

## 2. Verification

`npm run build` **270/270** pages, `npm run lint` clean, `npx tsc --noEmit` clean.

**Build output inspected directly**, not inferred: the endpoint string is present in `.next/server/app/kontakt.html`, and „Формуларот сѐ уште не е активен" is **absent** from it — so the production build prerenders the live form, not the disabled one.

**OV-8 is cleared, and both halves ran against the real service** (in-browser, 1280, local dev). 2.07 could only prove these states against a temporary in-file mock.

- **(a) Success, against the live endpoint.** State sequence observed via `MutationObserver`, not a screenshot: `idle → „Се испраќа…" → success panel`. Formspree returned **2xx** — the handler throws on non-ok, so reaching the success panel *is* the proof of an accepted POST. Success panel carries `role="status"` / `aria-live="polite"` and replaces the form.
- **(b) Error, against a deliberately dead endpoint** (`https://formspree.io/f/zzzznotreal`): `idle → „Се испраќа…" → error`. The `role="alert"` banner sits **above** the form — verified by `compareDocumentPosition`, not by eye — **all three typed values were retained**, the fields re-enabled, and the button read „Испрати повторно".

Page state after wiring: real `<form>`, no `fieldset[disabled]`, no „not active" notice, Formspree chip gone. The two chips left in `<main>` are PL-3 (е-пошта) and PL-15 (социјални мрежи) — a different channel, deliberately untouched.

## 3. Decisions logged

- **D-3.03b-1** — The Formspree endpoint is wired, and OV-8 is cleared against the live form.
- **D-3.03b-2** — The provisional banner narrows to the direct contacts only.

## 4. Register changes

- **PL-14** (Formspree endpoint not configured) — **CLEARED**.
- **OV-8** (form states never run against a real endpoint) — **RESOLVED**.
- **PL-3, PL-15** — untouched, still open. `/kontakt` stays provisional under D-2.05-1; the second Ace sit-down still has not happened.

## 5. Owed to Lazar

1. ⚠️ **Delete the test message.** One real submission („ТЕСТ — Claude Code", 2026-07-31) is in the Formspree inbox for `mojgzzep`. It was the only way to prove the endpoint accepts posts.
2. ⚠️ **Production is still disabled until this merges.** `NEXT_PUBLIC_*` is inlined at **build time**, so setting the Vercel variable changed nothing on its own — the live site picks it up on the redeploy the merge triggers. Confirm on `https://belasica-v2.vercel.app/kontakt` after deploy.
3. **Confirm the `NEXT:` pointer.** The snapshot's first line read „NEXT: 3.06" while 3.06, 3.06a and 3.09 have all shipped. It now reads **3.11 — Launch sign-off**, taken from this file's own forward references, and is flagged in place for you to correct.
4. **Repeat check (b) once on the PR preview** if you want it belt-and-braces — everything here was verified on local dev.
5. **PL-3 is the natural follow-on.** The form now works, but the page still shows no email address; those are separate channels and the sit-down gates the second one.

## 6. Eyeball checklist (5 items)

1. `/kontakt` shows a **real, usable form** — three fields, no grey-out, no „Формуларот сѐ уште не е активен" box.
2. The banner reads „…Формуларот е активен; директните контакти допрва се поставуваат."
3. Submitting a message swaps the form for the navy-on-white „ВИ БЛАГОДАРИМЕ!" panel, and the message lands in Formspree.
4. The right-hand „Директен контакт" column still shows its two `[PLACEHOLDER]` chips — that is correct and intended.
5. Footer is unchanged (its own PL-3 / PL-15 chips still there).

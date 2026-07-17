# Part 2 · Phase 06 · Code — Completion Report

**Date:** 2026-07-17 · **Executor:** Claude Code (Opus 4.8), Lazar's machine · **Outcome (one line):** `/legendi`, `/legendi/<slug>` and `/za-nas` are live from Sanity, so every person link the site already renders — squad names, trainer chips, both `/statistika` rankings — now lands on a real page instead of a 404.

## 1. What shipped (plain language)

The archive has people pages. **`/legendi`** is a portrait roster split into Играчи / Тренери / Раководство; **`/legendi/<slug>`** is a page for *every* published person — players, trainers and officials alike — and **`/za-nas`** explains what the archive is, marked provisional until Ace's second sit-down. All three read live Sanity with ISR 60.

The thing to know: **the design handover this phase builds to was never in the repo.** Work stopped before any code was written and escalated; Lazar supplied the file in-session, and it is now committed at `docs/design-handovers/Part-2-Phase-05-Handover.md` (D-2.06-1). Building to it surfaced nine conflicts with `brand.md` / the merged 2.02 handover / the locked schema — all resolved the repo's way, per the handover's own §0. The largest: **its UI copy is Serbian** („Сезоне", „Фотографије", „Све легенде") in a Macedonian-only repo (D-2.06-2).

Live content also **contradicts three of the brief's stated assumptions** — see §4. None was a defect; each was a stale premise.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ **`/legendi` renders bands from live Sanity; each person once, in their highest-priority band, all role chips shown; name-sorted; empty band fully omitted.** Evidence: DOM read at 1280 — Играчи „3 играчи" [Васо Цветков, Панче Пантазиев, Петар Андреев], Тренери „2 тренери" [Гоце Петровски, Илија Андреев]. **Петар Андреев is live-published as `["player","president"]`** and appears **once**, under Играчи, carrying **both** chips (Играч navy + Претседател muted) — D-2.05-2 exercised against real content, not a fixture. ⚠️ **Раководство therefore has zero people and self-omits, so only TWO bands render** — see §4; this is the rule working, not a miss.
- ✅ **Photoless `LegendCard` → solid navy initials tile, never a greybox.** Evidence: Гоце Петровски → „ГП", Илија Андреев → „ИА" (`hasImg:false`, monogram present). Content-verified — both trainers genuinely have no portrait. Deliberately unlike `SeasonCard`'s greybox (D-2.06-7).
- ✅ **`generateStaticParams` over every published person; trainer + president slugs resolve.** Evidence: `npm run build` prerenders **5/5** person paths (`/legendi/goce-petrovski`, `/legendi/panche-pantaziev`, `/legendi/vaso-cvetkov`, +2). `/legendi/goce-petrovski` (trainer) and `/legendi/petar-andreev` (president+player) both render 200. Unknown slug → `notFound()`.
- ✅ **Sections self-omit; `person.bio` renders as Portable Text via `SeasonStory`.** Evidence: Петар's page → h2s [Биографија, Сезони, Фотографии], Кариера absent. ⚠️ **The brief's DoD („a person with no bio omits Биографија — the correct current demo state") is stale**: three published people have real `bio` blocks, so **Биографија is content-verified and renders** (§4).
- ⚠️ **Career applies the no-`0` rule; `careerStats` read directly, never summed.** Code verified: read straight from `person.careerStats`, no `season.squad` sum anywhere. Behaviour is **fixture-verified only (OV-7)** — no published person has `careerStats`. All four states proven against a temporary in-file fixture, since stripped and re-verified absent: both → 2 tiles (Настапи 412 · Голови 37); **appearances-only → 1 tile, no goals tile** (the handover's explicit trainer case); **`goals: 0`, `appearances: null` → one „Голови 0" tile** (a real 0 survives; the null tile omits rather than coercing to 0); both null → **section omits**. Live pages correctly omit Кариера — that omission *is* content-verified.
- ✅ **Сезони lists seasons linking to `/arhiva/<slug>`; Фотографии reads the `relatedPerson` back-reference; both omit when empty.** Evidence: Петар → chip „Сезона 1992/93" → `/arhiva/1992-93`; Фотографии → 1 figure. Both content-verified. ⚠️ Сезони reads `squad[]` **or** `trainers[]`, a deliberate superset of the spec (D-2.06-3, §4).
- ✅ **`/za-nas` shows the provisional banner, OV-3 verbatim, and PL-1 + PL-2 as visible chips — nothing invented.** Evidence: byte-identity against `facts.md` checked **by script, not by eye** (Cyrillic homoglyphs) — both label and statement `MATCH: True`. Four chips render; no invented name or prose.
- ✅ **No new `brand.md` token.** §9's expected outcome. Full §1 mapping below; two handover conventions had no token behind them and were resolved to the repo (D-2.06-5).
- ✅ **No schema change; no existing home/archive/stats component changed; `/kontakt` not built.** Evidence: `git diff --stat` touches no `schemaTypes/`, no `components/{home,archive,stats}/`, no `SiteFooter`. Additive reuse only.
- ✅ **All three routes ISR `revalidate = 60`; every person link now resolves.** Evidence: build output shows `1m` revalidate on `/legendi`, `/legendi/[slug]`, `/za-nas`.
- ✅ **`npm run build` + `npm run lint` clean; verified at 1280 and 375; every new text/bg pair ≥ 4.5:1, ratios recorded.** All **22** new pairs pass; worst **4.94:1** (neutral-500 on paper — brand.md's documented 4.9:1). Table below. No horizontal overflow at 375 on any route (`scrollWidth === clientWidth === 375`, zero offending elements). Focus ring measured on a **real keyboard tab**, not `.focus()`: `:focus-visible` matches, computed `box-shadow` = `rgb(247,244,236) 0 0 0 2px, rgb(18,41,79) 0 0 0 4px` — navy 2px ring, 2px paper offset, exactly `brand.md`.
- ✅ **State synced; report filed.** §6.

**Owed to Lazar (on the owed-verification register):**

- **OV-7 — Кариера has never rendered from real content.** How to clear: in `/studio`, publish one person with `careerStats` (e.g. Петар Андреев: appearances + goals); reload `/legendi/petar-andreev` twice ~60s apart (ISR 60). Expect a Кариера section with two tiles. **This is the same content step that clears OV-4**, so doing it once clears both. Then confirm the no-`0` rule on real data: a person with `appearances` but no `goals` must show **one** tile, never „0 голови".
- **OV-6 — a populated Sanity field contradicts the VERIFIED OV-3 copy.** `siteSettings.footerUnofficialArchiveText` holds different, unverified, never-rendered wording. Decide which is right, then make the OV-3 string exist in exactly one place. Details in the register and D-2.06-9.
- **Vercel preview URL** — see §4; not captured by the executor.
- **5-item eyeball checklist** — §7.

## 3. Decisions I made during this phase

All nine logged in `decisions.md`. Full context/alternatives/downsides are there; one line each here.

| ID | Decision | Why / alternative rejected | Logged |
|---|---|---|---|
| **D-2.06-1** | The 2.05 handover was absent from the repo; Lazar supplied it in-session, it was landed at `docs/design-handovers/Part-2-Phase-05-Handover.md` and built to | Stopped before writing code and escalated rather than invent the design. Rejected: building from 2.02 conventions alone (the D-2.04-2 precedent — scaled badly across 3 routes + 3 net-new components) | yes |
| **D-2.06-2** | UI copy is Macedonian: „Сезони" / „Фотографии" / „Сите легенди" | The handover is Serbian; `CLAUDE.md`, `brand.md`'s Cyrillic test string and shipped code (`BalanceSummary` → `"Сезони"`) all say Macedonian. Rejected: following the handover literally — it would put Serbian labels beside Macedonian ones on one page | yes |
| **D-2.06-3** | Сезони matches `squad[]` **or** `trainers[]` | §3's literal „`season.squad`" is players-only and would leave every trainer's Сезони empty while the season page links *to* them — the dead end this phase exists to remove. Rejected: squad-only per the literal spec | yes |
| **D-2.06-4** | `/za-nas`'s optional hero is omitted, permanently | No field exists to hold it and the model is locked. Rejected: adding `siteSettings.aboutImage` (forbidden schema change); reusing an arbitrary photo (invented content by placement) | yes |
| **D-2.06-5** | Card-lift has **no shadow**; placeholder chip is **not amber** | Neither has a `brand.md` token — the file names the shadow's absence deliberately. Rejected: adding either token (§9 expects none) | yes |
| **D-2.06-6** | Кариера replicates `BalanceSummary`'s tile language; the component isn't reused | It takes a `ClubBalance` (10 figures, coverage tracking, `lg:grid-cols-5`). Rejected: generalising it — a refactor of a stats component the brief puts out of scope | yes |
| **D-2.06-7** | Photoless `LegendCard` = navy initials tile, unlike `SeasonCard`'s greybox | A person has initials, a season doesn't. Also records that the handover's „D-2.02-2/3" citation is **wrong** (real rule: 2.02 §6.2b) | yes |
| **D-2.06-8** | Missing `playingYears` placeholders for **players only** | A trainer has no playing years to be missing; a chip there would assert a gap that doesn't exist. Rejected: always-placeholder (the homepage precedent, which is players-only and never faced this) | yes |
| **D-2.06-9** | OV-3 rendered from a new `src/lib/facts.ts`, not from `siteSettings` | The CMS field holds different, unverified, unrendered text (→ OV-6). Rejected: reading the field (ships unconfirmed copy); a third hardcode | yes |

## 4. Deviations from the brief

- **The brief's premise was wrong: the 2.05 handover did not exist, and the 2.05 design phase never ran.** `current-state.md` read `NEXT: 2.05 — People & pages design`; `decisions.md` ended at D-2.04-7 with no D-2.05-*; 2.02 §15 lists these routes as „Not designed". Escalated before writing code; resolved by D-2.06-1. **2.05 remains formally unclosed** — D-2.05-1/-2/-3 are cited across the handover, the brief and the snapshot but exist nowhere in `decisions.md`. This phase did not back-fill another phase's namespace.
- **Three brief/DoD assumptions are contradicted by live content** (none is a defect):
  1. **„renders three bands"** — Петар Андреев is `["player","president"]`, so priority places him in Играчи, leaving **Раководство empty → self-omits → two bands render.** The brief's own D-2.05-2 and empty-band rules require exactly this. The brief also calls him „(president)" when he is player+president.
  2. **„a person with no bio omits Биографија (the correct current demo state)"** — three published people have real `bio` blocks; **Биографија renders**, content-verified. Same claim in handover §3.
  3. **`roles[]`** (handover §6.1) — the locked schema field is **`role`**.
- **The mockup was never supplied.** The handover names `People & Pages.dc.html` for all four routes at 1280/375; it was not in `~/Downloads` and is not in the repo. Built from the handover's prose alone — so the visual design was, strictly, never seen. Worth Lazar's eye (§7).
- **`/kontakt` not built** — per scope.
- **The contextual „← Назад на сезону …" back-link (handover §3.7) was not built.** It is marked „natural, optional" and needs referrer state a static page doesn't have; „Сите легенди" always renders.
- **Vercel preview URL not captured.** The executor cannot open the PR (no `gh` auth confirmed in-session) — the branch is pushed and the PR/preview step is Lazar's. `CLAUDE.md` requires the preview to load before merge; **that gate is open**, and after D-2.04-7 it should not be waived twice.

## 5. Changed files / deliverables

Branch `phase-2.06-people-pages` → PR to `main` (to open; see §4).

**Added**
- `src/app/(site)/legendi/page.tsx` · `src/app/(site)/legendi/[slug]/page.tsx` · `src/app/(site)/za-nas/page.tsx`
- `src/components/legends/` — `LegendCard.tsx`, `RoleBandGrid.tsx`, `PersonHero.tsx`, `RoleChips.tsx` (path chosen per the brief's option; `RoleChips` is an extra shared piece so card and hero can't drift)
- `src/lib/people.ts` · `src/lib/facts.ts`
- `docs/design-handovers/Part-2-Phase-05-Handover.md` — **the 2.05 design spec, landed here** (D-2.06-1)

**Edited** — `src/_project-state/{current-state.md, file-map.md, decisions.md}` + this report.

**Untouched** (verified): every schema type, `components/{home,archive,stats}/*`, `SiteFooter`, `/kontakt`.

**Dependencies:** none added — `00_stack-and-config.md` needs no entry.

### Token reconciliation (handover §1 → real `brand.md`) — brief task 2

| Handover §1 name | Real token | Note |
|---|---|---|
| `navy` / `paper` / `mist` / `ink` | `navy` `#12294F` · `paper` `#F7F4EC` · `mist` `#E4E1D8` · `ink` `#1B1B1A` | exact match |
| „a lighter card surface" | `card` `#FFFFFF` (used as `bg-white`) | matches shipped usage |
| „muted ink for secondary text" | **two** tokens: `neutral-700` `#3A3A38`, `neutral-500` `#6B6A64` | 700 = body-secondary, 500 = meta/captions |
| „one restrained accent" | `orange` `#E4741C` | **marker only on light surfaces** (D-1.02-1) — never text |
| `py-16 md:py-24` | Tailwind default spacing (64 / 96px) | matches the archive rhythm |
| card-lift „translateY + **softened shadow**" | `hover:-translate-y-0.5` — **no shadow** | `brand.md`: „2px lift (no shadow — there is no shadow token)" → **D-2.06-5** |
| „**amber** `[PLACEHOLDER]` chip" | `PlaceholderChip` — dashed mist border, hatch, mono neutral-700 on paper | **no amber token exists** → **D-2.06-5** |
| serif display / sans UI (mockup: Source Serif 4 / Source Sans 3) | `font-serif` = Source Serif 4 · `font-sans` = **Inter** | both carry Cyrillic |
| 4:5 portrait · radii · measure | `ratio="4/5"` · `rounded-photo/card/chip` · `max-w-measure` (68ch) | exact |
| focus ring | `focusOnPaper` / `focusOnNavy` (`src/lib/focus.ts`) | navy 2px + 2px offset |

**Result: no new token needed — §9's expected outcome.**

### Contrast — all 22 new text/background pairs (WCAG 2.2, computed)

| Pair | Ratio |
|---|---|
| Card name · Career figure · Season chip — navy on white | **14.43:1** |
| OV-3 statement — ink on paper | **15.68:1** |
| Band title · hero H1 · role chips · monogram — navy↔paper | **13.12:1** |
| Career tile label · provisional banner — neutral-700 on white | **11.40:1** |
| Secondary role chip · OV-3 label · placeholder chip — neutral-700 on paper | **10.37:1** |
| Hero years on the navy band — paper/80 composited over navy (`#c9cbcd`) | **8.87:1** |
| Card years — neutral-500 on white | **5.43:1** |
| Band count · hero years on paper — neutral-500 on paper | **4.94:1** ← worst |

All ≥ 4.5:1. Orange is used only as rules and dots (2.80:1 on paper / 3.08:1 on white) — never as text, per D-1.02-1.

## 6. State updates done

- [x] `current-state.md` overwritten to match reality, incl. registers (**OV-6** + **OV-7** opened; open items 1 → 3; PL-1/PL-2 marked now-visible; known issues + built-pages updated)
- [x] `NEXT:` line set to: `Contact page (/kontakt) — phase id unassigned; the orchestrator owns the numbering · blocked on the Formspree endpoint (D-0.00-7 / handover §5). ⚠️ 2.05 was never formally closed (D-2.06-1)`
- [x] `file-map.md` synced — 3 routes, 4 components, 2 libs, + both Part-2 handovers registered
- [x] `00_stack-and-config.md` — **no entry needed**, no dependency added or upgraded

## 7. Risks, surprises, what the next phase needs to know

- **The repeated failure is now three-for-three, and it is structural.** D-2.03-1 (stale draft) → D-2.04-2 (absent section) → D-2.06-1 (absent file). Briefs keep being written against spec text the repo does not contain, and they cite decision IDs that were never logged. **The cheapest fix isn't in a code phase:** before a code brief is issued, check that the handover it names exists in `docs/design-handovers/` and that every decision ID it cites resolves in `decisions.md`. Both are grep-able in seconds.
- **The design was never seen.** No mockup was supplied, so these three routes were built from prose. Everything checks out structurally and on contrast, but „does this look right?" is unanswered — the exact question that killed V1. This deserves a real look before merge, not after.
- **The Кариера tiles and the `/statistika` tables share one content gap.** One published `careerStats` clears OV-7 *and* OV-4 at once, and is worth doing before ~74 seasons land at 2.09.
- **OV-6 is a quiet trap.** An editor opening Studio sees a populated „footer unofficial archive text" field that looks live and is not, and whose wording Ace never approved. It is one reasonable wiring-up away from shipping unverified copy on the site's central honesty claim.
- **The preview gate is open** and was already waived once (D-2.04-7). Two waivers in three phases would make it not a gate.
- **Eyeball checklist for Lazar (5 items, on the preview):**
  1. `/legendi` — **two** bands, not three (Раководство is correctly absent); Петар Андреев sits under Играчи with **both** chips.
  2. `/legendi` — the two trainer cards are solid navy **ГП / ИА** tiles; do they read as deliberate, or as broken images?
  3. `/legendi/petar-andreev` — portrait-left hero, real bio, season chip, photo. Is the 300px portrait too small against the display-size H1?
  4. `/legendi/goce-petrovski` — the navy **band** hero. Compare with the season page's navy band: do they read as one family?
  5. `/za-nas` — provisional banner + the OV-3 block + 4 placeholder chips, nothing invented. Confirm the wording matches what Ace approved.

## 8. What's now possible that wasn't before

The archive is navigable in both directions: a season now leads to its players and trainers, and a person leads back to their seasons — so `/statistika` and `/arhiva` stop being dead ends, and everything except `/kontakt` is wired.

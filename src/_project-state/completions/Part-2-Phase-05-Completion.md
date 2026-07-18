# Part 2 · Phase 05 · Design — Completion Report (BACK-FILLED at 2.09)

> ⚠️ **This report is a back-fill, filed at Phase 2.09 by orchestrator instruction — not by Phase 2.05 at the time.** Phase 2.05 (People & pages design) produced **no completion report and no decisions of its own** when it ran; its design output existed only as a handover file the owner held outside the repo. This report reconstructs the record from that handover and from the phases that consumed it (2.06, 2.07). It closes the documentation gap; it does not claim to be a contemporaneous account.

**Date:** 2026-07-18 (back-fill) · **Executor:** Claude Code (Phase 2.09, Lazar's machine) · **Outcome (one line):** the 2.05 design phase is formally closed on paper — its sole artifact (the People & Pages handover) is recorded as landed via 2.06, its three decisions are back-filled (D-2.05-1/-2/-3), and the nine conflicts 2.06 resolved against it are listed.

## 1. What shipped (plain language)

Phase 2.05 was a **design** phase for four routes — `/legendi`, `/legendi/<slug>`, `/za-nas`, `/kontakt`. Its **only artifact was a design handover**, `Part-2-Phase-05-Handover.md`. That file was never committed by 2.05; it reached the repo only when **Phase 2.06 escalated its absence** and Lazar supplied it in-session, at which point it was landed at `docs/design-handovers/Part-2-Phase-05-Handover.md` and built to (**D-2.06-1**). No code, no schema change, and no mockup were produced by 2.05 (the handover cites a mockup, `People & Pages.dc.html`, that was never supplied).

## 2. Definition of Done — verified-here vs owed-to-Lazar

2.05 issued no brief with a DoD in the repo, so there is no contemporaneous checklist to restate. What can be verified **now**, at back-fill:

**Verifiable by executor:**
- ✅ The 2.05 design artifact exists in the repo — evidence: `docs/design-handovers/Part-2-Phase-05-Handover.md` (landed via D-2.06-1).
- ✅ `D-2.05-1`, `D-2.05-2`, `D-2.05-3` now exist in `decisions.md`, marked back-filled — evidence: three entries appended 2026-07-18, each `Status: Accepted (back-filled at 2.09 …)`.
- ✅ The routes the handover designed are built and live — evidence: `/legendi`, `/legendi/<slug>`, `/za-nas` (2.06, PR #15, on production) and `/kontakt` (2.07, PR #17).
- ⚠️ The handover was built to with **nine documented conflicts** resolved the repo's way (§3 below) — the design was, strictly, followed in spirit, not to the letter, because it disagreed with `brand.md` / the merged 2.02 handover / the locked schema in nine places.

**Owed to Lazar (goes on the owed-verification register):**
- The **handover's visual mockup was never supplied**, so the four routes' visual design was never seen before build — the built pages are the first render of that design. Worth Lazar's eye against his intent (already noted in the 2.06 report §7).
- The **second Ace sit-down** (register „Remaining human steps" #5) still gates any About/Contact revision — the reason 2.05 marked those two routes provisional (D-2.05-1).

## 3. Decisions I made during this phase

The three decisions 2.05 **should have logged** are back-filled at 2.09 (not invented here — reconstructed from the handover prose + the 2.06/2.07 builds). Full entries with context/alternatives/downsides are in `decisions.md`; one line each:

| ID | Decision | Rejected alternative | logged |
|---|---|---|---|
| **D-2.05-1** | About + Contact ship **provisional** (in-page banner, placeholder chips) pending the second Ace sit-down; Legends is not provisional | Wait for the sit-down before designing them — blocks two nav routes indefinitely *(alternative inferred; the handover records none)* | yes (back-filled) |
| **D-2.05-2** | A multi-role person is placed in **exactly one** Legends band by priority **player > trainer > president**, showing all role chips; empty band self-omits | Duplicate the person into every band they qualify for — inflates counts, lists them 2–3× *(alternative inferred; handover records the rule, not the alternative)* | yes (back-filled) |
| **D-2.05-3** | Contact form = **Formspree** POST via env var, plain `fetch`, **no new dependency**, all four states built; account/endpoint out of scope | A form library, or a custom serverless endpoint — disproportionate / adds a backend *(alternatives inferred; handover records the approach, not the alternatives)* | yes (back-filled) |

> Per brief Task 9: where the handover does not itself record a rejected alternative, the entries say so explicitly rather than inventing one — the named alternatives are inferred from the design intent.

## 4. Deviations from the brief

There was no 2.05 brief in the repo to deviate from — that **is** the deviation this back-fill records. The design reached the repo out-of-band (D-2.06-1), and 2.05 left no decisions or report. The pattern is documented as structural in `current-state.md` §Known issues (D-2.03-1 stale draft → D-2.04-2 absent section → D-2.06-1 absent file — three in a row).

## 5. Changed files / deliverables

- **2.05's actual deliverable:** `docs/design-handovers/Part-2-Phase-05-Handover.md` — the People & Pages design spec (four routes + three new component specs: `LegendCard`, `RoleBandGrid`, `PersonHero`, `ContactForm`). Landed into the repo by 2.06 (D-2.06-1), not by 2.05.
- **This back-fill (at 2.09):** `decisions.md` — appended D-2.05-1/-2/-3; this report, `Part-2-Phase-05-Completion.md`.
- No code or schema was produced by 2.05.

## 6. The nine conflicts 2.06 resolved against the handover (per its own §0: „the repo wins")

Building to the handover surfaced nine conflicts with `brand.md` / the merged 2.02 handover / the locked schema. All were resolved the repo's way and logged under `D-2.06-*` (2.06 declined to back-fill 2.05's namespace at the time; that is done now for the three D-2.05 decisions above, but the *conflict* resolutions correctly stay in 2.06's namespace since 2.06 made them):

1. **D-2.06-1** — the handover was **absent from the repo**; supplied in-session and landed at `docs/design-handovers/Part-2-Phase-05-Handover.md`.
2. **D-2.06-2** — UI copy is **Macedonian** („Сезони" / „Фотографии" / „Сите легенди"), not the handover's **Serbian** („Сезоне" / „Фотографије" / „Све легенде").
3. **D-2.06-3** — „Сезони" reads `squad[]` **or** `trainers[]`, not the handover §3's literal `season.squad` alone (which would leave every trainer's Сезони empty).
4. **D-2.06-4** — `/za-nas`'s optional hero is **omitted permanently** — the locked model has no field to hold it (adding one is a forbidden schema change).
5. **D-2.06-5** — card-lift carries **no shadow** and the placeholder chip is **not amber** — neither has a `brand.md` token (§9 expects none).
6. **D-2.06-6** — Кариера **replicates** `BalanceSummary`'s tile language; the component itself is **not reused** (it takes a `ClubBalance`, out of scope to generalise).
7. **D-2.06-7** — a photoless `LegendCard` gets a **navy initials tile**, unlike `SeasonCard`'s greybox; also records that the handover's „D-2.02-2/3" citation is **wrong** (real rule: 2.02 §6.2b).
8. **D-2.06-8** — a missing `playingYears` placeholders **for players only**; trainers/officials omit the line (they have no playing years to be missing).
9. **D-2.06-9** — `/za-nas` renders the OV-3 copy from a new `src/lib/facts.ts`, **not** the divergent `siteSettings.footerUnofficialArchiveText` field (which holds unverified, never-rendered wording → **OV-6**).

Two further handover errors were noted but not counted among the nine resolutions: the field is called `roles[]` in handover §6.1 where the locked schema says **`role`**; and handover §3 claims „the demo people have none [no bio] yet" — **stale**, three published people have real `bio` blocks and Биографија renders (2.06 completion report §7).

## 7. Risks, surprises, what the next phase needs to know

- The **mockup was never supplied** — the design was built from prose alone, so the visual result is unvalidated against 2.05's intended visuals. Lazar should eyeball the four routes.
- The **provisional frame on About/Contact stands** until the second Ace sit-down; that meeting gates the About copy and any Contact/Legends revision (3.03).
- The **structural process gap** (briefs written against spec text the repo does not contain, citing decision IDs never logged) is called out in `current-state.md` §Known issues with the cheapest fix: before issuing a code brief, grep that its named handover exists and every decision ID it cites resolves.

## 8. What's now possible that wasn't before

The dangling references are closed: `D-2.05-1/-2/-3` now resolve in `decisions.md`, so the handover, the 2.06/2.07 builds, and `current-state.md` no longer cite decision IDs that exist nowhere — the 2.05 design phase is formally accounted for.

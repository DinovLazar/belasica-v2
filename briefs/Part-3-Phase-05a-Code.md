# Part 3 · Phase 05a · Code — Visual direction exploration: three homepages, owner picks

**Why this matters —** the owner is not satisfied with how the site looks, and audits keep scoring the craft high — so the problem is the *direction*, not the execution. This phase builds the same homepage three different ways, on real content, so the owner can point at one and say "that one." Phase 3.05 (Statistics + About + Legends redesign) is on hold until that pick is made — redesigning more pages on a direction the owner doesn't like would be waste.

## Context

- Read first, in this order: `CLAUDE.md` (repo rules — note the UI-phase skill duties), `brand.md` (current tokens and brand rules), `facts.md`, `src/_project-state/current-state.md` (what exists), `src/_project-state/00_stack-and-config.md` (pinned stack).
- The current homepage shipped at Phase 3.03 (seven-section flow: hero → story → legends marquee → records band → decade explore → moment photo → quick links + footer). It is technically clean (impeccable audit 18/20, all AA) but the owner finds the overall look unsatisfying. This phase does not judge 3.03 — it explores alternatives at the level 3.03 kept fixed.
- **Required first step:** invoke the `designing-and-coding-branded-web-ui` skill. Use its design mode to develop each direction below into a coherent visual system before building it; use its code mode while implementing. This is mandatory (CLAUDE.md §UI phases).
- Hard constraints that apply to all three variants: club identity stays blue/white with orange as the secondary accent (the navy/paper/orange family in `brand.md` — shade adjustments allowed per direction, documented); all content comes from the live Sanity dataset (content-truth rules fully apply — nothing invented, placeholders render as registered `[PLACEHOLDER]` chips); the site self-describes as an unofficial archive; Macedonian Cyrillic content, `lang="mk"`; orange is never body-text on light surfaces (D-1.02-1 stands in every direction).

## Scope

**In scope:** three complete homepage variants at three new routes, each a full restyle of the seven content zones plus a variant-local header and footer; a short comparison document; noindex on the three routes.

**Out of scope:** the existing homepage, season pages, `/arhiva`, `/legendi`, `/statistika`, and every shared component (build variant-local copies instead — the live site must be pixel-identical after this phase); `brand.md` (untouched — the winning direction's tokens land in a later phase); the Sanity schema and all Sanity content; navigation links to the new routes (they are reached by URL only); applying the winning direction anywhere.

## Tasks

1. Create three routes: `/predlog-a`, `/predlog-b`, `/predlog-c`, each rendering the full homepage content (same GROQ data as the live homepage) restyled per its direction below. Each route carries `robots: noindex` metadata. Variant-local components live under the variant's own folder; shared components are not modified.
2. Build **Direction A — „Спортски весник" (newsprint chronicle):** the archive as a digitized vintage sports newspaper. Paper-dominant surfaces; a masthead-style header; a denser editorial grid with hairline navy rules separating zones; a high-contrast serif display face for headlines (choose a Cyrillic-complete serif via `next/font`, verify Cyrillic coverage, log the choice as a decision); photos treated as print — black-and-white or navy duotone, thin frames, print-style captions; records rendered as box-score tables; orange strictly as small markers.
3. Build **Direction B — „Клупски музеј" (club museum):** navy-dominant and reverent. Deep-navy surfaces as museum walls; photos matted generously (scale up the existing matting motif) with soft spotlight treatment; paper-colored text on navy; records as large plaque-style numerals; orange as thin brass-like accent rules; a slower, grander vertical rhythm with more whitespace than the live site; full-bleed hero photo under a navy scrim.
4. Build **Direction C — „Трибина" (terrace modern):** a bold contemporary club identity. Oversized condensed Cyrillic display type (verify Cyrillic coverage, log the choice); strong navy/orange color blocking; crest-forward hero; scoreboard-style stat strips; tighter sections with more graphic energy; pronounced hover/focus states. Modern and loud, but still an archive — no fake "live" elements.
5. Within each direction, define the variant's tokens (colors, type scale, spacing feel) in that variant's own scope and use them consistently across all seven zones — each variant must read as one designed system, not a reskin of the live page.
6. Write `docs/design-handovers/Part-3-Phase-05a-Directions.md`: for each direction, one paragraph of intent, its token deltas vs `brand.md`, and what applying it site-wide would touch. Factual, no recommendation — the pick is the owner's.
7. Run `/impeccable audit` against all three routes. Fix P1s and P2s in-phase; log the tail.
8. Verify each route at 1280 and 375 (no horizontal scroll, AA contrast everywhere, one H1, heading order clean, images alt'd), run `npm run build` + `npm run lint`, then open PR `phase-3.05a-direction-exploration` → `main` and file the completion report.

## Definition of Done

- [ ] `/predlog-a`, `/predlog-b`, `/predlog-c` each render the full seven-zone homepage from live Sanity content, in three visibly divergent directions matching the recipes above.
- [ ] Live homepage and all existing pages byte-identical in rendering — no shared component or token changed; `brand.md` untouched.
- [ ] All three routes carry noindex metadata; no nav link points at them.
- [ ] Content-truth clean: nothing invented on any variant; placeholder chips render where facts are missing.
- [ ] `/impeccable audit` run on all three routes; P1/P2 fixed, remainder logged.
- [ ] Each route verified at 1280 + 375: no h-scroll, contrast ≥ AA, one H1, clean heading order, all images alt'd.
- [ ] `npm run build` and `npm run lint` clean.
- [ ] `docs/design-handovers/Part-3-Phase-05a-Directions.md` written (intent + token deltas + application cost per direction, no recommendation).
- [ ] Font choices and every on-the-fly decision logged in `src/_project-state/decisions.md` as `D-3.05a-n`.
- [ ] PR `phase-3.05a-direction-exploration` → `main` open, with the Vercel preview URL and the three `/predlog-*` links in the completion report, plus a 5-item eyeball checklist for Lazar (one item per: overall impression per variant at desktop, the same at mobile, and whether each still feels like FK Belasica).

## Outputs & where they go

- Three variant routes on the PR's Vercel preview (owed to Lazar: open all three at desktop and on a phone, pick a direction — A, B, C, or a named combination).
- `docs/design-handovers/Part-3-Phase-05a-Directions.md`.
- Completion report → `src/_project-state/completions/Part-3-Phase-05a-Completion.md`. Set the NEXT line to: `NEXT: 3.05 — Statistics + About + Legends redesign (blocked: owner direction pick from 3.05a; the 3.05 brief must bake the chosen direction in and include amending brand.md)`.

# CLAUDE.md — Belasica-V2

## What this is
The unofficial FK Belasica archive site (Macedonian, informational). Next.js + Sanity on Vercel. You are the executor; the current phase brief in `briefs/` is your instruction — read it first, every session.

## Machine & shell
- Two operators, both macOS: Lazar and Petar. Project path on both: `~/Projects/belasica-v2`.
- All commands in zsh syntax.
- Pull (`git pull`) before every session. Push/merge at the end of every session. No exceptions — two machines share this repo.

## Commands
- Install: `npm install` · Dev: `npm run dev` · Build: `npm run build` · Lint: `npm run lint`
- Run `npm run build` and `npm run lint` before every commit that closes a phase.
- (Phase 1.01 confirms these; if they differ after scaffold, update this section in the same PR.)

## Branch & PR rules
- Branch name: `phase-X.YY-<slug>`, cut from `main`.
- One phase branch at a time. Never cut a new phase branch while a previous one is unmerged.
- PR to `main`. This project has no automated review gate (dropped for this project — see `decisions.md` D-1.01-4); before merging, review the diff yourself and confirm the Vercel preview loads. Never resolve a blocking review comment by dismissing it — fix or escalate to the orchestrator via the completion report.

## Decisions
- Log every on-the-fly decision in `src/_project-state/decisions.md`, append-only.
- ID scheme: `D-<phase>-<n>` (e.g. `D-1.04-2`) — namespaced to your phase, assigned by you, sequential within the phase.
- Reversals get a new entry linking the old; change only the old entry's Status. Never edit history.
- Every decision you log also appears in §3 of your completion report.

## State duties (closing every phase)
- Overwrite the changed parts of `src/_project-state/current-state.md` — it is a snapshot, not a log. Set the first line: `NEXT: <phase id> — <name>`.
- Sync `src/_project-state/file-map.md` on every file add/rename/delete.
- Append to `src/_project-state/00_stack-and-config.md` with exact pinned versions whenever a dependency is added or upgraded. Never `latest`, never caret-only.
- File the completion report at `src/_project-state/completions/Part-X-Phase-YY-Completion.md`. A phase is not closed until the snapshot matches reality and the report is filed.

## Content truth (non-negotiable)
- Factual claims rendered on the site come only from `facts.md`, and only entries marked VERIFIED.
- Nothing invented: no fake names, dates, stats, counts, or links — not even to make a demo look complete.
- Missing fact → render visible `[PLACEHOLDER: what's needed]` and add it to the placeholder register in `current-state.md`.
- Template-propagated strings (season/person templates): verify the template's facts against `facts.md` once, before generation.
- The site always self-describes as an unofficial archive (footer + metadata). Never present it as the club's official site.

## Read before working
- Current phase brief: `briefs/` (matching `Part-X-Phase-YY-Code.md`) — your only instruction source.
- Design tokens: `brand.md` (only source — never hardcode a color, font, or spacing value).
- UI spec: `docs/design-handovers/` (the handover named in the brief). No UI code before reading it.
- Business facts: `facts.md` (only source).
- Live state: `src/_project-state/current-state.md`.
- Stack + pinned versions: `src/_project-state/00_stack-and-config.md` — read before adding any dependency.

## UI phases
- Before filing the completion report: render every affected page and verify against the handover and `brand.md`. Include the Vercel PR preview URL in the report, plus a 5-item eyeball checklist for Lazar.

## Copy phases
- Run a `humanizer` pass on all user-facing copy. Check every factual claim against `facts.md`. Macedonian copy only; `lang="mk"`.

# Part 3 · Phase 11 · Code — Book extraction data drop and season content fill

**Why this matters —** Аце's book is the only complete record of the club's 96 seasons, and until now none of it was in the repo. This phase lands that record as tracked data and ships the script that puts a story on every season page and a full result list on 95 of them, using fields that already exist.

## Context

Read first, in this order:

- `data/book/README.md` — provenance of the extraction, the accuracy check against the book's own summary table, and what was deliberately left unchanged.
- `data/book/extraction-report.md` — the Macedonian coverage report written for Аце.
- `src/_project-state/current-state.md` — live state; note the owed-verification register (OV-14, OV-15 are affected by this drop).
- `src/_project-state/decisions.md` — D-2.01-2 defers the `match` document type.
- `CLAUDE.md` — repo rules.
- `src/sanity/schemaTypes/season.ts` — `story` and `results` are existing `block[]` fields. **This phase adds no schema change.**
- `src/app/(site)/arhiva/[slug]/page.tsx` — renders `results` through `SeasonRecordList`; `export const revalidate = 60`, so no redeploy is needed for content to appear.

What already exists in the working tree, untracked, written by the Cowork session:

- `data/book/` — `README.md`, `seasons.json`, `matches.json`, `master-table.json`, `index.json`, `extraction-report.md`, `season-content.json`
- `scripts/fill-season-content.mjs`
- `.gitignore` — one added entry, `/.claude/worktrees/`
- `_to_delete/` — deleted; those eleven files were tracked cruft (git lock leftovers, temp objects, a token transfer temp file)

## Scope

**In scope**

- Commit the untracked `data/book/` drop, `scripts/fill-season-content.mjs`, the `.gitignore` entry and the `_to_delete/` removal.
- Push to `main`.
- Append the stack/config entry and sync the state files.
- Log the decisions this drop forces into the open.

**Out of scope — do not touch**

- `src/sanity/schemaTypes/` — no schema change, and specifically do **not** re-register `match` in `index.ts`. D-2.01-2 stands until the owner reopens it.
- Any component, route or style file.
- Running `scripts/fill-season-content.mjs --commit`. The content write is the owner's to trigger; this phase only ships the script.
- `facts.md` — the book is a source, not a replacement for it.
- Publishing or unpublishing anything in Sanity.

## Tasks

1. Verify the working tree matches what is described above: `data/book/` holds seven files, `scripts/fill-season-content.mjs` exists, `.gitignore` ends with the `/.claude/worktrees/` entry, `_to_delete/` is gone.
2. Confirm `node --check scripts/fill-season-content.mjs` passes and `node -e "JSON.parse(require('fs').readFileSync('data/book/season-content.json'))"` parses.
3. Run `npm run build` and `npm run lint`. Neither should change — this phase adds no code the app imports — but a clean run is the proof.
4. Run the script in dry-run mode: `node scripts/fill-season-content.mjs`. It must report 96 seasons processed and write `docs/ingestion/season-content-report.md`. Commit that report too.
5. Stage everything, including the `_to_delete/` deletions and the `.gitignore` change.
6. Commit with a message that states: 96 seasons, 2.267 matches, 2.563 result lines, 167 story paragraphs; no schema change; no Sanity write.
7. Push to `main`.
8. Append to `src/_project-state/00_stack-and-config.md`: `data/book/` is the tracked source drop from the book, and `scripts/fill-season-content.mjs` is a `setIfMissing`-only content filler that requires `SANITY_API_WRITE_TOKEN`.
9. Update `src/_project-state/current-state.md`: set the `NEXT:` line, add `data/book/` and the script to the snapshot, and record against OV-14 that the book's totals are now machine-read from source and reproduce exactly as `2275 · 1030–421–824 · 3907:2976 · 2885`.
10. Update `src/_project-state/file-map.md` with the seven new data files and the new script.
11. Append to `src/_project-state/decisions.md`, using the next free IDs:
    - The premise behind **D-2.01-2** is void. It deferred `match` because the P0.1 audit found no per-match source; the book is one, with 2.267 matches carrying result, opponent, competition and scorers with minutes. Record this as a superseding entry that does **not** reverse D-2.01-2 — reopening the content model stays an owner decision.
    - Player-name spellings are kept exactly as the book prints them; variants such as Пантазиев / Пандазиев are not merged. Consequence: derived scorer tallies group by the book's surname string.
    - Only competition and club-name typos were corrected (`Вотра`→`Втора`, `11 Октмври`→`11 Октомври`, `Кумананово`→`Куманово`), reversible because every match and squad row carries `sourceLine`.
    - `results` for `1926-1930` is assembled from the book's sentences rather than copied from a printed list, and `1922-26` and `1936-37` carry a note instead of results because the book prints none.
12. Open a PR from the phase branch, let the GitHub Action review it, and merge only after the review is clean.

## Definition of Done

Verifiable by you:

- [ ] `git status` is clean on `main` after the push, with no `.git/index.lock` left behind.
- [ ] `data/book/` contains exactly seven files and all five `.json` files parse.
- [ ] `scripts/fill-season-content.mjs` passes `node --check`.
- [ ] `npm run build` and `npm run lint` both pass.
- [ ] `node scripts/fill-season-content.mjs` (dry run) exits 0, reports 96 seasons, and writes `docs/ingestion/season-content-report.md`; the report shows 96 seasons receiving a story and 95 receiving results, with `2025-26` the only one at "нема".
- [ ] `git diff --stat HEAD~1` shows no file under `src/` other than `src/_project-state/`.
- [ ] `src/sanity/schemaTypes/index.ts` is byte-identical to its state before this phase.
- [ ] `_to_delete/` no longer exists in the tree or in `git ls-files`.
- [ ] `.gitignore` contains `/.claude/worktrees/` and `git ls-files .claude/worktrees` returns nothing.
- [ ] The four state files are updated and the four decision entries exist with sequential IDs.
- [ ] The PR is merged after a clean Action review.

Owed to Lazar:

- [ ] Native read of `data/book/README.md` and `data/book/extraction-report.md` by Lazar and Аце.
- [ ] Аце's confirmation of the four seasons where the extracted match count differs from the book's own table (1950, 1950/51, 1954/55, 1987/88) — expected cause is cup and qualification ties counted in the text but not the table.
- [ ] Аце's approval of the twelve assembled result lines for `1926-1930` and the two explanatory notes on `1922-26` and `1936-37`.
- [ ] Owner decision on D-2.01-2, now that a per-match source exists.

## Outputs & where they go

- Commit and push on `main` via a reviewed PR from branch `phase-3.11-book-data-drop`.
- Dry-run report → `docs/ingestion/season-content-report.md`
- Completion report → `src/_project-state/completions/Part-3-Phase-11-Completion.md`

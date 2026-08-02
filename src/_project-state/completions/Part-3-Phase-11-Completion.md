# Part 3 · Phase 11 · Code — Book extraction data drop and season content fill

**Date:** 2026-08-02 · **Executor:** Claude Code (Opus 5) on Lazar's machine · **Outcome (one line):** Аце's book is tracked in the repo as seven data files, and the script that would put a story on every season page and a result list on 95 of them ships written, verified and deliberately unfired.

## 1. What shipped (plain language)

The whole season part of Аце's book is now in the repo as data — 96 seasons, 2.267 matches, 2.683 scorer records, 28.504 words of narrative — with every match and squad row carrying `sourceLine`, the book's original line verbatim, so nothing in it is unauditable. Alongside it ships `scripts/fill-season-content.mjs`, which fills the two fields the season page already renders (`story` and `results`) using only `setIfMissing`, so it can never overwrite content that already exists. **The script was not run for real.** Its dry run says what a real run would do: 30 seasons gain a story, 85 gain results, and nothing already published is touched. Pressing that button is yours.

This phase ships **no application code**. Not one file under `src/` outside `src/_project-state/` was touched, the schema is byte-identical, and no Sanity write was made.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ **`git status` is clean on `main` after the push, with no `.git/index.lock` left behind** — evidence: `ls .git/index.lock` → "no index.lock" before work began and after; final `git status` clean. ⚠️ Read with D-3.11-5: the landing path is a **reviewed PR from `phase-3.11-book-data-drop`**, which is what the brief's own "Outputs" section specifies, not a direct push to `main`.
- ✅ **`data/book/` contains exactly seven files and all five `.json` files parse** — evidence: `ls -1 data/book | wc -l` → `7`; each of `seasons/matches/master-table/index/season-content.json` parsed with `JSON.parse` in Node, all five OK.
- ✅ **`scripts/fill-season-content.mjs` passes `node --check`** — evidence: `node --check scripts/fill-season-content.mjs` → exit 0.
- ✅ **`npm run build` and `npm run lint` both pass** — evidence: build `✓ Generating static pages (271/271)`, **page count unchanged from 3.10**; `npm run lint` exit 0 with no output; `npx tsc --noEmit` also clean (not required, run anyway). ⚠️ The **first** build died on the known `WasmHash` webpack-cache flake; `rm -rf .next/cache` + rebuild passed — an environment flake, not a code fault, now confirmed reproducible across phases (see §7).
- ✅ **`node scripts/fill-season-content.mjs` (dry run) exits 0, reports 96 seasons, and writes `docs/ingestion/season-content-report.md`** — evidence: `Проба: 86 од 96 сезони.` / `Извештај: docs/ingestion/season-content-report.md`, exit code 0; report header reads `Сезони обработени: 96, променети: 86`; 96 table rows counted.
- ✅ **The report shows 96 seasons receiving a story and 95 receiving results, with `2025-26` the only one at "нема"** — evidence: tallied from the report's own columns. **Story: 66 `постои, недопрено` + 30 new = 96.** **Results: 10 `постои, недопрено` + 85 new = 95**, and exactly one row reads `нема во книгата` — `2025-26`. The already-present counts are the earlier content phases showing through (66 stories from 3.02-Story, 10 results from 3.04 — the skipped ten are precisely `1930-31 … 1940-41`), so "receiving" here means *ends up with*, which is the only reading under which the numbers are reachable at all.
- ✅ **`git diff --stat HEAD~1` shows no file under `src/` other than `src/_project-state/`** — evidence: the data commit `b415dac` touches only `briefs/`, `data/book/`, `docs/ingestion/`, `scripts/`; the state commit touches only `src/_project-state/`. Verified across the **whole branch** rather than one commit: `git diff --stat main...HEAD -- src/` lists `src/_project-state/` files only.
- ✅ **`src/sanity/schemaTypes/index.ts` is byte-identical to its state before this phase** — evidence: `git diff main...HEAD -- src/sanity/` is empty; `git status --short src/sanity/` is empty. `match` remains unregistered.
- ✅ **`_to_delete/` no longer exists in the tree or in `git ls-files`** — evidence: `ls -d _to_delete` → gone; `git ls-files _to_delete` → empty. Removed in `7ef3547`, not by this phase's commits (D-3.11-5).
- ✅ **`.gitignore` contains `/.claude/worktrees/` and `git ls-files .claude/worktrees` returns nothing** — evidence: `tail .gitignore` shows the entry under its comment; `git ls-files .claude/worktrees` → empty.
- ✅ **The four state files are updated and the decision entries exist with sequential IDs** — evidence: `grep -c "^### D-3.11" decisions.md` → **6** (the brief specified four; two more record brief/repo mismatches, per CLAUDE.md's "log every on-the-fly decision"), IDs `D-3.11-1 … D-3.11-6`. `current-state.md`, `file-map.md` and `00_stack-and-config.md` all updated; `NEXT:` set.
- ❌ **The PR is merged after a clean Action review** — **not done, and not doable: there is no Action.** `.github/` does not exist in the repo or in `git ls-files`; `file-map.md` lists `.github/workflows/` under "Not present (deliberately)"; **D-1.01-4** dropped the review gate for this project by owner instruction. CLAUDE.md prescribes the replacement and that is what ran: the full diff was self-reviewed and the Vercel preview confirmed to load. Reported unmet rather than ticked (D-3.11-6).

**Owed to Lazar (goes on the owed-verification register):**

- **Native read of `data/book/README.md` and `data/book/extraction-report.md` by Lazar and Аце** — both are in Macedonian and written for Аце. Nothing in this phase can substitute for Аце recognising his own book in them. *(Register item 16.)*
- **Аце's confirmation of the four seasons where the extracted match count differs from the book's own table** — `1950` (16 vs 12), `1950/51` (10 vs 14), `1954/55` (25 vs 21), `1987/88` (38 vs 34). Expected cause is cup and qualification ties counted in the text but not the table; `1950` + `1950/51` reconcile exactly at 26 = 26 taken together. 92 of 96 seasons already agree within ±2. *(Register item 17.)*
- **Аце's approval of the twelve assembled result lines for `1926-1930` and the two explanatory notes on `1922-26` and `1936-37`** — the only three seasons whose `results` are not copied from a printed list. **These are extracted-but-unverified, and a `--commit` run would publish them.** *(Register item 18, D-3.11-4.)*
- **Owner decision on D-2.01-2, now that a per-match source exists** — reopen `match` or leave it deferred. Nothing was changed either way. *(Register item 19, D-3.11-1.)*
- **The `--commit` run itself** — the brief puts it out of scope and it stayed out. *(Register item 20.)*

**5-item eyeball checklist for Lazar (10 minutes):**

1. Open `data/book/extraction-report.md` and read the coverage table with Аце — does the shape of the archive match what he wrote?
2. Open `docs/ingestion/season-content-report.md` and scan the **"Потекло на резултатите"** column. Every row should say `печатена листа во книгата` except four — `1926-1930` (склопено), `1922-26` and `1936-37` (белешка), `2025-26` (нема).
3. Spot-check one season in `data/book/seasons.json` against the printed book — pick one you know well, e.g. `1982-83`, and check a match's `sourceLine` against the page.
4. Confirm the site is untouched: the Vercel preview should be **identical** to production — this phase renders nothing new.
5. Decide whether you want a pilot `--commit` run on one season (`--only 1963-64`) before the full one.

## 3. Decisions I made during this phase

All six are logged in `decisions.md`.

- **D-3.11-1 · D-2.01-2's premise is void; the decision still stands** — the book **is** the per-match source D-2.01-2 said did not exist (2.267 matches with result, opponent, competition, scorers with minutes). Recorded the fact and changed nothing. **Alternative rejected:** re-registering `match` now that its blocker is gone — D-2.01-2 itself called that "its own phase", and doing it inside a data commit would smuggle a content-model decision past the owner. Also rejected marking D-2.01-2 `Superseded`, which would read as though `match` were back. **Logged: yes.**
- **D-3.11-2 · Player names kept exactly as the book prints them** — Пантазиев/Пандазиев and friends are not merged. **Alternative rejected:** merging obvious variants — it asserts an identity the source does not, and it is irreversible once the original string is gone. **Downside accepted:** scorer tallies group by surname string, so distinct players sharing a surname across eras collapse into one. **Logged: yes.**
- **D-3.11-3 · Only three competition/club-name typos corrected** — `Вотра`→`Втора`, `11 Октмври`→`11 Октомври`, `Кумананово`→`Куманово`, all reversible via `sourceLine`. **Alternative rejected:** a general spell-pass, which is exactly how invented facts get in. **Logged: yes.**
- **D-3.11-4 · Three seasons' `results` are not copied lists** — `1926-1930` assembled from sentences; `1922-26` and `1936-37` carry a note. Made machine-readable via `resultsProvenance` rather than left in prose. **Alternative rejected:** assembling silently like the other 92, which would present a machine's reading as a printed list. **Logged: yes.**
- **D-3.11-5 · Most of the drop was already on `main`; refused to rewrite it** — see §4. **Logged: yes.**
- **D-3.11-6 · No GitHub Action exists; CLAUDE.md's self-review ran instead** — see §4. **Logged: yes.**

## 4. Deviations from the brief

Two, both because the brief was written against a repo state that no longer holds. Neither is a code fault and both are flagged for the orchestrator.

1. **The drop was not untracked (D-3.11-5).** The brief's Context and Tasks 5–7 describe `data/book/`, the `.gitignore` entry and the `_to_delete/` removal as sitting untracked, to be staged and committed here. They were already committed **and pushed** as `7ef3547` by the Cowork session before this session opened. Only `season-content.json`, `scripts/fill-season-content.mjs` and the brief itself remained. **I committed the genuine remainder and left `7ef3547` alone** — rewriting a commit already on a `main` that two machines pull from (CLAUDE.md §Machine & shell) would strand Petar's checkout to make a log tidier. Consequence: this phase's commit is **3.974 insertions**, not the ~180.000 the brief implies, and `git diff --stat HEAD~1` sees only half the drop. Every DoD item that describes the **result** was verified against the tree instead of the diff, and all of them hold.
2. **There is no GitHub Action (D-3.11-6).** Task 12 and the last DoD line assume one. `.github/` does not exist; D-1.01-4 dropped the review gate by owner instruction; `file-map.md` already listed it under "Not present (deliberately)". CLAUDE.md's standing rule — "review the diff yourself and confirm the Vercel preview loads" — is what ran. Reported as ❌ rather than quietly ticked. **This is the third phase to hit a brief written against a review gate this repo has not had since 1.01** (cf. D-3.10-9); worth fixing in the brief template, not in the repo.

Beyond these: the brief asked for four decision entries and got **six**, the two extra being the deviations above. Nothing in scope was skipped, and nothing out of scope was touched — no schema change, no `match` re-registration, no `--commit` run, no `facts.md` edit, no Sanity publish.

## 5. Changed files / deliverables

Branch `phase-3.11-book-data-drop` → `main`. Two commits.

**Commit 1 — `b415dac` (data drop, 3.974 insertions):**
- `data/book/season-content.json` — **added**; per-season `story` + `results` + `resultsProvenance`. 96 seasons · 2.563 result lines · 167 story paragraphs.
- `scripts/fill-season-content.mjs` — **added**; `setIfMissing`-only filler, dry-run by default.
- `docs/ingestion/season-content-report.md` — **added**; the committed dry-run report.
- `briefs/Part-3-Phase-11-Code.md` — **added**; this phase's brief, filed.

**Commit 2 — state:**
- `src/_project-state/current-state.md` — `NEXT:` line, new 3.11 summary bullet, new "Tracked data & scripts" section, OV-14 and OV-15 updated, human-step 14 corrected, items 16–20 added.
- `src/_project-state/decisions.md` — `D-3.11-1 … D-3.11-6` appended.
- `src/_project-state/file-map.md` — `data/book/` (7 files), the script, the report, the `.gitignore` entry; the `_to_delete/` section flipped to resolved with the token stray still flagged.
- `src/_project-state/00_stack-and-config.md` — 3.11 entry appended.
- `src/_project-state/completions/Part-3-Phase-11-Completion.md` — this report.

**Already on `main` before this phase** (commit `7ef3547`, not authored here): the other six `data/book/` files, the `_to_delete/` removal, the `.gitignore` entry.

**Secrets:** none touched, none printed. `SANITY_API_WRITE_TOKEN` is read by the script from the environment or `.env.local` and is required **only** with `--commit`; it was never needed because no `--commit` run was made.

## 6. State updates done

- [x] `current-state.md` overwritten to match reality, incl. registers (OV-14 half-verified, OV-15 given a third voice, human steps 14 + 16–20)
- [x] `NEXT:` line set to: `3.08 — Domain cutover to www.belasicahistory.mk`
- [x] `file-map.md` synced
- [x] `00_stack-and-config.md` appended — **no dependency added, upgraded or removed**; `package.json` and the lockfile are byte-identical to `main`. Appended anyway to record `data/book/` as a tracked source drop and the script's token contract, as the brief requires.

## 7. Risks, surprises, what the next phase needs to know

- **The biggest risk in this phase is a button, not a bug.** `scripts/fill-season-content.mjs --commit` would write to production Sanity across 86 seasons. It is `setIfMissing`-only and idempotent, so it cannot destroy anything — but **it would publish the fourteen unverified lines from D-3.11-4** (twelve assembled for `1926-1930`, two notes) onto the live site. Settle register items 17–18 with Аце first, or pilot with `--only`.
- **The site renders `results` already, and ISR means no redeploy.** `arhiva/[slug]/page.tsx` runs `revalidate = 60` and pipes `results` through `SeasonRecordList`. The moment a `--commit` run lands, 85 season pages gain a results section by themselves — the same way 3.04's ten appeared. **Nobody needs to deploy, and nobody will get a warning.**
- **The `WasmHash` build flake is now confirmed reproducible across phases**, not a one-off of 3.09. First `npm run build` of the session died with `TypeError: Cannot read properties of undefined (reading 'length')` at `WasmHash._updateWithBuffer` before compiling anything; `rm -rf .next/cache` (**not** all of `.next`) and a rebuild passed. Its log is ~2 MB because webpack dumps its minified bundle into the stack trace — filter with `awk 'length($0) < 300'` before reading, or you will scroll through a megabyte of minified JS.
- **The brief template is drifting from the repo.** Two of this phase's DoD items were unachievable as written, and one of them (the review Action) is the second occurrence in two phases. A brief that assumes a gate removed at 1.01 will keep producing ❌ items that look like failures and are not.
- **`data/book/matches.json` is a loaded gun in the nicest sense.** 2.267 matches with scorers and minutes now sit in the repo with nothing able to read them. Whoever picks up the `match` decision should know the data is already shaped for it — and that the extraction's own match count (2.267) is a *third* independent figure alongside the book's table (2.275) and the spreadsheet (2.265).
- **Nothing here is verified content yet.** The drop is a **source**, not a replacement for `facts.md`, and no fact from it has been promoted. The content-truth rule is unchanged: only VERIFIED `facts.md` entries reach the site.

## 8. What's now possible that wasn't before

Every season page can carry the club's own history — a story on all 96 and a result list on 95 — from one command, whenever Аце says the three unverified seasons are right.

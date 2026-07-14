# decisions.md — Belasica-V2 (APPEND-ONLY)

> Location in repo: `src/_project-state/decisions.md`. One decision per entry; append, never rewrite. Reversals: change only the old entry's **Status** to `Superseded by D-x.xx-n` and add a new entry linking it. ID scheme is **phase-namespaced**: `D-<phase>-<n>`, assigned by the executor within its own phase (collision-proof across branches by construction). Planning-stage decisions are namespaced `D-0.00-n`. Every entry names the alternative rejected and the downside accepted — no alternative + no downside = assertion, not decision.

### D-0.00-1 · 2026-07-14 · Three-part project structure
- **Status:** Accepted
- **Context:** Project size call at intake. Content volume (decades of Drive material) is unmeasured.
- **Decision:** Three parts — Foundation → Content & pages → Polish & cutover — so ingestion is sized and gated separately.
- **Alternatives considered:** Two-part (build → integrate+deploy) — rejected: buries the ingestion unknown inside a build part.
- **Consequences:** More phase overhead and gates; safer sequencing. Owner confirmed at intake.
- **Links:** Phase-Plan.

### D-0.00-2 · 2026-07-14 · Claude Design owns all visuals (replaces Google Stitch)
- **Status:** Accepted (owner decision)
- **Context:** V1 died on design quality using Google Stitch; design is the stated top priority for V2.
- **Decision:** Claude Design produces all visual direction, tokens, and specs; sketch-first in chat; no UI phase closes sight-unseen; Ace demo gate at 1.06.
- **Alternatives considered:** Keep Stitch (rejected — proven failure here); no design tool, code-first styling (rejected — same template-look risk).
- **Consequences:** Design phases add sequencing time before code phases; that time is the insurance premium.
- **Links:** Phases 1.02, 1.06, 2.02, 2.05.

### D-0.00-3 · 2026-07-14 · Shared local path and shell on both machines
- **Status:** Accepted
- **Decision:** `~/Projects/belasica-v2` on both Macs; all briefs in zsh; pull before every session, push/merge after.
- **Context:** Two operators (Lazar, Petar) run Claude Code on the same repo.
- **Alternatives considered:** Per-machine paths — rejected: every brief would need two variants.
- **Consequences:** Briefs are machine-agnostic; discipline burden on both operators. Collision protection comes from this + one-branch-at-a-time.
- **Links:** CLAUDE.md.

### D-0.00-4 · 2026-07-14 · Latin-transliterated URL slugs, Cyrillic content
- **Status:** Accepted
- **Context:** Macedonian-only site; URLs must be shareable and citable (researchers/journalists audience).
- **Decision:** Slugs like `/arhiva/1985-86`; all rendered content Cyrillic.
- **Alternatives considered:** Cyrillic URLs — rejected: percent-encoding makes shared/pasted links unreadable and fragile in some tools.
- **Consequences:** URL script differs from page script. Reversible before Part 2 at low cost; expensive after ingestion.
- **Links:** Plan §4.

### D-0.00-5 · 2026-07-14 · Statistics as static pre-computed tables, sortable client-side
- **Status:** Accepted
- **Context:** Stats page approach not specified by owner.
- **Decision:** Aggregates computed from Sanity at build time; rendered static; sorted in the browser.
- **Alternatives considered:** Interactive database-driven stats — rejected: server cost/complexity for content that changes rarely, and a Lighthouse risk.
- **Consequences:** Stats update requires a re-publish. Acceptable for a historical archive.
- **Links:** Phase 2.04.

### D-0.00-6 · 2026-07-14 · Vercel connected at scaffold (1.01) with PR preview deploys
- **Status:** Accepted
- **Context:** "UI ships seen" rule needs a mechanism a non-coder can use.
- **Decision:** Connect Vercel in 1.01; every PR gets a preview URL; those URLs are Lazar's eyeball mechanism and the 1.06 Ace demo venue.
- **Alternatives considered:** Deploy at end of Part 2 — rejected: no way to see UI phases until too late (the V1 failure pattern).
- **Consequences:** $20/mo starts at scaffold rather than launch.
- **Links:** Phases 1.01, 1.05, 1.06.

### D-0.00-7 · 2026-07-14 · Formspree wiring deferred to 3.03
- **Status:** Accepted
- **Context:** Contact form destination email doesn't exist yet (deferred by owner at intake).
- **Decision:** Contact page ships as a shell with a registered placeholder; Formspree wired and tested in 3.03 when the email exists.
- **Alternatives considered:** Wire now to Lazar's personal email — rejected: personal accounts where the client's belong violates content-truth rules.
- **Consequences:** Contact form untestable end-to-end until Part 3.
- **Links:** Phases 2.07, 3.03; facts.md.

### D-0.00-8 · 2026-07-14 · Demo homepage in Part 1 (Ace sit-down gate)
- **Status:** Accepted (owner decision)
- **Context:** Lazar needs something real to show Ace after Part 1; design direction must be validated before Part 2 builds on it.
- **Decision:** Part 1 extended with 1.04 demo slice (one season, 2–3 legends, ~10 photos, loaded by Lazar via Studio), 1.05 homepage preview on a Vercel URL, 1.06 verification + Ace demo. Part 2's homepage phase becomes finalization (2.08).
- **Alternatives considered:** Show static mockups only — rejected: mockups don't prove the rendered site, and V1's lesson is that rendered quality is the risk.
- **Consequences:** Part 1 is longer; direction errors get caught while cheap. Demo uses only Ace-owned photos if P0.2 unresolved.
- **Links:** Phases 1.04–1.06, 2.08.

### D-0.00-9 · 2026-07-14 · Decision log location and ID scheme
- **Status:** Accepted
- **Context:** House skill default is sequential `D-001` in a root Decisions.md; this project runs parallel-risk-averse phase branches.
- **Decision:** Log lives at `src/_project-state/decisions.md` with phase-namespaced IDs `D-<phase>-<n>` per the Master Prompt (collision-proof across branches).
- **Alternatives considered:** Sequential global IDs — rejected: two branches can mint the same next number (this cost a reconciliation phase on a previous project).
- **Consequences:** IDs don't show global order; the date does.
- **Links:** CLAUDE.md §Decisions.

### D-0.00-10 · 2026-07-14 · Review Action authenticates with a subscription OAuth token, not an API key
- **Status:** Superseded by D-1.01-4 (the review Action was dropped entirely for this project by owner decision; no token is used)
- **Context:** The Claude Code GitHub Action is Part 1's hard gate and runs on every PR for the life of the project. It accepts either `ANTHROPIC_API_KEY` (metered, billed per use from Console credits) or `CLAUDE_CODE_OAUTH_TOKEN` (generated by `claude setup-token`, draws on an existing Claude Pro/Max subscription).
- **Decision:** Use `CLAUDE_CODE_OAUTH_TOKEN`, stored as a GitHub repository secret.
- **Alternatives considered:** `ANTHROPIC_API_KEY` — rejected: it opens a second recurring cost line, and the project's stated cost ceiling is hosting only. Workload Identity Federation — rejected: requires Anthropic org admin and Console configuration; disproportionate for a one-operator archive site.
- **Consequences:** Reviews consume Lazar's Claude subscription usage rather than separate credits. The token can expire — if reviews silently stop posting, regenerating it with `claude setup-token` and re-setting the secret is the first thing to check. Requires Pro or Max; if the token cannot be generated, the API-key path returns as an owner-level cost decision.
- **Links:** Phase 1.01; `.github/workflows/claude-review.yml`.

### D-0.00-11 · 2026-07-14 · Branch protection tuned for a solo operator
- **Status:** Accepted
- **Context:** GitHub will not let anyone approve their own pull request. Lazar is the only active committer, so the conventional "require 1 approving review" rule would lock him out of his own repository. The project's review gate is the automated Action, not a human approval count.
- **Decision:** Protect `main` with: pull request required, `required_approving_review_count: 0`, `required_conversation_resolution: true`, force pushes and deletions blocked, `enforce_admins: false`.
- **Alternatives considered:** Require 1 approval and add a second account — rejected: ceremony with no reviewer behind it. `enforce_admins: true` — rejected: a non-coding solo operator with no escape hatch is a worse failure mode than the bypass risk. Required status checks on the review job — deferred: the check has never run on a repo that does not exist yet; can be added once the Action has a track record.
- **Consequences:** Lazar can technically bypass protection as an admin; the rule is enforced by discipline plus `CLAUDE.md`, with the platform blocking the destructive cases. `required_conversation_resolution` means every review comment must be explicitly resolved before merge — deliberate friction, since it is the mechanism that forces the review to actually be read.
- **Links:** Phase 1.01; CLAUDE.md §Branch & PR rules.

### D-1.01-1 · 2026-07-14 · Next.js pinned to 15.5.20, not the create-next-app default of 16
- **Status:** Accepted
- **Context:** `create-next-app@latest` now scaffolds Next.js 16.2.10. The brief, the stack table, and the Definition of Done all specify Next.js 15.x. The brief's Tailwind precedent says to conform to the specified major version if it is cleanly attainable, and only deviate (recorded) if it is not.
- **Decision:** Pin `next` and `eslint-config-next` to 15.5.20 (latest stable 15.x). Consequently the Next-16-generated `eslint.config.mjs` was replaced with the Next 15 `FlatCompat` flat config, and `@eslint/eslintrc` was added as a direct devDependency.
- **Alternatives considered:** Accept Next 16 and record a deviation — rejected: fails the explicit "Next.js 15.x" DoD item, contradicts the stated stack, and later phase briefs were written against 15; a brand-new major with unknown later-phase compatibility outweighs "latest".
- **Consequences:** Downside accepted: the project sits one major version behind newest Next, deferring a future 16 upgrade. Build and lint verified green on 15.5.20.
- **Links:** Phase 1.01; `package.json`; `eslint.config.mjs`; 00_stack-and-config.md.

### D-1.01-2 · 2026-07-14 · shadcn/ui initialized with CLI 3.8.5 (neutral base color), not latest 4.13.0
- **Status:** Accepted
- **Context:** The brief requires initializing shadcn with a `neutral`, least-opinionated base color, defers all real color to Phase 1.02, and forbids any design decision this phase. The current shadcn CLI (4.13.0) replaced the classic `--base-color` flag with a mandatory theme-preset picker (Nova/Vega/Maia/…), each an opinionated colour+font theme.
- **Decision:** Initialize with `npx shadcn@3.8.5 init -b neutral` (last stable line with the classic neutral base-color flow and Tailwind 4 support); pin `shadcn` in devDependencies to 3.8.5 for consistent future `shadcn add`.
- **Alternatives considered:** shadcn 4.13.0 with a preset — rejected: choosing a named visual theme is exactly the design decision the brief assigns to 1.02 and would seed non-neutral colours. Skip shadcn and hand-write `cn` — rejected: brief requires shadcn/ui initialized with `components.json`.
- **Consequences:** Downside accepted: the project uses an older shadcn CLI than latest, and later phases must call `shadcn@3.8.5` (or upgrade deliberately). Base tokens in `globals.css` are shadcn neutral placeholders, to be overwritten from brand.md in 1.02.
- **Links:** Phase 1.01; `components.json`; `src/app/globals.css`; brand.md.

### D-1.01-3 · 2026-07-14 · Phase 1.01 brief not filed in briefs/ (owner instruction)
- **Status:** Accepted (owner decision)
- **Context:** CLAUDE.md and the brief (Task 5b) require every phase brief to be saved in `briefs/` as versioned instruction history. When asked for the brief file path, the owner instructed to skip filing it.
- **Decision:** Do not file `briefs/Part-1-Phase-01-Code.md`. Keep the `briefs/` folder (a `.gitkeep` placeholder) so the structure referenced by file-map.md still exists for future phases.
- **Alternatives considered:** Reconstruct the brief from the pasted conversation text and file it — rejected per owner instruction. Ask again / block — rejected: the owner was explicit.
- **Consequences:** Downside accepted: this phase's instruction history is not preserved in-repo; it exists only in the owner's own records. Future phases should still file their briefs unless told otherwise.
- **Links:** Phase 1.01; CLAUDE.md §Read before working; file-map.md.

### D-1.01-4 · 2026-07-14 · Claude Code GitHub Action review gate dropped for this project (owner instruction)
- **Status:** Accepted (owner decision) — supersedes D-0.00-10
- **Context:** The brief makes the automated Claude review the hard gate for all of Part 1 — the only review a solo operator's PRs can get — and every later phase brief assumes it exists. The owner instructed to fully skip it and not set one up for this project.
- **Decision:** Do not install the Claude GitHub App, do not create `.github/workflows/claude-review.yml`, and do not generate/store `CLAUDE_CODE_OAUTH_TOKEN`. Branch protection (PR-required, conversation-resolution) is retained; the Vercel PR preview remains the one surviving automated safety rail.
- **Alternatives considered:** Install the review Action as specified — rejected per owner instruction. Substitute a lighter CI lint/build gate — not requested; can be added later if wanted.
- **Consequences:** Downside accepted: PRs merge with no automated review; the owner is sole reviewer of his own work — the exact risk the brief's gate covered. The Part-1 "a review posts before close" DoD item is waived by owner decision, not met. Re-enabling later means installing the App, adding the workflow, and setting the token secret.
- **Links:** Phase 1.01; supersedes D-0.00-10; CLAUDE.md §Branch & PR rules.

### D-1.01-5 · 2026-07-14 · Vercel Deployment Protection disabled so preview URLs are public
- **Status:** Accepted (owner decision)
- **Context:** Vercel protects preview deployments by default (Vercel Authentication), so preview URLs 302-redirect to a login wall. The plan (D-0.00-6) makes preview URLs Lazar's eyeball mechanism and the venue for the 1.06 Ace demo, where the viewer has no Vercel account; the DoD also requires the preview URL to return 200.
- **Decision:** Disable Vercel Authentication for the project so preview (and production) URLs are publicly reachable and return 200.
- **Alternatives considered:** Keep protection on — rejected: previews would be unshareable (Ace demo blocked) and the 200 gate only met behind auth. Password protection — rejected: adds friction for a public, no-secrets archive.
- **Consequences:** Downside accepted: every preview deployment is world-readable. Acceptable because the repo is public and the content is an informational archive with no secrets. Preview URL verified 200 after the change.
- **Links:** Phase 1.01; D-0.00-6; Vercel project settings → Deployment Protection.

### D-0.00-12 · 2026-07-14 · Club colors confirmed (P0.3 resolved) — blue + white identity, orange accent
- **Status:** Accepted (owner decision)
- **Context:** P0.3 (club colors + crest source collection) was the open gate on Phase 1.02. Colors were collected and sampled into an approved direction in brand.md; exact-colour confirmation from a clean high-res crest was still owed. Owner now confirms the club colors are known.
- **Decision:** Lock the club palette as the design foundation — Blue/Navy `#12294F` and white (Paper `#F7F4EC`) as the club identity, Orange `#E4741C` as the secondary/away accent (used sparingly). These are the values already carried in `brand.md` §Color.
- **Alternatives considered:** Keep P0.3 open pending a cleaner high-res crest sample — rejected: the colors are known well enough to unblock Design, and the direction is already locked in brand.md.
- **Consequences:** The P0.3 gate on Phase 1.02 is cleared. Downside accepted: if a future clean high-res crest yields materially different hexes, brand.md values get refined and this entry is superseded. Source note: values read from `brand.md` (working copy); the 1.02 handover file was never written to disk and the 1.01 completion report contains no colors.
- **Links:** P0.3; Phase 1.02; brand.md §Color; current-state.md (P0.3 gate on 1.02).

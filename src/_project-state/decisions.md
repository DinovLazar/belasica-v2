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
- **Status:** Accepted
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

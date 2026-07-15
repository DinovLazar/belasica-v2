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

### D-1.03-1 · 2026-07-14 · Orange stays non-text in the shell; header active label is Paper, not navy
- **Status:** Accepted
- **Context:** The handover locks D-1.02-1 (orange never carries text on paper — 2.8:1 fails AA) but its component notes also read "active nav label stays navy" and describe "orange overline" strings. On the **navy** header bar a navy label is invisible, and an orange overline would be orange text (fails AA). The two readings conflict on dark/light surfaces.
- **Decision:** Reserve orange for non-text roles only (underline, left-marker, rule). On the navy header, the active nav label is **Paper** (100% vs 72% default) with a 2px **orange underline**; the label never turns navy (invisible) or orange (fails AA). The footer `неофицијална архива` overline is rendered **navy/neutral-700**, not orange. This honors the locked rule D-1.02-1 over the looser component phrasing.
- **Alternatives considered:** Literal "navy label" on the navy bar — rejected: invisible (navy-on-navy). Orange overline/label text — rejected: fails WCAG AA per D-1.02-1.
- **Consequences:** Downside accepted: the handover's verbatim "label stays navy" / "orange overline" wording is not followed literally on the header; the intent (orange = marker only, AA holds) is preserved. Verified in-browser: active label `rgb(247,244,236)` (Paper), underline `rgb(228,116,28)` (Orange).
- **Links:** Phase 1.03; D-1.02-1; brand.md §Color; SiteHeader.tsx; SiteFooter.tsx.

### D-1.03-2 · 2026-07-14 · Fonts self-hosted via next/font/google (no vendored files)
- **Status:** Accepted
- **Context:** The brief requires the two fonts "self-hosted via next/font with Cyrillic subsets." `next/font/google` downloads the font files at build time and serves them from the app's own origin (no runtime request to Google) — i.e. it self-hosts. The alternative is `next/font/local` with font files committed to the repo.
- **Decision:** Use `next/font/google` for Inter and Source Serif 4 with `subsets: ["latin","cyrillic"]` and the brand weights. No `.woff2` files are committed; Next produces 13 self-hosted `woff2` files at build.
- **Alternatives considered:** `next/font/local` with vendored `.woff2` — rejected: adds binary assets and manual subset/version management for no benefit when the fonts are on Google Fonts; both approaches self-host the result. Google `<link>` CDN — rejected: not self-hosted, adds a third-party runtime request.
- **Consequences:** Downside accepted: the production/preview build fetches fonts from Google Fonts at build time (network needed at build; Vercel has it). If Google Fonts is unreachable at build, the build fails — acceptable and standard for `next/font/google`.
- **Links:** Phase 1.03; src/app/fonts.ts; brand.md §Typography; 00_stack-and-config.md.

### D-1.03-3 · 2026-07-14 · Mobile nav is a disclosure menu (hamburger)
- **Status:** Accepted
- **Context:** The handover ships a mobile (390) frame but does not spell out the mobile nav mechanism. Six Cyrillic nav labels plus the wordmark do not fit one row at 375px.
- **Decision:** Add an accessible disclosure menu — a hamburger button (`aria-expanded`/`aria-controls`, sr-only label, Menu/X icons) toggling a stacked navy panel below the bar. Items use an orange left-marker for the active state (the horizontal underline does not suit a vertical list). No transform/height animation (conditional render), so it stays within the motion budget and needs no reduced-motion special-casing.
- **Alternatives considered:** Horizontal scroll / wrap of six items — rejected: cramped and unreadable at 375px. A full-screen overlay menu — rejected: heavier than a layout shell needs.
- **Consequences:** `SiteHeader` is a client component (already required by `usePathname` for the active state). Minimal extra JS (`useState` + one icon swap).
- **Links:** Phase 1.03; SiteHeader.tsx; handover §4/§7.

### D-1.03-4 · 2026-07-14 · Single light theme — shadcn dark-mode block dropped
- **Status:** Accepted
- **Context:** The 1.01 scaffold's `globals.css` shipped shadcn's default `:root` + `.dark` OKLCH neutral tokens. The 1.02 design is a single warm light theme (Paper surface); there is no dark-mode design.
- **Decision:** Replace the neutral tokens with the brand palette and remove the `.dark` override block. The shadcn semantic variables (`--background`, `--primary`, `--border`, …) are repointed to brand values so any future shadcn/ui component inherits the brand look. The dormant `@custom-variant dark` is kept (harmless; matches nothing).
- **Alternatives considered:** Keep a `.dark` block mapped to brand values — rejected: no dark design exists to populate it; dead code. Author a full dark theme — rejected: out of scope, not designed.
- **Consequences:** Downside accepted: adding dark mode later means designing and defining a `.dark` token set from scratch. No user-facing impact (site is light-only).
- **Links:** Phase 1.03; src/app/globals.css; brand.md §Color; D-1.01-2.

### D-1.03-5 · 2026-07-14 · Canonical top-level route slugs (Latin, per D-0.00-4)
- **Status:** Accepted
- **Context:** The nav needs `href`s. D-0.00-4 fixed Latin-transliterated slugs with Cyrillic content; the specific top-level slug set was not yet chosen. Target routes do not exist yet (the brief permits 404s).
- **Decision:** Adopt `/` (Почетна), `/arhiva` (Архива), `/legendi` (Легенди), `/statistika` (Статистика), `/za-nas` (За нас), `/kontakt` (Контакт). Defined once in `src/lib/nav.ts` and consumed by header and footer.
- **Alternatives considered:** Defer hrefs / use `#` placeholders — rejected: real hrefs let later phases drop pages onto known routes and make the nav genuinely navigable. Cyrillic slugs — rejected by D-0.00-4.
- **Consequences:** Downside accepted: later phases must build pages at these exact slugs (or rename here and update `nav.ts`, the single source). Links 404 until their pages ship.
- **Links:** Phase 1.03; D-0.00-4; src/lib/nav.ts.

### D-1.04-1 · 2026-07-15 · Reuse existing `belasica` Sanity project (f8rmnfry), not a new `belasica-v2`
- **Status:** Accepted (owner decision)
- **Context:** The brief (Task 3) says to create a project named `belasica-v2` and assumes no project exists yet ("a browser window opens — he authenticates"). In fact Lazar was already logged into the Sanity CLI on this machine, and an existing project **`belasica`** (id `f8rmnfry`, created 2026-07-12, 2 members = both operators) was already present, with a `production` dataset that is already **public and empty** (verified: unauthenticated GROQ `count` returns 0 docs, HTTP 200). This contradicts the brief's fresh-creation assumption.
- **Decision:** Wire the app to the existing `belasica` project `f8rmnfry`, dataset `production`. Do not create a second project. Surfaced the discrepancy to Lazar; he chose reuse.
- **Alternatives considered:** Create a fresh `belasica-v2` per the brief's literal name — rejected: it would leave two near-duplicate Belasica projects in the account, and the existing one is already correctly configured (public `production`, shared with both operators) and empty. Silently reuse without asking — rejected: the project pre-existed this phase and I did not create it, so the choice is the owner's.
- **Consequences:** Downside accepted: the Sanity project id (`belasica`/f8rmnfry) does not match the repo/site name (`belasica-v2`); this is cosmetic — the project id is opaque and only referenced via env vars. If a clean-slate project is ever wanted, re-run `sanity init` and swap the env var.
- **Links:** Phase 1.04; `.env.local`; `src/sanity/env.ts`.

### D-1.04-2 · 2026-07-15 · Public dataset, readable without an API token
- **Status:** Accepted (brief-mandated, logged per Task 3)
- **Context:** The repo is public; committing a Sanity token would leak it. The site only needs to read published content.
- **Decision:** The `production` dataset is **public-read**, so the site queries published documents with no token. Only the two `NEXT_PUBLIC_*` values + a pinned `apiVersion` are configured; no `SANITY_API_TOKEN` anywhere. The read client sets `perspective: "published"` and `useCdn: true`.
- **Alternatives considered:** Private dataset + read token — rejected: a token in a public repo is a leak, and a token-in-Vercel-only setup adds secret management for content that is meant to be public anyway. Viewer/draft perspective — rejected: the public site shows only published content.
- **Consequences:** Downside accepted: the dataset is world-readable (acceptable — it is an informational public archive with no secrets). Drafts remain private (they require an authenticated editor session, which is what the Studio provides). Editors still authenticate via their Sanity login in `/studio` (CORS-with-credentials origins), so writes are not public.
- **Links:** Phase 1.04; `src/sanity/{env,client}.ts`; CORS origins on f8rmnfry.

### D-1.04-3 · 2026-07-15 · Studio escapes the site chrome via a `(site)` route group
- **Status:** Accepted
- **Context:** The embedded Studio (`/studio`) needs the full viewport; the root layout wrapped every route in `SiteHeader` + `<main>` + `SiteFooter`. Rendering a CMS admin inside the public site nav is wrong, and nested layouts are additive (they cannot remove ancestor chrome). The brief says don't restyle the shell.
- **Decision:** Reduce `src/app/layout.tsx` to the bare root (`<html>`/`<body>`, fonts, `globals.css`, `<Analytics/>`) and relocate the site chrome **verbatim** into a new `src/app/(site)/layout.tsx`; move `page.tsx` under `(site)`. `/studio` and the temporary `/_debug-sanity` live outside the group, so they render on the bare root. Route groups don't change URLs — `/` and all future site routes are unaffected.
- **Alternatives considered:** Leave the Studio inside the header/footer — rejected: broken-looking admin surface for the person who uses it daily. Two duplicated root layouts (remove `app/layout.tsx`) — rejected: duplicates `<html>/<body>` and is more invasive. `position:fixed` overlay on the Studio — rejected: hacky, leaves the shell in the DOM below it. The `SiteHeader`/`SiteFooter` **components are untouched** — only their mount point moved.
- **Consequences:** Downside accepted: site pages now sit under `src/app/(site)/`; future page phases add routes there (or at the top level for chrome-less pages). No visual change to the site.
- **Links:** Phase 1.04; `src/app/layout.tsx`; `src/app/(site)/layout.tsx`.

### D-1.04-4 · 2026-07-15 · Studio pinned to `sanity`/`@sanity/vision` 4.22.0, `next-sanity` 11.6.13 (Next 15 compatibility)
- **Status:** Accepted
- **Context:** The stack is pinned to Next.js 15.5.20 (D-1.01-1) and React 19.2.4. The newest `next-sanity` (13.x) and `next-sanity` 12.x require `next ^16`; only the `11.x` line supports Next 15 (`next-sanity@11.6.13` peers `next ^15.1.0 || ^16`). Separately, `sanity`/`@sanity/vision` **5.x** peer `react ^19.2.2` and import React 19.2's `useEffectEvent`; Next 15.5.20 (the newest 15.x) bundles a pre-19.2 React for the App Router client graph, so a `sanity@5` build fails with `'useEffectEvent' is not exported from 'react'` even though the app's own react is 19.2.4. `sanity@4.22.0` peers `react ^18 || ^19`, so it cannot hard-depend on that hook.
- **Decision:** Pin `next-sanity@11.6.13` (last line supporting Next 15) with Studio at `sanity@4.22.0` + `@sanity/vision@4.22.0` (newest 4.x, React-19.1-safe). `next-sanity@11.6.13` peers `sanity ^4.22.0 || ^5`, so this set resolves cleanly with no `--legacy-peer-deps`. `@sanity/image-url@2.1.1`, `styled-components@6.4.3`.
- **Alternatives considered:** `sanity@5.31.1` + `next-sanity@11.6.13` (first attempt) — rejected: build fails on `useEffectEvent`. Upgrade to Next 16 to unlock latest Sanity — rejected: out of scope; D-1.01-1 pinned Next 15 and later phase briefs assume it — a major-version bump is an owner-level decision, not a CMS-setup side effect. `--legacy-peer-deps` to force `sanity@5` on the older React — rejected: the missing export is a real runtime/build incompatibility, not a peer-range formality.
- **Consequences:** Downside accepted: Studio runs the 4.22.0 line, one major behind latest (fully sufficient for schemas/structure/vision this phase). When Next moves to 16 (a future decision), `next-sanity`→13 and `sanity`→6 can be revisited together.
- **Links:** Phase 1.04; D-1.01-1; `package.json`; `00_stack-and-config.md`.

### D-1.04-5 · 2026-07-15 · `siteSettings` is a Studio singleton
- **Status:** Accepted
- **Context:** `siteSettings` holds global one-off strings (site title, description, footer statement). Left as an ordinary document type, an editor could create many `siteSettings` documents, and the site would have no canonical one to read.
- **Decision:** Present `siteSettings` as a singleton via a custom `structureTool` structure — one fixed document (`documentId: "siteSettings"`) pinned at the top of the desk, filtered out of the normal type list. Other types (`season`, `match`, `person`, `photo`) list normally.
- **Alternatives considered:** Ordinary document type — rejected: invites duplicate settings docs and an ambiguous query. Hard-code the strings in code — rejected: the brief requires them editable in Studio, seeded from the shell values.
- **Consequences:** Downside accepted: a tiny bit of Studio structure config to maintain; querying uses the fixed id. First-pass model — revisited at the content-model lock (2.01).
- **Links:** Phase 1.04; `src/sanity/structure.ts`; `src/sanity/schemaTypes/siteSettings.ts`.

### D-1.05-1 · 2026-07-15 · Featured-season selection rule — newest by decade, then title
- **Status:** Accepted
- **Context:** The homepage features one season. The `season` schema has **no `featured` boolean** and no explicit "featured" marker; the deterministic candidates are `decade` (number) and `title` (string like „Сезона 1985/86“).
- **Decision:** `*[_type=="season" && defined(slug.current)] | order(decade desc, title desc)[0]` — the most recent season by decade, breaking ties on the title string (same format sorts correctly desc).
- **Alternatives considered:** Add a `featured` flag to the schema — rejected: the content model is **locked until 2.01** (out of scope this phase). Random/`_createdAt` — rejected: not meaningful and not stable across edits. Oldest-first — rejected: "recent" is the more natural lead for a demo.
- **Consequences:** Downside accepted: seasons with a null `decade` sort last; if two seasons share a decade and title format differs, ordering is by raw string. Revisit when 2.01 may add an explicit editorial flag.
- **Links:** Phase 1.05; `src/app/(site)/page.tsx` (HOME_QUERY); `season.ts`.

### D-1.05-2 · 2026-07-15 · Legends selection rule — most-capped first, then name
- **Status:** Accepted
- **Context:** The Legends section shows up to three `person` docs. The schema's `role` array is player/trainer/president — **not** a "legend" marker. A meaningful, deterministic proxy for prominence is career appearances.
- **Decision:** `order(coalesce(careerStats.appearances, -1) desc, name asc)[0...3]` — most appearances first (unknown appearances sort last via `-1`), ties broken by name.
- **Alternatives considered:** First 3 by name (the brief's fallback) — rejected: alphabetical is arbitrary for "legends". Filter to `role == "player"` only — rejected: excludes legendary trainers/presidents the owner may want featured. A dedicated `isLegend` flag — rejected: model locked until 2.01.
- **Consequences:** Downside accepted: people with no `careerStats.appearances` fall to the end; if the owner wants a specific three highlighted, that needs an editorial flag in 2.01. Missing name/role still renders a placeholder chip, never invented.
- **Links:** Phase 1.05; `src/app/(site)/page.tsx`; `person.ts`.

### D-1.05-3 · 2026-07-15 · Gallery selection rule — oldest season first, then date
- **Status:** Accepted
- **Context:** The gallery shows up to ~10 photos. `photo.date` is **free text** (e.g. „околу 1985“) and not reliably sortable alone; `relatedSeason->decade` is a clean numeric anchor when present.
- **Decision:** `*[_type=="photo" && defined(image)] | order(coalesce(relatedSeason->decade, 9999) asc, date asc)[0...10]` — group by related-season decade (oldest first, archive-appropriate), then by the date string.
- **Alternatives considered:** Order by `_createdAt` — rejected: reflects data-entry order, not history. Pure `date` string sort — rejected: free-text dates sort inconsistently with no season anchor. Newest-first — rejected: an archive reads oldest→newest.
- **Consequences:** Downside accepted: photos with no related season sort last (`9999`); free-text dates within a decade sort lexically. Good enough for a curated ~10-photo demo grid; a structured date is a 2.01 candidate.
- **Links:** Phase 1.05; `src/app/(site)/page.tsx`; `photo.ts`.

### D-1.05-4 · 2026-07-15 · Homepage freshness via ISR `revalidate = 60`
- **Status:** Accepted
- **Context:** The precondition is that Lazar publishes demo content in `/studio` and **re-opens the preview URL**. With Next's default static rendering the homepage would be baked at build time and not reflect newly published content until a redeploy — breaking the demo flow. The read client uses `useCdn: true` (Sanity CDN caches ~60s).
- **Decision:** Set `export const revalidate = 60` on the homepage (reusing the existing `src/sanity/client.ts`, no new client). Published content appears on the preview within ~a minute of publishing, no redeploy.
- **Alternatives considered:** `force-dynamic` — rejected: a full server render on every request for content that changes rarely, and the Sanity CDN still caches ~60s so it buys little. `useCdn:false` + a second no-CDN client — rejected: the brief says reuse `client.ts`; extra client for marginal gain. Static (default) — rejected: content wouldn't update without a redeploy (breaks the Ace-demo flow).
- **Consequences:** Downside accepted: up to ~60s (ISR) + ~60s (Sanity CDN) lag between publishing and the preview updating — acceptable; publish a moment before showing Ace. Revisit caching strategy when real ingestion volume lands (Part 2).
- **Links:** Phase 1.05; `src/app/(site)/page.tsx`; `src/sanity/client.ts`.

### D-1.05-5 · 2026-07-15 · Reveal-on-scroll gated on `html.js` (motion is pure enhancement); no `will-change`
- **Status:** Accepted
- **Context:** Reveal-on-scroll hides content (`opacity:0`) until it scrolls into view. If that hidden state is unconditional, a no-JS client — or a failed IntersectionObserver — gets a **blank page**. Separately, `will-change: opacity, transform` left permanently on the reveal elements keeps compositor layers alive and was observed to suppress paint in a headless renderer.
- **Decision:** Scope the reveal hidden-state CSS to `html.js` (a class added by a tiny pre-paint inline script in `src/app/(site)/layout.tsx`). Without JS the class is absent → content renders visible. Drop `will-change` entirely (opacity/transform transitions are already compositor-friendly). `prefers-reduced-motion` forces the end-state with `!important`, independent of the transition.
- **Alternatives considered:** framer-motion `whileInView` (the `motion` dep is present) — rejected: same SSR-hidden-without-JS risk, plus JS runtime cost for a CSS-doable effect. Unconditional `[data-reveal]{opacity:0}` — rejected: blank page without JS. Keep `will-change` — rejected: lingering layers + observed paint suppression, no benefit for a one-shot entrance. Inline script in the root layout — rejected: scoping it to `(site)` keeps `/studio` untouched.
- **Consequences:** Downside accepted: one small inline `<script>` in the site layout (runs pre-paint, no flash); the effect depends on the `.js` flag being set. Net: content is never hidden without JS, and motion stays within the Lighthouse budget.
- **Links:** Phase 1.05; `src/app/globals.css`; `src/app/(site)/layout.tsx`; `src/components/home/Reveal.tsx`; brand.md §Motion.

### D-1.05-6 · 2026-07-15 · Hero primary button inverted (paper fill) on the dark hero
- **Status:** Accepted
- **Context:** `brand.md` defines the primary button as **navy fill / paper label**. On the hero, the button sits over the navy bottom gradient — a navy-fill button would be navy-on-navy (invisible / fails contrast).
- **Decision:** On the hero only, invert the primary button to **paper fill / navy label** (both existing brand tokens, roles swapped) so it reads on the dark surface. The secondary hero action stays a paper text link with an orange hover underline. All other (paper-surface) links use the standard navy text-link treatment.
- **Alternatives considered:** Keep navy fill on the hero — rejected: invisible on the navy gradient. Add a new accent-filled button token — rejected: no new tokens; orange-fill would carry navy text on orange (not a defined pairing) and drifts from the palette. Move the CTA off the image — rejected: weakens the hero.
- **Consequences:** Downside accepted: the hero primary button differs from the on-paper primary (navy fill); this is a surface-driven inversion of existing tokens, not a new style. No orange text on paper anywhere (D-1.02-1 upheld).
- **Links:** Phase 1.05; `src/app/(site)/page.tsx`; brand.md §Components / §Color.

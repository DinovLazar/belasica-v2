# brand.md — Belasica-V2

**The only source of design tokens and brand rules.** Filled by Claude Design in Phase 1.02; from then on, every design handover and every line of UI code reads tokens from here — never hardcoded, never copied into another file. Seeded by the orchestrator on 2026-07-14; everything below marked SEED is a placeholder for 1.02, not an approved value.

## Direction (approved at planning)

Dignified modern archive — generous whitespace, strong Cyrillic typography, photos as the heroes. Not retro pastiche, not a template look. The design must survive the comparison "does this look better than a WordPress theme?" — that failure killed V1.

## Inputs for Phase 1.02

- Club colors and crest: delivered by P0.3 (Cowork collects from Drive + web), **confirmed by Lazar before Design begins**. Record the confirmed hex values and their sources here.
- Typography must fully support Macedonian Cyrillic, self-hosted via next/font. Test string: Архива по сезони — Легенди — Тренери и Претседатели — ФК Беласица.
- Photo treatment is a first-class token concern: aspect ratios, radii, captions, and the look of mixed-quality historical scans placed side by side.

## Tokens (SEED — Design fills in 1.02)

### Color
- Primary / secondary (from club colors): SEED
- Neutrals scale: SEED
- Semantic (link, focus, error): SEED
- Contrast rule: every text/background pair passes WCAG 2.2 AA.

### Typography
- Display face: SEED · Text face: SEED (both with confirmed Cyrillic coverage)
- Type scale, line heights, measure (max line length for readability): SEED

### Spacing & layout
- Spacing scale, container widths, breakpoints, grid: SEED

### Components (core set, specified in 1.02)
- Nav / footer · season card · person card · stats table · photo figure with caption · placeholder chip (the visible `[PLACEHOLDER]` style) · SEED

### Motion
- Reveal/transition principles within Lighthouse budget; reduced-motion behavior. SEED

## Brand rules

- "Unofficial archive" identity is always visible in the footer; never style the site to imply official club status.
- Rules added by Design in 1.02: SEED

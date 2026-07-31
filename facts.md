# facts.md — Belasica-V2

**The rule: nothing appears on the site unless it is VERIFIED here.** This file is the only legal source for factual claims rendered on the site. A fact missing or UNVERIFIED → the page ships a visible `[PLACEHOLDER: what's needed]`, logged in the placeholder register in `src/_project-state/current-state.md`.

Verification source format: (who, where, date).

## Naming & identity

- Club name as written on the site: **FK Belasica** — VERIFIED (owner, intake, 2026-07-14)
- Cyrillic rendering for on-page use: **ФК Беласица** — VERIFIED (owner, chat, 2026-07-15). Resolves OV-2; this is the exact on-page wordmark rendered site-wide (header, footer, hero).
- Site self-description: **unofficial archive** (неофицијална архива) — role + wording VERIFIED (Ace, sit-down via Lazar, 2026-07-16). Resolves OV-3. Confirmed footer wording (exact, as rendered): label „неофицијална архива"; line „Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот." Ace confirmed this current wording as correct — no change.
- Legal-page publication date (the „Последно ажурирање" line on `/pravni-informacii`): **16 август 2026** — VERIFIED (owner, chat, 2026-07-31). Rendered verbatim as supplied; it is the date the owner assigned to the legal text, not a computed or build-time value.
- Club founding year: UNVERIFIED — pull from Drive material, confirm with Ace
- The site never mentions Ace's book — VERIFIED standing rule (owner, intake, 2026-07-14)

## People (About us)

- Ace's public name: UNVERIFIED — deferred by owner to the About-page phase (3.03)
- Ace's father: former Belasica player; public name and playing years: UNVERIFIED — deferred to 3.03

## Contact & links

- Contact email: **info@belasicahistory.mk** — VERIFIED (owner, chat, 2026-07-31). Renders as a `mailto:` on three surfaces (footer „Контакт" column, `/kontakt` direct-contact block, `/pravni-informacii` §10) from the single constant `CONTACT_EMAIL` in `src/lib/facts.ts`. Clears PL-3 and the email half of PL-9. *(Prior status: UNVERIFIED — deferred to 3.03.)* ⚠️ Not yet confirmed as the **form destination** — the Formspree endpoint (PL-14) is still unset and is a separate config step.
- Social profiles to link: UNVERIFIED — none supplied at intake; confirm whether any exist/should be linked
- Domain: **www.belasicahistory.mk** — VERIFIED (owner, chat, 2026-07-31). Rendered as plain text in §1 of `/pravni-informacii`. ⚠️ **Recorded only — the cutover has NOT happened.** `metadataBase`, `robots.ts` and `sitemap.ts` all still hardcode `https://belasica-v2.vercel.app`; moving them is its own phase (3.07 scope explicitly excluded it). *(Prior status: UNVERIFIED — purchased at Phase 3.04.)*

## Social proof

- Reviews, awards, certifications, testimonials: none claimed at intake — the site makes no such claims. VERIFIED as "none" (owner, intake, 2026-07-14)

## Content provenance

- All historical content (texts, photos, stats) originates from Ace's Google Drive — VERIFIED (owner, intake, 2026-07-14)
- Photo publishing rights: VERIFIED — Ace confirmed he holds the right to use all photos in the Drive (Ace, sit-down via Lazar, 2026-07-16). Resolves OV-1. ⚠️ **Caveat on record:** the P0.1 Drive audit found most archive photos are third-party screenshots (Facebook / Messenger / newspaper); "right to use" for those is legally nuanced. The specifics (ideally a written confirmation) should be settled before the bulk 2.09 ingestion is published — `docs/content-ingestion-plan.md` §5 keeps ingested photos unpublished until publish is explicitly cleared. (The 8 already-published demo photos are Ace's own.)
- Photo publishing rights — public-exposure confirmation (closes OV-RIGHTS): VERIFIED — the **owner confirms the project holds the rights to all archive photos, and all 889 published photos may remain public** (owner, via Lazar / the Phase 2.08 orchestrator decision, 2026-07-21). This resolves the OV-RIGHTS item opened at 2.09-Run, where 881 mostly-third-party-screenshot photos had been published (D-2.09R-2) ahead of a written rights settlement. Rejected at this phase and recorded for the trail: un-publishing the 881 back to drafts, and restricting the homepage to the 8 Ace-owned demo photos — both declined by the owner. ⚠️ **Record lag on file:** every one of the 881 ingested photo documents still carries a `provenance` string reading „…Потекло и права за објавување НЕПОТВРДЕНИ…" (unconfirmed). That per-document text now **lags** this owner confirmation; a bulk `provenance` rewrite is a separate ingestion-tooling job (not Phase 2.08), so until it runs the document-level provenance understates the confirmed rights.

## Historical facts (seasons, players, matches, stats)

Populated during Part 2 ingestion. Rule for this category: a historical fact is VERIFIED when it is present in Ace's Drive material (source: "Drive, <file/folder>, <date checked>"). Facts found only on the open web and not in the Drive are UNVERIFIED until Ace confirms them.

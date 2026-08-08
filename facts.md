# facts.md — Belasica-V2

**The rule: nothing appears on the site unless it is VERIFIED here.** This file is the only legal source for factual claims rendered on the site. A fact missing or UNVERIFIED → the page ships a visible `[PLACEHOLDER: what's needed]`, logged in the placeholder register in `src/_project-state/current-state.md`.

Verification source format: (who, where, date).

## Naming & identity

- Club name as written on the site: **FK Belasica** — VERIFIED (owner, intake, 2026-07-14)
- Cyrillic rendering for on-page use: **ФК Беласица** — VERIFIED (owner, chat, 2026-07-15). Resolves OV-2; this is the exact on-page wordmark rendered site-wide (header, footer, hero).
- Site self-description: **unofficial archive** (неофицијална архива) — role + wording VERIFIED (Ace, sit-down via Lazar, 2026-07-16). Resolves OV-3. Confirmed footer wording (exact, as rendered): label „неофицијална архива"; line „Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот." Ace confirmed this current wording as correct — no change.
- Legal-page publication date (the „Последно ажурирање" line on `/pravni-informacii`): **16 август 2026** — VERIFIED (owner, chat, 2026-07-31). Rendered verbatim as supplied; it is the date the owner assigned to the legal text, not a computed or build-time value.
- Club founding year: UNVERIFIED — pull from Drive material, confirm with Ace
- ~~The site never mentions Ace's book~~ — **SUPERSEDED (owner, chat, 2026-08-08).** Original entry: „The site never mentions Ace's book — VERIFIED standing rule (owner, intake, 2026-07-14)". The „За нас" copy the owner supplied on 2026-08-08 **names the book in its first sentence** — „…и книгата „ФК Беласица - гордоста на Струмица" е Аце Стојанов." The later, more specific instruction from the same person wins; the original line is kept, marked and dated so the month in which the site said nothing about the book stays readable. The book is named on `/za-nas` and nowhere else. See D-3.15-8.
- Footer copy posture (exact, as rendered): „Текстовите и фотографиите објавени на оваа страница не смеат да се преземаат, копираат, објавуваат или користат на друго место без претходна дозвола од авторот." — **VERIFIED** (owner, chat, 2026-08-08). Rendered verbatim in the footer's bottom bar on every `(site)` route, from `CONTENT_PERMISSION_NOTICE` in `src/lib/facts.ts`. ⚠️ It asks for **permission**; it does **not** claim ownership — the archive publishes material whose rights sit elsewhere, and `/pravni-informacii` §5 promises an unconditional takedown on request. Do not rewrite it as a copyright claim (D-3.15-1). Still owed: a native-speaker read (OV-38).

## People (About us)

- Ace's public name: **Аце Стојанов** — **VERIFIED** (owner, chat, 2026-08-08). Author of this site's texts and its editor, of the Facebook profile *FK Belasica 1956-2006*, and of the book „ФК Беласица - гордоста на Струмица". Rendered on `/za-nas` from `ABOUT_AUTHOR_PARAGRAPH`. **Clears PL-1.** *(Prior status: UNVERIFIED — deferred by owner to the About-page phase (3.03).)*
- Ace's father: **Томе Стојанов (1953–2020)** — **VERIFIED** (owner, chat, 2026-08-08). Former ФК Беласица player, **328 првенствени натпревари, во 14 сезони**. Rendered on `/za-nas` from `ABOUT_DEDICATION_PARAGRAPH`, with his name linked to `/legendi/tome-stojanov`. **Clears PL-2.** ✔️ Cross-checked and consistent with the archive's own data: `person-tome-stojanov` carries `careerStats.appearances` = **328** and `playingYears` = **1976–1990** (14 seasons), and is ranked #5 in the book. *(Prior status: UNVERIFIED — deferred to 3.03.)*
- „За нас" body copy: supplied verbatim by the owner (chat, 2026-08-08), in Ace's own first person. **VERIFIED and rendered byte-for-byte** — no humanizer pass, no restructuring (the brief forbids it explicitly). Typography fixed at supply time: Macedonian quotes „…" around the book title (D-3.07-9), the **author's own hyphen** inside the title, en dash in „1953–2020", and „FK Belasica 1956-2006" kept as a Latin-script proper name. Held in `src/lib/facts.ts`, not in the page.
- Club history length as stated in the About copy: **104 години историја** — VERIFIED as the author's own wording (owner, chat, 2026-08-08). Consistent with a 1922 founding (2026 − 1922 = 104); the founding year itself is still UNVERIFIED as a separate fact below.

## Contact & links

- Contact email: **info@belasicahistory.mk** — VERIFIED (owner, chat, 2026-07-31). Renders as a `mailto:` on three surfaces (footer „Контакт" column, `/kontakt` direct-contact block, `/pravni-informacii` §10) from the single constant `CONTACT_EMAIL` in `src/lib/facts.ts`. Clears PL-3 and the email half of PL-9. *(Prior status: UNVERIFIED — deferred to 3.03.)* ⚠️ Not yet confirmed as the **form destination** — the Formspree endpoint (PL-14) is still unset and is a separate config step.
- Facebook: **https://www.facebook.com/share/1FK4bKq9wx/** — **VERIFIED** (owner, chat, 2026-08-08). The profile *FK Belasica 1956-2006*, **authored and edited by Аце Стојанов** — the same person who writes this site and the book. Rendered from `FACEBOOK_URL`. *(Prior status, 2026-08-02: recorded as a third-party **fan page**, labelled „Фејсбук страница на навивачите" and scoped to the footer only. The About copy the owner supplied on 2026-08-08 states the authorship outright, so that framing is retired — D-3.15-2, superseding D-3.12-6.)*
- Instagram: **https://www.instagram.com/belasica1956.2006** — **VERIFIED** (owner, chat, 2026-08-08). Same identity as the Facebook profile, also authored/edited by Аце Стојанов. Rendered from `INSTAGRAM_URL`. ⚠️ The address as supplied carried `?utm_source=qr&igsh=N2MxeWw4OHRocGxh`; that is a **QR-scan tracking payload, not part of the address**, and is stripped (D-3.15-3). The bare URL resolves to the same profile.
- Both profiles render as icon links under „Следете нѐ" on **two** surfaces — the footer and `/kontakt`'s direct-contact block — from the shared `SocialLinks` component. **Clears PL-15 completely, on both surfaces.** These are the site's only two external links.
- Domain: **www.belasicahistory.mk** — VERIFIED (owner, chat, 2026-07-31). Rendered as plain text in §1 of `/pravni-informacii`. ⚠️ **Recorded only — the cutover has NOT happened.** `metadataBase`, `robots.ts` and `sitemap.ts` all still hardcode `https://belasica-v2.vercel.app`; moving them is its own phase (3.07 scope explicitly excluded it). *(Prior status: UNVERIFIED — purchased at Phase 3.04.)*

## Social proof

- Reviews, awards, certifications, testimonials: none claimed at intake — the site makes no such claims. VERIFIED as "none" (owner, intake, 2026-07-14)

## Content provenance

- All historical content (texts, photos, stats) originates from Ace's Google Drive — VERIFIED (owner, intake, 2026-07-14)
- Photo publishing rights: VERIFIED — Ace confirmed he holds the right to use all photos in the Drive (Ace, sit-down via Lazar, 2026-07-16). Resolves OV-1. ⚠️ **Caveat on record:** the P0.1 Drive audit found most archive photos are third-party screenshots (Facebook / Messenger / newspaper); "right to use" for those is legally nuanced. The specifics (ideally a written confirmation) should be settled before the bulk 2.09 ingestion is published — `docs/content-ingestion-plan.md` §5 keeps ingested photos unpublished until publish is explicitly cleared. (The 8 already-published demo photos are Ace's own.)
- Photo publishing rights — public-exposure confirmation (closes OV-RIGHTS): VERIFIED — the **owner confirms the project holds the rights to all archive photos, and all 889 published photos may remain public** (owner, via Lazar / the Phase 2.08 orchestrator decision, 2026-07-21). This resolves the OV-RIGHTS item opened at 2.09-Run, where 881 mostly-third-party-screenshot photos had been published (D-2.09R-2) ahead of a written rights settlement. Rejected at this phase and recorded for the trail: un-publishing the 881 back to drafts, and restricting the homepage to the 8 Ace-owned demo photos — both declined by the owner. ⚠️ **Record lag on file:** every one of the 881 ingested photo documents still carries a `provenance` string reading „…Потекло и права за објавување НЕПОТВРДЕНИ…" (unconfirmed). That per-document text now **lags** this owner confirmation; a bulk `provenance` rewrite is a separate ingestion-tooling job (not Phase 2.08), so until it runs the document-level provenance understates the confirmed rights.

## Historical facts (seasons, players, matches, stats)

Populated during Part 2 ingestion. Rule for this category: a historical fact is VERIFIED when it is present in Ace's Drive material (source: "Drive, <file/folder>, <date checked>"). Facts found only on the open web and not in the Drive are UNVERIFIED until Ace confirms them.

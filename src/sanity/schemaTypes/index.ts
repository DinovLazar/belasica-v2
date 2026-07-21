import type { SchemaTypeDefinition } from "sanity";
import { siteSettings } from "./siteSettings";
import { season } from "./season";
import { person } from "./person";
import { photo } from "./photo";
import { clubRecord } from "./clubRecord";

// Content model (Phase 2.01 lock, D-2.01-1..4; RE-OPENED additively for Part 3,
// D-3.01-1, re-locked after 3.06), finalized against the real Drive inventory
// from the P0.1 audit. Types: siteSettings, season, person, photo, and — new in
// Part 3 — `clubRecord` (curated Statistics records, D-3.01-5).
// `match` is DEFERRED and deliberately NOT registered here — see match.ts
// (D-2.01-2). The photo↔season / photo↔person relationships are modelled ONCE,
// on the photo (`relatedSeason` / `relatedPerson`), and read via GROQ
// back-references (D-2.01-1); the former forward arrays were removed.
export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  season,
  person,
  photo,
  clubRecord,
];

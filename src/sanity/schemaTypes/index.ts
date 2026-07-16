import type { SchemaTypeDefinition } from "sanity";
import { siteSettings } from "./siteSettings";
import { season } from "./season";
import { person } from "./person";
import { photo } from "./photo";

// LOCKED content model (Phase 2.01 — "content model lock", D-2.01-1..4),
// finalized against the real Drive inventory from the P0.1 audit.
// Four launch types: siteSettings, season, person, photo.
// `match` is DEFERRED and deliberately NOT registered here — see match.ts
// (D-2.01-2). The photo↔season / photo↔person relationships are modelled ONCE,
// on the photo (`relatedSeason` / `relatedPerson`), and read via GROQ
// back-references (D-2.01-1); the former forward arrays were removed.
export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  season,
  person,
  photo,
];

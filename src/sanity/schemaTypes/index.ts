import type { SchemaTypeDefinition } from "sanity";
import { siteSettings } from "./siteSettings";
import { season } from "./season";
import { match } from "./match";
import { person } from "./person";
import { photo } from "./photo";

// Draft content model — first pass (Phase 1.04). Finalized against the real
// Drive inventory in Phase 2.01 ("content model lock").
export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  season,
  match,
  person,
  photo,
];

import type { SlugValidationContext } from "sanity";
import { apiVersion } from "../env";

// Slug uniqueness scoped to the document type (not dataset-wide).
//
// Added at the content-model lock (Phase 2.01, D-2.01-6) so `season.slug` and
// `person.slug` provably enforce uniqueness instead of relying on Sanity's
// implicit default. The scripted ingestion in Phase 2.09 writes 74 season
// shells whose slugs are folder-derived (`1985-86`, …) and, later, person
// slugs; per-type scoping guarantees no two seasons — or two people — share a
// slug, while a season slug and an unrelated person slug never falsely collide.
// The current document's own draft/published pair is excluded so re-saving a
// document does not report itself as a duplicate.
export async function isUniqueSlugPerType(
  slug: string,
  context: SlugValidationContext,
): Promise<boolean> {
  const { document, getClient } = context;
  const client = getClient({ apiVersion });
  const id = document?._id.replace(/^drafts\./, "");
  const params = {
    draft: `drafts.${id}`,
    published: id,
    type: document?._type,
    slug,
  };
  const query = `!defined(*[
    _type == $type &&
    !(_id in [$draft, $published]) &&
    slug.current == $slug
  ][0]._id)`;
  return client.fetch(query, params);
}

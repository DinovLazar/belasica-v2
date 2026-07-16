import { defineType, defineField } from "sanity";

// ⚠️ DEFERRED at the content-model lock (Phase 2.01, D-2.01-2). `match` is NOT
// part of the launch model: it is intentionally left OUT of
// `schemaTypes/index.ts`, so Studio does not list „Натпревар" and no match
// documents can be created. Reason: the P0.1 Drive audit found only ~15 prose
// documents in the whole archive and NO per-match source, so there is no
// match-level dataset to model — statistics derive from season-level
// aggregates (`season.finalTable` + `season.squad`), and career totals from
// `person.careerStats` (D-2.01-3).
//
// The file is kept in-repo (not deleted, still `export`ed so it stays
// lint-clean) so the model can return as its own future phase if match-level
// Drive data ever surfaces — re-add it to `index.ts` at that point. Until then
// this definition is dormant and unreferenced.
export const match = defineType({
  name: "match",
  title: "Натпревар",
  type: "document",
  fields: [
    defineField({ name: "date", title: "Датум", type: "date" }),
    defineField({
      name: "competition",
      title: "Натпреварување",
      type: "string",
    }),
    defineField({ name: "opponent", title: "Противник", type: "string" }),
    defineField({
      name: "homeOrAway",
      title: "Дома или гости",
      type: "string",
      options: {
        list: [
          { title: "Дома", value: "home" },
          { title: "Гости", value: "away" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "scoreFor",
      title: "Голови (Беласица)",
      type: "number",
    }),
    defineField({
      name: "scoreAgainst",
      title: "Голови (противник)",
      type: "number",
    }),
    defineField({
      name: "season",
      title: "Сезона",
      type: "reference",
      to: [{ type: "season" }],
    }),
  ],
  preview: {
    select: {
      opponent: "opponent",
      date: "date",
      sf: "scoreFor",
      sa: "scoreAgainst",
    },
    prepare: ({ opponent, date, sf, sa }) => ({
      title: opponent ? `Беласица — ${opponent}` : "Натпревар",
      subtitle:
        [date, sf != null && sa != null ? `${sf}:${sa}` : null]
          .filter(Boolean)
          .join(" · ") || undefined,
    }),
  },
});

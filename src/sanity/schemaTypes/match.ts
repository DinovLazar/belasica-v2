import { defineType, defineField } from "sanity";

// First-pass, minimal — kept intentionally small until the content model lock
// (Phase 2.01) decides how much match-level detail the archive carries.
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

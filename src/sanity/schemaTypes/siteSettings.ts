import { defineType, defineField } from "sanity";

// Global editable strings that back the site. Singleton (see structure.ts).
// Seeded from the current shell values, but entering them here does NOT verify
// the still-open identity items (OV-2 wordmark, OV-3 footer wording).
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Поставки на сајтот",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Наслов на сајтот",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Опис на сајтот",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "footerUnofficialArchiveText",
      title: "Изјава за неофицијална архива (подножје)",
      type: "text",
      rows: 3,
      description:
        "Долгата изјава во подножјето дека ова е неофицијална архива.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Поставки на сајтот" }),
  },
});

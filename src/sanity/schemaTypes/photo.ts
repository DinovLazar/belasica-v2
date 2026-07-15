import { defineType, defineField } from "sanity";

// PHOTO RIGHTS GATE (P0.1 / P0.2 / OV-1) — read before ingesting or publishing.
// The P0.1 Drive audit (D-0.1-1) found that ~all archive photos are third-party
// screenshots (Facebook / Messenger / newspaper), NOT club-owned originals.
// `provenance` is therefore REQUIRED on every photo, and publishing rights
// (P0.2 / OV-1) are a hard launch blocker: no photo is exposed publicly until
// those rights are confirmed in facts.md. The 2.09 ingestion sets a provisional
// provenance string on every uploaded photo and keeps them out of public
// exposure until the gate clears — see docs/content-ingestion-plan.md.
export const photo = defineType({
  name: "photo",
  title: "Фотографија",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Слика",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", title: "Опис", type: "string" }),
    // Required (content-truth): every photo must record where it came from and
    // the basis for publishing it. Most sources are third-party screenshots
    // (P0.1), so this field is the rights paper-trail; the gate above governs
    // when a photo may go public. Do not weaken to optional.
    defineField({
      name: "provenance",
      title: "Потекло / права",
      type: "string",
      description:
        "Од каде е фотографијата и основ за објавување. Задолжително (content-truth).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Датум",
      type: "string",
      description:
        "Слободен текст — на пр. „околу 1985“ ако точниот датум е непознат.",
    }),
    defineField({
      name: "relatedSeason",
      title: "Поврзана сезона",
      type: "reference",
      to: [{ type: "season" }],
    }),
    defineField({
      name: "relatedPerson",
      title: "Поврзана личност",
      type: "reference",
      to: [{ type: "person" }],
    }),
  ],
  preview: {
    select: { title: "caption", media: "image", subtitle: "provenance" },
    prepare: ({ title, media, subtitle }) => ({
      title: title || "Фотографија",
      subtitle,
      media,
    }),
  },
});

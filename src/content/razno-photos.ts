/**
 * „Разно" — the topics' photographs (Phase 3.20).
 *
 * ⚠️ GENERATED. Written once from the optimisation run's manifest and checked
 * against `public/razno/`; the manifest itself is scratch and is not a build
 * dependency — nothing imports JSON at runtime. Regenerate rather than hand-edit.
 *
 * `width`/`height` are the files' intrinsic pixel dimensions, carried so the
 * grid can set them on a plain `<img>` and reserve the box before the bytes
 * arrive.
 *
 * **`caption` is absent wherever the archive holds no caption.** Those files
 * reached us with machine-generated names (`FB_IMG_…`, `Messenger_creation_…`)
 * that carry no information about the photograph, and writing one would be
 * inventing a fact about a picture nobody has described — the one thing
 * `CLAUDE.md` §Content truth forbids. An undescribed scan renders with no
 * caption and `alt=""`, never with a placeholder or a repeat of the topic
 * title.
 */
export type RaznoPhoto = {
  /** Path under `public/`, always `/razno/<slug>/<slug>-NN.webp`. */
  src: string;
  /** The file's intrinsic dimensions, in pixels. */
  width: number;
  height: number;
  /** Omitted where the archive holds no description of the photograph. */
  caption?: string;
};

/** Keyed by topic slug, in each topic's own file order. */
export const RAZNO_PHOTOS = {
  "kup-na-uefa": [
    { src: "/razno/kup-na-uefa/kup-na-uefa-01.webp", width: 1023, height: 1180 },
    { src: "/razno/kup-na-uefa/kup-na-uefa-02.webp", width: 1014, height: 1132 },
    { src: "/razno/kup-na-uefa/kup-na-uefa-03.webp", width: 1034, height: 1364 },
    { src: "/razno/kup-na-uefa/kup-na-uefa-04.webp", width: 1079, height: 1328 },
    { src: "/razno/kup-na-uefa/kup-na-uefa-05.webp", width: 1580, height: 992 },
    { src: "/razno/kup-na-uefa/kup-na-uefa-06.webp", width: 1600, height: 715 },
  ],
  "mladinska-skola": [
    { src: "/razno/mladinska-skola/mladinska-skola-01.webp", width: 1600, height: 1470, caption: "Беласица 1950" },
    { src: "/razno/mladinska-skola/mladinska-skola-02.webp", width: 833, height: 467, caption: "Беласица 1981" },
    { src: "/razno/mladinska-skola/mladinska-skola-03.webp", width: 1600, height: 908, caption: "Беласица 1992/93 со трофејот" },
    { src: "/razno/mladinska-skola/mladinska-skola-04.webp", width: 1071, height: 594, caption: "Беласица 1993 извештај" },
    { src: "/razno/mladinska-skola/mladinska-skola-05.webp", width: 992, height: 967, caption: "Беласица 1997 извештај" },
    { src: "/razno/mladinska-skola/mladinska-skola-06.webp", width: 599, height: 366, caption: "Беласица 1997" },
    { src: "/razno/mladinska-skola/mladinska-skola-07.webp", width: 1080, height: 2032, caption: "Беласица 1998 пионери" },
    { src: "/razno/mladinska-skola/mladinska-skola-08.webp", width: 1076, height: 893, caption: "Беласица 1999 кадети" },
    { src: "/razno/mladinska-skola/mladinska-skola-09.webp", width: 1600, height: 1036, caption: "Беласица 2000 извештај" },
    { src: "/razno/mladinska-skola/mladinska-skola-10.webp", width: 1080, height: 1818, caption: "Беласица 2000 извештај" },
    { src: "/razno/mladinska-skola/mladinska-skola-11.webp", width: 1080, height: 725, caption: "Беласица 2001 кадети книга" },
    { src: "/razno/mladinska-skola/mladinska-skola-12.webp", width: 1061, height: 1128, caption: "Беласица 2002 извештај" },
    { src: "/razno/mladinska-skola/mladinska-skola-13.webp", width: 1600, height: 990, caption: "Беласица 2002 со трофејот" },
    { src: "/razno/mladinska-skola/mladinska-skola-14.webp", width: 1060, height: 741, caption: "Беласица 2003 извештај" },
    { src: "/razno/mladinska-skola/mladinska-skola-15.webp", width: 1600, height: 1042, caption: "Беласица 2006 екипа" },
    { src: "/razno/mladinska-skola/mladinska-skola-16.webp", width: 1600, height: 1196, caption: "Беласица 2006 извештај" },
    { src: "/razno/mladinska-skola/mladinska-skola-17.webp", width: 1029, height: 662, caption: "Беласица 2007 пионери" },
    { src: "/razno/mladinska-skola/mladinska-skola-18.webp", width: 720, height: 405, caption: "Беласица 2013 млади" },
    { src: "/razno/mladinska-skola/mladinska-skola-19.webp", width: 1600, height: 1037 },
    { src: "/razno/mladinska-skola/mladinska-skola-20.webp", width: 960, height: 729, caption: "Беласица 1964/65 младинци млади" },
    { src: "/razno/mladinska-skola/mladinska-skola-21.webp", width: 719, height: 454, caption: "Беласица 1971/72 младинци млади" },
    { src: "/razno/mladinska-skola/mladinska-skola-22.webp", width: 1342, height: 934, caption: "Беласица 1993 младинци млади" },
    { src: "/razno/mladinska-skola/mladinska-skola-23.webp", width: 1564, height: 970, caption: "Беласица 1993 млади со трофејот" },
    { src: "/razno/mladinska-skola/mladinska-skola-24.webp", width: 720, height: 540, caption: "Беласица 1993 младинци млади куп" },
    { src: "/razno/mladinska-skola/mladinska-skola-25.webp", width: 1044, height: 1413 },
    { src: "/razno/mladinska-skola/mladinska-skola-26.webp", width: 1053, height: 1425 },
    { src: "/razno/mladinska-skola/mladinska-skola-27.webp", width: 1056, height: 1224 },
    { src: "/razno/mladinska-skola/mladinska-skola-28.webp", width: 947, height: 1402 },
    { src: "/razno/mladinska-skola/mladinska-skola-29.webp", width: 960, height: 673, caption: "Беласица 2003 млади" },
  ],
  "viaredzo-kup": [
    { src: "/razno/viaredzo-kup/viaredzo-kup-01.webp", width: 1080, height: 658, caption: "Беласица 2001" },
    { src: "/razno/viaredzo-kup/viaredzo-kup-02.webp", width: 1440, height: 751, caption: "Беласица 2006" },
    { src: "/razno/viaredzo-kup/viaredzo-kup-03.webp", width: 1600, height: 1164, caption: "Беласица 2009" },
    { src: "/razno/viaredzo-kup/viaredzo-kup-04.webp", width: 816, height: 460, caption: "Беласица млади" },
    { src: "/razno/viaredzo-kup/viaredzo-kup-05.webp", width: 677, height: 450, caption: "Беласица 2014" },
  ],
  "partizan": [
    { src: "/razno/partizan/partizan-01.webp", width: 720, height: 423 },
    { src: "/razno/partizan/partizan-02.webp", width: 1080, height: 572 },
    { src: "/razno/partizan/partizan-03.webp", width: 1080, height: 888 },
    { src: "/razno/partizan/partizan-04.webp", width: 678, height: 1956 },
    { src: "/razno/partizan/partizan-05.webp", width: 1080, height: 1785 },
    { src: "/razno/partizan/partizan-06.webp", width: 1564, height: 1024 },
    { src: "/razno/partizan/partizan-07.webp", width: 1200, height: 728 },
  ],
  "tiverija": [
    { src: "/razno/tiverija/tiverija-01.webp", width: 1080, height: 716 },
    { src: "/razno/tiverija/tiverija-02.webp", width: 1080, height: 593 },
    { src: "/razno/tiverija/tiverija-03.webp", width: 1080, height: 1080 },
  ],
  "stadion-blagoj-istatov": [
    { src: "/razno/stadion-blagoj-istatov/stadion-blagoj-istatov-01.webp", width: 291, height: 459 },
    { src: "/razno/stadion-blagoj-istatov/stadion-blagoj-istatov-02.webp", width: 1080, height: 720 },
    { src: "/razno/stadion-blagoj-istatov/stadion-blagoj-istatov-03.webp", width: 960, height: 752 },
    { src: "/razno/stadion-blagoj-istatov/stadion-blagoj-istatov-04.webp", width: 960, height: 641 },
    { src: "/razno/stadion-blagoj-istatov/stadion-blagoj-istatov-05.webp", width: 960, height: 960 },
    { src: "/razno/stadion-blagoj-istatov/stadion-blagoj-istatov-06.webp", width: 850, height: 563 },
  ],
  "ajduci": [
    { src: "/razno/ajduci/ajduci-01.webp", width: 1600, height: 977 },
    { src: "/razno/ajduci/ajduci-02.webp", width: 1080, height: 1080 },
    { src: "/razno/ajduci/ajduci-03.webp", width: 1080, height: 608 },
    { src: "/razno/ajduci/ajduci-04.webp", width: 1080, height: 720 },
    { src: "/razno/ajduci/ajduci-05.webp", width: 960, height: 651 },
    { src: "/razno/ajduci/ajduci-06.webp", width: 1080, height: 716 },
    { src: "/razno/ajduci/ajduci-07.webp", width: 1080, height: 810 },
    { src: "/razno/ajduci/ajduci-08.webp", width: 574, height: 409 },
  ],
} satisfies Record<string, RaznoPhoto[]>;

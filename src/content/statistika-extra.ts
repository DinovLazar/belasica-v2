/**
 * Аце Стојанов's club statistics — the three sections added to `/statistika`
 * at Phase 3.34.
 *
 * ⚠️ GENERATED — DO NOT EDIT BY HAND. Written by
 * `scripts/build-statistika-extra.mjs` from `data/book/statistika-source.md`,
 * the verbatim transcription of `data/book/sources/belasica-statistika-razno.docx`
 * („БЕЛАСИЦА - статистика и разно“, Аце Стојанов). Regenerate with:
 *
 *     node scripts/build-statistika-extra.mjs
 *
 * and prove the committed copy is current with `--check`.
 *
 * ⚠️ **NOT EDITABLE IN STUDIO.** Like the „Разно“ chapters (D-3.16-2) and the
 * season tables (D-3.28), this content lives in the repo, so a correction Аце
 * wants is a code change and a deploy — not a Studio edit. That cost is on the
 * register in `current-state.md`.
 *
 * ⚠️ **EVERY FIGURE, NAME, PERIOD AND SENTENCE HERE IS HIS, VERBATIM.** Nothing
 * was corrected, expanded, reconciled or reordered. In particular:
 *
 *  - The seasons he has no scorer for carry an empty `scorers` array. They
 *    render as the season and a dash — never as a guess.
 *  - Names stay abbreviated as he wrote them („И. Чулев(ски)“), and are NOT
 *    linked to player pages: 82,7 % of book name strings are initial-and-
 *    surname, and matching on a surname asserts an identity the source does not
 *    (the same rule the squad tables follow — D-3.28-7, OV-63).
 *  - Periods stay as printed, two-digit spans („83-90“) beside four-digit ones.
 *  - Shared ranks are his. **Three of his rank numbers are internally
 *    inconsistent** and are carried unchanged rather than renumbered; they are
 *    listed as owed items in the 3.34 completion report.
 *  - His two-points-counted-as-three note travels with the narrative it
 *    qualifies. It is what keeps this block consistent with the season tables,
 *    which still show 1992/93 at 34 points. Neither was reconciled to the other.
 *
 * `line` is never rendered. It exists so any figure on the site can be traced
 * to one paragraph of the document — the same auditability rule
 * `data/book/razno-source.md` follows.
 *
 * **Server-only by construction.** `/statistika` is a server component, so
 * importing this costs the client nothing — provided no client component ever
 * imports it.
 *
 * **Nothing may import `data/book/statistika-source.md`.** That file is data,
 * not code; this module is its projection, and the two are tied together only
 * by the generator (D-3.16-2).
 */

/** One named scorer. A season the author left blank has none. */
export type SeasonScorer = {
  player: string;
  goals: number;
};

export type SeasonScorerRow = {
  /** Exactly as printed — including his trailing periods („1951.“). */
  season: string;
  /** Empty when he recorded no scorer. Two or more when he recorded a tie. */
  scorers: SeasonScorer[];
  /** His inline parenthetical, e.g. „фалат 6 извештаи“. */
  note: string | null;
  line: number;
};

export type RankedRow = {
  rank: number;
  name: string;
  /** Null in the Прва македонска лига tables, which print no period. */
  period: string | null;
  value: number;
  line: number;
};

export type RankedTable = {
  /** His own ALL-CAPS header. */
  heading: string;
  /** His intro paragraph(s), above the table. */
  intro: string[];
  /** His own column line — „Играч/период/голови“. */
  columnLine: string;
  rows: RankedRow[];
  /** „Понатаму следуваат: …“, and block E's two `*` footnotes. */
  tail: string[];
  line: number;
};

export type PlainRankedTable = {
  intro: string;
  columnLine: string;
  rows: RankedRow[];
};

export type MacedonianLeague = {
  heading: string;
  /** The 14-season aggregate and the three lines under it, verbatim. */
  narrative: string[];
  appearances: PlainRankedTable;
  goals: PlainRankedTable;
  /**
   * Source lines holding a bare rule the author drew inside the appearances
   * table (between rank 11 and rank 12). What he meant is not stated anywhere
   * in the document, so it is recorded and deliberately NOT rendered — drawing
   * it would assert a grouping he never wrote down.
   */
  unrenderedDividerLines: number[];
};

/** His own sentence introducing block A. */
export const SEASON_SCORERS_INTRO = "Најдобри стрелци на Беласица по сезони, почнувајќи од 1950 година:";

/** His own column line for block A — the source of that table's headers. */
export const SEASON_SCORERS_COLUMN_LINE = "Сезона/играч/голови";

/** Block A — his season-by-season top scorers, 1950 → 2025/26. */
export const SEASON_SCORERS: SeasonScorerRow[] = [
  { season: "1950", scorers: [{ player: "И. Чулев(ски)", goals: 11 }], note: null, line: 6 },
  { season: "1951.", scorers: [], note: null, line: 7 },
  { season: "1952/53", scorers: [], note: null, line: 8 },
  { season: "1953/54", scorers: [{ player: "К. Ќосев", goals: 8 }], note: null, line: 9 },
  { season: "1954/55", scorers: [{ player: "В. Цветков", goals: 15 }], note: null, line: 10 },
  { season: "1955/56", scorers: [], note: null, line: 11 },
  { season: "1956/57", scorers: [{ player: "В. Цветков", goals: 10 }], note: null, line: 12 },
  { season: "1957/58", scorers: [{ player: "Ѓ. Ефтимов", goals: 19 }], note: null, line: 13 },
  { season: "1958/59", scorers: [{ player: "Д. Трендов", goals: 10 }], note: null, line: 14 },
  { season: "1959/60", scorers: [{ player: "Р. Зафиров", goals: 18 }], note: null, line: 15 },
  { season: "1960/61", scorers: [{ player: "П. Пантазиев", goals: 17 }], note: null, line: 16 },
  { season: "1961/62", scorers: [{ player: "Ѓ. Георгиев", goals: 8 }], note: "фалат 6 извештаи", line: 17 },
  { season: "1962/63", scorers: [{ player: "Ѓ. Георгиев", goals: 12 }], note: null, line: 18 },
  { season: "1963/64", scorers: [{ player: "Ѓ. Георгиев", goals: 12 }], note: null, line: 19 },
  { season: "1964/65", scorers: [{ player: "М. Џидалов", goals: 17 }], note: null, line: 20 },
  { season: "1965/66", scorers: [{ player: "С. Џорлев", goals: 10 }], note: null, line: 21 },
  { season: "1966/67", scorers: [{ player: "Ј. Петровиќ", goals: 10 }, { player: "Т. Семенков", goals: 10 }], note: null, line: 22 },
  { season: "1967/68", scorers: [{ player: "Ј. Петровиќ", goals: 12 }], note: null, line: 24 },
  { season: "1968/69", scorers: [{ player: "П. Пантазиев", goals: 13 }], note: null, line: 25 },
  { season: "1969/70", scorers: [{ player: "Ѓ. Георгиев", goals: 17 }], note: null, line: 26 },
  { season: "1970/71", scorers: [{ player: "М. Чинков", goals: 9 }], note: null, line: 27 },
  { season: "1971/72", scorers: [{ player: "Ѓ. Георгиев", goals: 7 }, { player: "Н. Секулов", goals: 7 }], note: null, line: 28 },
  { season: "1972/73", scorers: [{ player: "В. Рингов", goals: 15 }], note: null, line: 30 },
  { season: "1973/74", scorers: [{ player: "Д. Георгиев-Шеки", goals: 13 }], note: null, line: 31 },
  { season: "1974/75", scorers: [{ player: "Б. Тасев", goals: 12 }], note: null, line: 32 },
  { season: "1975/76", scorers: [{ player: "Љ. Мафков", goals: 27 }], note: null, line: 33 },
  { season: "1976/77", scorers: [{ player: "Љ. Мафков", goals: 19 }], note: null, line: 34 },
  { season: "1977/78", scorers: [{ player: "Љ. Мафков", goals: 16 }], note: null, line: 35 },
  { season: "1978/79", scorers: [{ player: "Н. Секулов", goals: 19 }], note: null, line: 36 },
  { season: "1979/80", scorers: [{ player: "Љ. Мафков", goals: 11 }], note: null, line: 37 },
  { season: "1980/81", scorers: [{ player: "П. Андреев", goals: 8 }], note: null, line: 38 },
  { season: "1981/82", scorers: [{ player: "М. Василев", goals: 10 }], note: null, line: 39 },
  { season: "1982/83", scorers: [{ player: "Д. Георгиев-Шеки", goals: 9 }, { player: "В. Дрвошанов", goals: 9 }], note: null, line: 40 },
  { season: "1983/84.", scorers: [{ player: "К. Секулов", goals: 7 }], note: null, line: 42 },
  { season: "1984/85", scorers: [{ player: "Г. Узунов", goals: 6 }], note: null, line: 43 },
  { season: "1985/86", scorers: [{ player: "Н. Шабани", goals: 12 }], note: null, line: 44 },
  { season: "1986/87", scorers: [{ player: "Н. Шабани", goals: 7 }], note: null, line: 45 },
  { season: "1987/88", scorers: [{ player: "Г. Узунов", goals: 10 }], note: null, line: 46 },
  { season: "1988/89", scorers: [{ player: "З. Митев", goals: 6 }, { player: "Ж. Савов", goals: 6 }], note: null, line: 47 },
  { season: "1989/90", scorers: [{ player: "М. Василев", goals: 10 }], note: null, line: 49 },
  { season: "1990/91", scorers: [{ player: "М. Василев", goals: 18 }], note: null, line: 50 },
  { season: "1991/92", scorers: [{ player: "В. Георгиев", goals: 12 }], note: null, line: 51 },
  { season: "1992/93", scorers: [{ player: "Т. Ефтимов", goals: 10 }], note: null, line: 52 },
  { season: "1993/94", scorers: [{ player: "Д. Хаџиосмановиќ", goals: 10 }], note: null, line: 53 },
  { season: "1994/95", scorers: [{ player: "В. Георгиев", goals: 15 }], note: null, line: 54 },
  { season: "1995/96", scorers: [{ player: "Ј. Василев", goals: 6 }, { player: "Б. Беличев", goals: 6 }], note: null, line: 55 },
  { season: "1996/97", scorers: [{ player: "М. Петков", goals: 12 }], note: null, line: 57 },
  { season: "1997/98", scorers: [{ player: "Т. Атанасов", goals: 12 }], note: null, line: 58 },
  { season: "1998/99", scorers: [{ player: "В. Георгиев", goals: 15 }], note: null, line: 59 },
  { season: "1999/00", scorers: [{ player: "Т. Атанасов", goals: 23 }], note: null, line: 60 },
  { season: "2000/01", scorers: [{ player: "Љ. Николиќ", goals: 16 }], note: null, line: 61 },
  { season: "2001/02", scorers: [{ player: "Љ. Николиќ", goals: 14 }], note: null, line: 62 },
  { season: "2002/03", scorers: [{ player: "З. Балдовалиев", goals: 21 }], note: null, line: 63 },
  { season: "2003/04", scorers: [{ player: "З. Балдовалиев", goals: 9 }], note: null, line: 64 },
  { season: "2004/05", scorers: [{ player: "А. Стојановски", goals: 26 }], note: null, line: 65 },
  { season: "2005/06", scorers: [{ player: "Д. Савиќ", goals: 7 }], note: null, line: 66 },
  { season: "2006/07", scorers: [{ player: "Ѓ. Лиманов", goals: 11 }], note: null, line: 67 },
  { season: "2007/08", scorers: [{ player: "В. Георгиев", goals: 10 }], note: null, line: 68 },
  { season: "2008/09", scorers: [{ player: "А. Стојановски", goals: 8 }], note: null, line: 69 },
  { season: "2009/10", scorers: [{ player: "Ѓ. Марков", goals: 10 }], note: null, line: 70 },
  { season: "2010/11", scorers: [{ player: "Ѓ. Марков", goals: 11 }], note: null, line: 71 },
  { season: "2011/12", scorers: [{ player: "В. Георгиев", goals: 7 }], note: null, line: 72 },
  { season: "2012/13", scorers: [], note: null, line: 73 },
  { season: "2013/14", scorers: [{ player: "Ѓ. Лиманов", goals: 28 }], note: null, line: 74 },
  { season: "2014/15", scorers: [{ player: "М. Костовски", goals: 27 }], note: null, line: 75 },
  { season: "2015/16", scorers: [{ player: "М. Атанасовски", goals: 14 }], note: null, line: 76 },
  { season: "2016/17", scorers: [{ player: "Б. Мариќ", goals: 38 }], note: null, line: 77 },
  { season: "2017/18", scorers: [{ player: "П. Георгиев", goals: 16 }], note: null, line: 78 },
  { season: "2018/19", scorers: [{ player: "П. Георгиев", goals: 9 }], note: null, line: 79 },
  { season: "2019/20", scorers: [{ player: "М. Мирчевски", goals: 14 }], note: null, line: 80 },
  { season: "2020/21", scorers: [{ player: "А. Калановски", goals: 8 }], note: null, line: 81 },
  { season: "2021/22", scorers: [{ player: "А. Коцев", goals: 12 }], note: null, line: 82 },
  { season: "2022/23", scorers: [{ player: "А. Милушев", goals: 8 }], note: null, line: 83 },
  { season: "2023/24", scorers: [{ player: "А. Милушев", goals: 7 }], note: null, line: 84 },
  { season: "2024/25", scorers: [{ player: "Д. Јовов", goals: 8 }], note: null, line: 85 },
  { season: "2025/26", scorers: [{ player: "А. Милушев", goals: 9 }], note: null, line: 86 },
];

/** Blocks B–E — the four Yugoslav-league rankings, in his document order. */
export const YUGOSLAV_TABLES: RankedTable[] = [
  {
    heading: "ВТОРА И ТРЕТА ЈУГОСЛОВЕНСКА ЛИГА - ГОЛОВИ",
    intro: ["Најмногу голови во дресот на Беласица во 8-те сезони кои се во повисок степен на натпреварување од Првата македонска лига, односно во Втората југословенска лига (1983/84,1984/85,1985/86,1986/87 и 1988/89) и Третата југословенска лига (1989/90, 1991/92) и во 4. зона (1956/57) имаат постигнато следниве играчи:"],
    columnLine: "Играч/период/голови",
    rows: [
      { rank: 1, name: "М. Василев", period: "1983-91", value: 29, line: 92 },
      { rank: 2, name: "Г. Узунов", period: "1984-89", value: 23, line: 93 },
      { rank: 3, name: "Н. Шабани", period: "1985-87", value: 19, line: 94 },
      { rank: 4, name: "К. Секулов", period: "1983-89", value: 17, line: 95 },
      { rank: 5, name: "Б. Јовановски", period: "1984-86", value: 13, line: 96 },
      { rank: 6, name: "В. Георгиев", period: "1991-92", value: 12, line: 97 },
      { rank: 7, name: "П. Блажевски", period: "1983-87", value: 11, line: 98 },
      { rank: 8, name: "З. Милосовски", period: "1983-85", value: 10, line: 99 },
      { rank: 8, name: "Р. Попов-Думбовиќ", period: "1989-92", value: 10, line: 100 },
      { rank: 8, name: "В. Цветков.", period: "1956-57", value: 10, line: 101 },
      { rank: 11, name: "З. Зајков", period: "1984-89", value: 9, line: 102 },
      { rank: 12, name: "Тр. Георгиев.", period: "1983-92", value: 8, line: 103 },
      { rank: 13, name: "М. Георгиев-Шеки", period: "83-90", value: 7, line: 104 },
    ],
    tail: ["Понатаму следуваат: З. Митев, Б. Марков и Ж. Савов по 6, Г. Стојменов и М. Боев по 5 гола."],
    line: 87,
  },
  {
    heading: "ВТОРА И ТРЕТА ЈУГОСЛОВЕНСКА ЛИГА - НАТПРЕВАРИ",
    intro: ["ФК Беласица во пет сезони игра во Втората југословенска лига (1983/84,1984/85,1985/86,1986/87, 1988/89), две сезони во Третата југословенска лига (1989/90,1991/92) и една сезона во Четвртата зона (1956/57). Играчи кои забележале најмногу настапи во овие вкупно 8 сезони на Беласица, во овие повисоки лиги од Првата македонска лига, се следниве 30 играчи:"],
    columnLine: "Играч/период/настапи",
    rows: [
      { rank: 1, name: "М. Василев", period: "1983-91", value: 195, line: 111 },
      { rank: 2, name: "П. Андреев", period: "1983-92", value: 184, line: 112 },
      { rank: 3, name: "Р. Панов", period: "1983-92", value: 145, line: 113 },
      { rank: 4, name: "К. Секулов", period: "1983-89", value: 121, line: 114 },
      { rank: 5, name: "Т. Стојанов", period: "1983-90", value: 115, line: 115 },
      { rank: 6, name: "З. Зајков", period: "1984-89", value: 112, line: 116 },
      { rank: 7, name: "Г. Узунов", period: "1984-89", value: 107, line: 117 },
      { rank: 8, name: "Т. Георгиев", period: "1983-89", value: 97, line: 118 },
      { rank: 9, name: "П. Блажевски", period: "1983-87", value: 80, line: 119 },
      { rank: 9, name: "Д. Руменовски", period: "1984-92", value: 80, line: 120 },
      { rank: 11, name: "Б. Јовановски", period: "1984-86", value: 75, line: 121 },
      { rank: 11, name: "Г. Стојановски", period: "1988-92", value: 75, line: 122 },
      { rank: 13, name: "Б. Митев", period: "1983-87", value: 72, line: 123 },
      { rank: 14, name: "М.Георгиев-Шеки", period: "1983-89", value: 62, line: 124 },
      { rank: 15, name: "М. Боев", period: "1983-85", value: 60, line: 125 },
      { rank: 16, name: "М. Илиев", period: "1986-92", value: 59, line: 126 },
      { rank: 17, name: "Б. Беличев", period: "1984-89", value: 57, line: 127 },
      { rank: 17, name: "М. Јовев", period: "1988-90", value: 57, line: 128 },
      { rank: 19, name: "С. Танев", period: "1988-92", value: 50, line: 129 },
      { rank: 20, name: "М. Даскаловски", period: "1983-92", value: 49, line: 130 },
      { rank: 21, name: "Р. Попов-Думбовиќ", period: "89-92", value: 48, line: 131 },
      { rank: 22, name: "Н. Шабани", period: "1985-87", value: 47, line: 132 },
      { rank: 22, name: "Б. Марков", period: "1983-89", value: 47, line: 133 },
      { rank: 22, name: "Н. Танушев", period: "1988-92", value: 47, line: 134 },
      { rank: 25, name: "В. Бојчевски", period: "1987-91", value: 41, line: 135 },
      { rank: 25, name: "Д. Јорданов", period: "1985-87", value: 41, line: 136 },
      { rank: 27, name: "Г. Стојменов", period: "1983-86", value: 40, line: 137 },
      { rank: 28, name: "Љ. Димовски", period: "1985-87", value: 39, line: 138 },
      { rank: 29, name: "В. Дрвошанов", period: "1983-85", value: 38, line: 139 },
      { rank: 30, name: "З. Милосовски", period: "1983-85", value: 36, line: 140 },
    ],
    tail: ["Други играчи кои следуваат се: В. Митев 33, К. Мутовчиев 32, З. Митев 31, А. Сетинов 30, В. Алтнов по 29, Васко Георгиев, Ж. Савов и Ване Георгиев по 28, Д. Василев 26, Т. Атанасов и М. Јовановски по 25, Т. Панов, М. Панов и Е. Менга по 23, М. Морарцалиев и С. Киров по 22..."],
    line: 107,
  },
  {
    heading: "ВТОРА ЈУГОСЛОВЕНСКА ЛИГА - НАТПРЕВАРИ",
    intro: ["Играчи со најмногу настапи за ФК Беласица во петте сезони во Втората југословенска лига (1983/84,1984/85,1985/86,1986/87, 1988/89) се следниве:"],
    columnLine: "Играч/период/настапи",
    rows: [
      { rank: 1, name: "М. Василев", period: "1983-89", value: 150, line: 147 },
      { rank: 2, name: "П. Андреев", period: "1983-89", value: 147, line: 148 },
      { rank: 3, name: "Р. Панов", period: "1983-89", value: 131, line: 149 },
      { rank: 4, name: "К. Секулов", period: "1983-89", value: 121, line: 150 },
      { rank: 5, name: "З. Зајков", period: "1984-89", value: 112, line: 151 },
      { rank: 6, name: "Г. Узунов", period: "1984-89", value: 107, line: 152 },
      { rank: 7, name: "Т. Стојанов", period: "1983-89", value: 92, line: 153 },
      { rank: 8, name: "Т. Георгиев", period: "1983-89", value: 86, line: 154 },
      { rank: 9, name: "П. Блажевски", period: "1983-87", value: 80, line: 155 },
      { rank: 10, name: "Б. Јовановски", period: "1984-86", value: 75, line: 156 },
      { rank: 11, name: "Б. Митев", period: "1983-87", value: 72, line: 157 },
      { rank: 12, name: "М. Боев", period: "1983-85", value: 60, line: 158 },
      { rank: 13, name: "М.Георгиев-Шеки", period: "1983-85", value: 58, line: 159 },
      { rank: 14, name: "Б. Беличев", period: "1984-89", value: 57, line: 160 },
      { rank: 15, name: "М. Илиев", period: "1986-89", value: 48, line: 161 },
      { rank: 16, name: "Н. Шабани", period: "1985-87", value: 47, line: 162 },
      { rank: 17, name: "Д. Јорданов", period: "1985-87", value: 41, line: 163 },
      { rank: 18, name: "Г. Стојменов", period: "1983-86", value: 40, line: 164 },
      { rank: 19, name: "Б. Марков", period: "1983-89", value: 40, line: 165 },
      { rank: 20, name: "Љ. Димовски", period: "1985-87", value: 39, line: 166 },
      { rank: 20, name: "В. Дрвошанов", period: "1983-85", value: 38, line: 167 },
      { rank: 22, name: "З. Милосовски", period: "1983-85", value: 36, line: 168 },
      { rank: 23, name: "Д. Георгиев", period: "1983-85", value: 35, line: 169 },
      { rank: 23, name: "Д. Руменовски", period: "1984-89", value: 35, line: 170 },
      { rank: 25, name: "Г. Стојановски", period: "1988-89", value: 32, line: 171 },
    ],
    tail: ["Други играчи кои следуваат се: З. Митев 31, А. Сетинов 30, М. Јовев и В. Алтнов по 29, Ж. Савов и Ване Георгиев по 28, Д. Василев 26, М. Јовановски 25, Е. Менга 23, М. Морарцалиев 22, К. Мутовчиев 18..."],
    line: 143,
  },
  {
    heading: "ВТОРА ЈУГОСЛОВЕНСКА ЛИГА - ГОЛОВИ",
    intro: ["ФК Беласица во својата историја ќе игра пет сезони во Втората југословенска лига (1983/84,1984/85,1985/86,1986/87, 1988/89). Седум играчи ќе постигнат двоцифрен број голови во дресот на Беласица, и тоа:"],
    columnLine: "Играч/период/голови",
    rows: [
      { rank: 1, name: "Г. Узунов", period: "1984-89", value: 23, line: 178 },
      { rank: 2, name: "Н. Шабани", period: "1985-87", value: 19, line: 179 },
      { rank: 3, name: "К. Секулов", period: "1983-89", value: 17, line: 180 },
      { rank: 4, name: "Б. Јовановски", period: "1984-86", value: 13, line: 181 },
      { rank: 5, name: "М. Василев", period: "1983-89", value: 12, line: 182 },
      { rank: 5, name: "П. Блажевски", period: "1983-87", value: 10, line: 183 },
      { rank: 7, name: "З. Милосовски", period: "1983-85", value: 10, line: 184 },
    ],
    tail: ["* З. Зајков има 9 гола, М. Георгиев-Шеки 7, а З. Митев, Ж. Савов и  Г. Стојменов по 6, Б. Марков и М. Боев по 5 гола.", "** Во првите 4 сезони Беласица игра во Втората југословенска лига - исток (постојатлиги: исток и запад), додека во сезоната 1988/89 постои само единствена Втора југословенска лига."],
    line: 174,
  },
];

/** Block F — independent Macedonia's top division. */
export const MACEDONIAN_LEAGUE: MacedonianLeague = {
  heading: "БЕЛАСИЦА – ВО ПРВАТА МАКЕДОНСКА ЛИГА ОД НЕЗАВИСНА МАКЕДОНИЈА",
  narrative: [
    "Беласица во независна Македонија има одиграно 14 сезони, во Првата македонска лига. Во овие 432 натпревари, Беласица забележала 152 победи, 88 нерешени и 192 порази. Беласица има постигнато 544 гола или 1,26 гол по натпревар. Противниците имаат постигнато 642 гола против Беласица или 1,49 гол по натпревар.",
    "Најуспешни сезони на Беласица се 2001/02 и 2002/03, кога два пати била вицешампион и се изборила да игра во купот на УЕФА.",
    "Беласица досега четири пати испаѓала од Првата лига (1997/98,2005/06,2018/19, 2020/21).",
    "Во сезоните 1992/93 и 1993/94, за победа се даваа по два бода, но овде во табелата ги имам сметано како три бода. Според тоа, Беласица во просек има освојувано 1,26 бод по натпревар.",
  ],
  appearances:
    {
      intro: "Во овие 14 сезони за Беласица над 60 првенствени настапи имаат забележано следниве 25 играчи:",
      columnLine: "Играчи/настапи",
      rows: [
        { rank: 1, name: "В. Костов", period: null, value: 177, line: 198 },
        { rank: 2, name: "Т. Атанасов", period: null, value: 172, line: 199 },
        { rank: 3, name: "З. Трајковски", period: null, value: 127, line: 200 },
        { rank: 4, name: "Р. Дориев", period: null, value: 122, line: 201 },
        { rank: 5, name: "Г. Стојановски", period: null, value: 120, line: 202 },
        { rank: 6, name: "М. Илиев", period: null, value: 119, line: 203 },
        { rank: 7, name: "П. Стојанов", period: null, value: 116, line: 204 },
        { rank: 7, name: "Р. Христовски", period: null, value: 116, line: 205 },
        { rank: 9, name: "Р. Панов", period: null, value: 110, line: 206 },
        { rank: 10, name: "В. Георгиев", period: null, value: 105, line: 207 },
        { rank: 11, name: "З. Балдовалиев", period: null, value: 95, line: 208 },
        { rank: 12, name: "Б. Михајловиќ", period: null, value: 92, line: 210 },
        { rank: 13, name: "М. Даскаловски", period: null, value: 86, line: 211 },
        { rank: 14, name: "Р. Попов", period: null, value: 82, line: 212 },
        { rank: 15, name: "Т. Николов", period: null, value: 79, line: 213 },
        { rank: 16, name: "П. Андреев", period: null, value: 76, line: 214 },
        { rank: 17, name: "П. Ристевски", period: null, value: 75, line: 215 },
        { rank: 18, name: "Д. Савиќ", period: null, value: 74, line: 216 },
        { rank: 18, name: "С. Петковски", period: null, value: 74, line: 217 },
        { rank: 20, name: "Д. Масев", period: null, value: 70, line: 218 },
        { rank: 21, name: "А. Милушев", period: null, value: 69, line: 219 },
        { rank: 22, name: "Б. Беличев", period: null, value: 68, line: 220 },
        { rank: 22, name: "Н. Танушев", period: null, value: 68, line: 221 },
        { rank: 24, name: "Т. Ефтимов", period: null, value: 67, line: 222 },
        { rank: 25, name: "Ј. Василев", period: null, value: 62, line: 223 },
      ],
    },
  goals:
    {
      intro: "Беласица во овој период има многу големи напаѓачи. Најефикасни играчи се следниве:",
      columnLine: "Играчи/голови",
      rows: [
        { rank: 1, name: "З. Балдовалиев", period: null, value: 43, line: 227 },
        { rank: 2, name: "В. Георгиев", period: null, value: 40, line: 228 },
        { rank: 3, name: "Љ. Николиќ", period: null, value: 30, line: 229 },
        { rank: 4, name: "А. Стојановски", period: null, value: 26, line: 230 },
        { rank: 5, name: "Т. Атанасов", period: null, value: 24, line: 231 },
        { rank: 6, name: "Д. Хаџиосмановиќ", period: null, value: 20, line: 232 },
        { rank: 7, name: "Т. Ефтимов", period: null, value: 18, line: 233 },
        { rank: 8, name: "З. Трајковски", period: null, value: 16, line: 234 },
        { rank: 8, name: "Д. Савиќ", period: null, value: 16, line: 235 },
        { rank: 10, name: "В. Костов-Манго", period: null, value: 13, line: 236 },
        { rank: 10, name: "С. Пандев", period: null, value: 13, line: 237 },
        { rank: 12, name: "П. Стојанов", period: null, value: 12, line: 238 },
        { rank: 12, name: "М. Петков", period: null, value: 12, line: 239 },
        { rank: 14, name: "П. Андреев", period: null, value: 11, line: 240 },
        { rank: 14, name: "Р. Панов", period: null, value: 11, line: 241 },
        { rank: 16, name: "Ј. Василев", period: null, value: 10, line: 242 },
      ],
    },
  unrenderedDividerLines: [209],
};

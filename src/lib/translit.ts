/**
 * Latin-keyboard matching for the Cyrillic roster on /legendi.
 *
 * The archive spells every name in Macedonian Cyrillic, but a large share of
 * its readers are diaspora typing on a Latin keyboard — and there is no single
 * agreed Latin spelling of a Macedonian name. „Ѓорѓи" is written `Gjorgji`,
 * `Gorgi` and `Djorgji` by people who all mean the same man, and „Живковиќ"
 * arrives as `Zivkovic` or `Zhivkovikj` depending on who is typing.
 *
 * Folding both sides down to one ASCII key cannot express that, because the
 * choice is genuinely per-letter: „ш" is legitimately written `sh` *or* `s`.
 * So each Cyrillic letter owns a set of accepted spellings instead, and the
 * matcher walks the name letter by letter, consuming whichever spelling the
 * query actually used.
 *
 * The sets overlap deliberately — `c` reaches ц, ч and ќ; `z` reaches з, ж and
 * ѕ — so a search returns a few names beyond the one intended. That is the
 * correct failure direction for a filter over ~160 people: a reader who sees
 * one extra card loses nothing, while a reader who cannot guess the archive's
 * own spelling loses the page.
 */

/**
 * Latin spellings each Cyrillic letter accepts, longest-first at use.
 * A letter always also accepts itself, so a Cyrillic query keeps working.
 */
const VARIANTS: Record<string, readonly string[]> = {
  а: ["a"],
  б: ["b"],
  в: ["v", "w"],
  г: ["g"],
  д: ["d"],
  ѓ: ["gj", "dj", "đ", "g"],
  е: ["e"],
  ж: ["zh", "ž", "z"],
  з: ["z"],
  ѕ: ["dz", "z"],
  и: ["i", "y"],
  ј: ["j", "y", "i"],
  к: ["k", "q"],
  л: ["l"],
  љ: ["lj", "l"],
  м: ["m"],
  н: ["n"],
  њ: ["nj", "n"],
  о: ["o"],
  п: ["p"],
  р: ["r"],
  с: ["s"],
  т: ["t"],
  ќ: ["kj", "k", "ć", "tj", "c"],
  у: ["u"],
  ф: ["f"],
  х: ["kh", "h", "x"],
  ц: ["ts", "c"],
  ч: ["ch", "č", "c"],
  џ: ["dz", "dj", "dž", "j"],
  ш: ["sh", "š", "s"],
};

/**
 * The table as the matcher reads it: the letter itself prepended, and every
 * spelling sorted longest-first so `sh` is tried before `s` and a two-letter
 * spelling is never half-consumed while a longer one would have fit.
 */
const ACCEPTED = new Map<string, readonly string[]>(
  Object.entries(VARIANTS).map(([letter, spellings]) => [
    letter,
    [letter, ...spellings].sort((a, b) => b.length - a.length),
  ]),
);

/**
 * Does `query` match anywhere inside `name`, allowing Latin spellings?
 *
 * A substring match, exactly like the Cyrillic search it replaces: `risto`
 * finds the six Ристо *and* Роберт Хри**сто**вски. That is the existing,
 * correct behaviour — there is no word-boundary anchoring.
 */
export function matchesName(name: string, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase("mk");
  if (needle.length === 0) return true;

  const haystack = name.toLocaleLowerCase("mk");

  for (let start = 0; start < haystack.length; start += 1) {
    if (consume(haystack, start, needle, 0)) return true;
  }
  return false;
}

/**
 * Match `name` from character `i` against `query` from character `j`.
 *
 * Returns on the first spelling that carries the rest of the query, so a hit
 * costs one walk. A character outside the table — space, hyphen, en dash,
 * parenthesis, digit, full stop, all of which appear in roster names — matches
 * only itself rather than falling through.
 */
function consume(name: string, i: number, query: string, j: number): boolean {
  if (j === query.length) return true;
  if (i === name.length) return false;

  const letter = name[i];
  const spellings = ACCEPTED.get(letter);

  if (!spellings) {
    return query.startsWith(letter, j) && consume(name, i + 1, query, j + 1);
  }

  for (const spelling of spellings) {
    if (
      query.startsWith(spelling, j) &&
      consume(name, i + 1, query, j + spelling.length)
    ) {
      return true;
    }
  }
  return false;
}

// scripts/ingest/classify.mjs
//
// Pure, I/O-free folder-name classifier for the Phase 2.09 Drive → Sanity
// ingestion. It implements docs/content-ingestion-plan.md §3 literally —
// evaluated TOP-DOWN, FIRST MATCH WINS — and nothing else. Given one Drive
// folder name it returns what that folder is and, for seasons, the derived
// slug / title / decade. No Sanity, no filesystem: run.mjs owns all I/O.
//
// The script INVENTS NOTHING (content-truth). For a season it derives only the
// four fields a folder name deterministically implies — slug, title, decade —
// and (in run.mjs) the provisional provenance. story / finalTable / squad /
// trainers / caption / relatedPerson are never set here.
//
// Field names and formats come from the locked schema
// (src/sanity/schemaTypes/season.ts): title (string), slug (slug), decade
// (number, required).

// Macedonian quotation marks: „ = U+201E (opening, low) … “ = U+201C (closing,
// high-left). This matches the schema's own canonical example in season.ts
// (`„Сезона 1985/86“`) and the brief's locked mapping table (Task 4).
//
// NOTE (D-2.09): the single pre-existing published season was entered by hand as
// `Сезона 1992/93` with NO quotation marks. The brief locks the generated format
// WITH marks, so new titles diverge cosmetically from that one document. run.mjs
// detects `1992-93` as already-present and never rewrites it; the divergence is
// flagged for the manual editorial pass rather than silently normalised.
const Q_OPEN = "„"; // „
const Q_CLOSE = "“"; // “
const EN_DASH = "–"; // –

/**
 * The locked provisional provenance string (ingestion-plan §5 / brief Task 3),
 * verbatim, with {folderName} substituted. Set on EVERY ingested photo; a human
 * replaces it with the real provenance as rights are cleared. The photo stays a
 * draft until then (the rights gate is enforced mechanically by run.mjs).
 * @param {string} folderName the ORIGINAL (un-normalised) source folder name
 */
export function provenance(folderName) {
  return (
    `Извор: Google Drive архива на Ацо — папка ${Q_OPEN}${folderName}${Q_CLOSE}. ` +
    `Потекло и права за објавување НЕПОТВРДЕНИ (P0.2/OV-1). ` +
    `Не за јавно прикажување до потврда.`
  );
}

/** §3.0 normalisation: trim, collapse internal whitespace runs, keep Cyrillic. */
export function normalizeFolderName(name) {
  return String(name).trim().replace(/\s+/g, " ");
}

/** Start-year → decade bucket (e.g. 1985 → 1980). */
export function decadeOf(year) {
  return Math.floor(year / 10) * 10;
}

const seasonTitle = (inner) => `${Q_OPEN}Сезона ${inner}${Q_CLOSE}`;
const eraTitle = (start, end) =>
  `${Q_OPEN}Беласица ${start}${EN_DASH}${end}${Q_CLOSE}`;

// Regexes applied to the NORMALISED name.
// §3.1 owner exclude: a trailing " - не" (space, dash, optional space, не).
const RE_EXCLUDE = /\s[-–—]\s*не$/iu;
// §3.2 numbered thematic prefix: "000." "15." "25." (2–3 digits then . or space).
const RE_SECTION_PREFIX = /^\d{2,3}[.\s]/;
// Begins with a bare 4-digit year (not part of a longer number).
const RE_STARTS_YEAR = /^\d{4}(?!\d)/;
// §3.3 / §3.5 year span: YYYY <sep> (YY|YYYY) with an optional trailing label.
//   sep ∈ { - – — / ／ ⁄ }. First match wins, so this precedes the single-year
//   rule. The fullwidth solidus (U+FF0F) and fraction slash (U+2044) are included
//   because a plain "/" is illegal in a filesystem folder name, so a mirroring
//   tool sanitises the Drive folder `1950/51` to one of those look-alikes — they
//   are the SAME slash the plan documents, not a guess. Underscore is NOT
//   included (genuinely ambiguous); a `1950_51`-style folder fails loud to
//   manual-review, and the operator adds the real separator here if the mirror
//   uses one this list does not cover. (VERIFY-AGAINST-MIRROR: brief hand-off.)
const RE_SPAN = /^(\d{4})\s*[-–—/／⁄]\s*(\d{2}|\d{4})(?:\s+(.*))?$/;
// §3.4 single calendar year, with an optional trailing label.
const RE_SINGLE = /^(\d{4})(?:\s+(.*))?$/;

/**
 * Classify one folder name per ingestion-plan §3 (top-down, first match wins).
 *
 * @param {string} rawName the folder name as it appears in the mirror
 * @returns {object} one of:
 *   { kind: "skip",          folderName, reason }
 *   { kind: "thematic",      folderName, flags }
 *   { kind: "season",        folderName, seasonKind, slug, title, decade, flags }
 *   { kind: "manual-review", folderName, reason }
 */
export function classify(rawName) {
  const folderName = normalizeFolderName(rawName);

  // §3.1 — owner exclude marker "… - не". Skip entirely; create nothing.
  if (RE_EXCLUDE.test(folderName)) {
    return { kind: "skip", folderName, reason: "owner-exclude marker (- не)" };
  }

  // §3.2 — thematic: a numbered section prefix, OR anything not starting with a
  // 4-digit year. No season shell; photos link to persons/galleries by hand.
  if (RE_SECTION_PREFIX.test(folderName) || !RE_STARTS_YEAR.test(folderName)) {
    return { kind: "thematic", folderName, flags: ["needs-manual-linking"] };
  }

  // §3.3 / §3.5 — year span (era range = span whose end − start > 1).
  const span = folderName.match(RE_SPAN);
  if (span) {
    const start = parseInt(span[1], 10);
    const endToken = span[2];
    const label = span[3] ? span[3].trim() : null;

    // Resolve the numeric end year (2-digit tail completed to the start century;
    // roll the century forward on wrap, e.g. a hypothetical 1999-00 → 2000).
    let endYear;
    if (endToken.length === 4) {
      endYear = parseInt(endToken, 10);
    } else {
      endYear = Math.floor(start / 100) * 100 + parseInt(endToken, 10);
      if (endYear < start) endYear += 100;
    }

    // slug: slash/dash → dash, end token kept verbatim (2- or 4-digit), any
    // trailing label dropped (slugs are URL-safe Latin, D-0.00-4).
    const slug = `${start}-${endToken}`;
    const flags = [];
    if (label) flags.push(`label-dropped:${label}`);

    if (endYear - start > 1) {
      // §3.5 era range — provisional Беласица title; a human sets the real one.
      flags.push("manual-title");
      return {
        kind: "season",
        seasonKind: "era",
        folderName,
        slug,
        title: eraTitle(start, endYear),
        decade: decadeOf(start),
        flags,
      };
    }

    // §3.3 normal season — the title keeps the human "/" form and the end token
    // verbatim (2-digit stays 2, 4-digit stays 4: 1985/86, 1999/2000).
    return {
      kind: "season",
      seasonKind: "span",
      folderName,
      slug,
      title: seasonTitle(`${start}/${endToken}`),
      decade: decadeOf(start),
      flags,
    };
  }

  // §3.4 — single calendar year (may carry a trailing label, e.g. war years).
  const single = folderName.match(RE_SINGLE);
  if (single) {
    const year = parseInt(single[1], 10);
    const label = single[2] ? single[2].trim() : null;
    // Flagged manual-title: a lone year may be partial/uncertain and can coexist
    // with a span folder for the same season (1950 and 1950/51 both exist).
    const flags = ["manual-title"];
    if (label) flags.push(`label-dropped:${label}`);
    return {
      kind: "season",
      seasonKind: "single",
      folderName,
      slug: `${year}`,
      title: seasonTitle(`${year}`),
      decade: decadeOf(year),
      flags,
    };
  }

  // §3.6 — starts with a year but matches no rule → fail loud, never guess.
  return {
    kind: "manual-review",
    folderName,
    reason: "unmatched (begins with a 4-digit year but no season rule applied)",
  };
}

// ── Wave plan (ingestion-plan §4) ───────────────────────────────────────────
// Photos are uploaded by decade. Waves 1–8 map decades → wave number; Wave 0 is
// the season shells (handled separately in run.mjs).
export const WAVE_LABELS = {
  0: "Season shells (slug/title/decade)",
  1: "1920s–1940s",
  2: "1950s",
  3: "1960s",
  4: "1970s",
  5: "1980s",
  6: "1990s",
  7: "2000s",
  8: "2010s–2020s",
};

/** Map a season decade to its photo wave (1–8), or null if out of range. */
export function decadeToWave(decade) {
  if (decade == null || Number.isNaN(decade)) return null;
  if (decade <= 1940) return 1; // 1920s–40s (and any stray earlier)
  if (decade === 1950) return 2;
  if (decade === 1960) return 3;
  if (decade === 1970) return 4;
  if (decade === 1980) return 5;
  if (decade === 1990) return 6;
  if (decade === 2000) return 7;
  if (decade >= 2010) return 8; // 2010s–20s
  return null;
}

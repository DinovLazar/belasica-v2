import Link from "next/link";
import { decadeAnchor, decadeLabel, seasonCountLabel } from "@/lib/archive";
import { Reveal } from "@/components/home/Reveal";
import { focusOnNavy } from "@/lib/focus";

/**
 * "Разгледај по децении" — the archive entry (homepage section 5). A doorway
 * into the whole 1920-ти → 2020-ти span: one tile per decade, each deep-linking
 * to that decade's section on /arhiva (the archive renders
 * `id={decadeAnchor(decade)}` on every decade block, so `#d1980` lands there).
 *
 * Tiles are the `u-tile` role (brand.md §Components): the second navy value,
 * capped by the 6px orange bar, flipping to an orange fill with navy ink on
 * hover. The bar is a TOP edge, never a left one (brand rule 4).
 *
 * Counts are real — `seasonCountLabel` handles Macedonian pluralisation
 * („1 сезона" vs „10 сезони", D-2.02-12). Decades arrive already sorted and
 * counted from the page query; no invented spans or founding-year claims — the
 * label is derived from the published seasons themselves (content-truth).
 */
export type DecadeCount = { decade: number; count: number };

export function DecadeExplore({ decades }: { decades: DecadeCount[] }) {
  if (decades.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {decades.map(({ decade, count }, i) => (
        <Reveal as="li" key={decade} delayIndex={i % 4}>
          <Link
            href={`/arhiva#${decadeAnchor(decade)}`}
            className={`u-tile ${focusOnNavy}`}
          >
            <span className="u-h3 tabular-nums text-paper">
              {decadeLabel(decade)}
            </span>
            <span className="u-tile-meta tabular-nums">
              {seasonCountLabel(count)}
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

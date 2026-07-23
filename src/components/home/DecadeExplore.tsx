import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { decadeAnchor, decadeLabel, seasonCountLabel } from "@/lib/archive";
import { focusOnPaper } from "@/lib/focus";

/**
 * "Разгледај по децении" — the archive entry (homepage section 5). A clean
 * doorway into the whole 1920-ти → 2020-ти span: one tile per decade, each
 * deep-linking to that decade's section on /arhiva (the archive renders
 * `id={decadeAnchor(decade)}` on every decade block, so `#d1980` lands there).
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
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">
      {decades.map(({ decade, count }) => (
        <li key={decade}>
          <Link
            href={`/arhiva#${decadeAnchor(decade)}`}
            className={`group flex h-full flex-col justify-between gap-6 rounded-card border border-mist bg-white p-5 transition-transform duration-150 ease-out hover:-translate-y-0.5 ${focusOnPaper}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-serif text-h2 font-semibold text-navy tabular-nums decoration-2 underline-offset-4 group-hover:underline group-hover:decoration-orange">
                {decadeLabel(decade)}
              </span>
              <ArrowUpRight
                className="size-5 shrink-0 text-navy transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </div>
            <span className="text-small text-neutral-500">
              {seasonCountLabel(count)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

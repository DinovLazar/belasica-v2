import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

export type SeasonNeighbour = {
  title: string | null;
  slug: string | null;
};

/**
 * Previous / next season — the archive spine (D-3.04-1).
 *
 * The 2.02 handover §15 deferred this ("a natural fit for an archive spine and
 * the data supports it… not designed"); the 3.04 brief asks for it, so it is
 * built here. Ordering is `decade asc, slug.current asc` — the *slug* key, the
 * same one the archive index orders by (D-2.02-2), resolved in GROQ.
 *
 * A missing neighbour (the first and last season) renders nothing rather than
 * a disabled control: there is no season there, and a greyed-out card would
 * imply one exists. A neighbour without a title falls back to its slug — the
 * slug is real, and inventing „Сезона …" from it would be a fabricated name.
 */
export function SeasonNeighbourNav({
  previous,
  next,
}: {
  previous: SeasonNeighbour | null;
  next: SeasonNeighbour | null;
}) {
  if (!previous?.slug && !next?.slug) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {previous?.slug && (
        <li className="h-full">
          <NeighbourCard
            direction="previous"
            label="Претходна сезона"
            neighbour={previous}
          />
        </li>
      )}
      {next?.slug && (
        // Keep „Следна“ in the right-hand column even when there is no
        // „Претходна“ — the direction has to stay readable from the layout.
        <li className={cn("h-full", !previous?.slug && "sm:col-start-2")}>
          <NeighbourCard
            direction="next"
            label="Следна сезона"
            neighbour={next}
          />
        </li>
      )}
    </ul>
  );
}

function NeighbourCard({
  direction,
  label,
  neighbour,
}: {
  direction: "previous" | "next";
  label: string;
  neighbour: SeasonNeighbour;
}) {
  const isNext = direction === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={`/arhiva/${neighbour.slug}`}
      className={cn(
        // The standard card block — bar wipe + lift, no shadow (brand rule 7).
        "u-card u-card--light group flex items-center gap-4 p-5",
        isNext && "flex-row-reverse text-right",
        focusOnPaper,
      )}
    >
      <Arrow
        className={cn(
          "size-5 shrink-0 text-navy transition-transform duration-150 ease-out",
          isNext
            ? "group-hover:translate-x-0.5"
            : "group-hover:-translate-x-0.5",
        )}
        aria-hidden
      />
      <span className="min-w-0">
        <span className="block text-overline font-bold uppercase tracking-overline text-neutral-500">
          {label}
        </span>
        <span className="u-h3 mt-2 block text-navy">
          {neighbour.title ?? neighbour.slug}
        </span>
      </span>
    </Link>
  );
}

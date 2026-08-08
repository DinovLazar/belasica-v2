import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { RaznoTopic } from "@/content/razno";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

/**
 * Previous / next „Разно" topic — the same spine `SeasonNeighbourNav` gives the
 * archive (D-3.04-1), walking the seven topics in the owner's array order.
 *
 * A **copy of that component's pattern rather than a generalisation of it**
 * (D-3.16-7): `SeasonNeighbourNav` hardcodes `/arhiva/<slug>` and the two
 * „…сезона" labels, and widening it would mean editing a component that renders
 * on all 96 season pages for the sake of seven new ones. The repo already
 * settled this trade the same way at 2.06, where the person page wrote its own
 * season chips rather than widen `PersonChip`. The markup, the classes and the
 * behaviour are deliberately identical, so the two read as one pattern.
 *
 * A missing neighbour — the first topic's previous, the last topic's next —
 * renders **nothing**, never a disabled card: there is no topic there, and a
 * greyed-out card would imply one exists.
 */
export function RaznoNeighbourNav({
  previous,
  next,
}: {
  previous: RaznoTopic | null;
  next: RaznoTopic | null;
}) {
  if (!previous && !next) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {previous && (
        <li className="h-full">
          <NeighbourCard
            direction="previous"
            label="Претходна тема"
            topic={previous}
          />
        </li>
      )}
      {next && (
        // Keep „Следна" in the right-hand column even when there is no
        // „Претходна" — the direction has to stay readable from the layout.
        <li className={cn("h-full", !previous && "sm:col-start-2")}>
          <NeighbourCard direction="next" label="Следна тема" topic={next} />
        </li>
      )}
    </ul>
  );
}

function NeighbourCard({
  direction,
  label,
  topic,
}: {
  direction: "previous" | "next";
  label: string;
  topic: RaznoTopic;
}) {
  const isNext = direction === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={`/razno/${topic.slug}`}
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
        {/* `navTitle`, not `title` — the same short form the index card
            carries, so a reader walking the spine sees the name they clicked. */}
        <span className="u-h3 mt-2 block text-navy">{topic.navTitle}</span>
      </span>
    </Link>
  );
}

import Link from "next/link";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { focusOnPaper } from "@/lib/focus";

export type PersonRef = { name: string | null; slug: string | null };

/**
 * Person chip — used for the season's trainers (§6.6). Links to
 * `/legendi/<slug>`, built in 2.05; **404s until then, which is expected**.
 * The orange dot is a marker only: the label stays navy (D-1.02-1).
 */
export function PersonChip({ person }: { person: PersonRef }) {
  if (person.name == null || person.slug == null) {
    return (
      <li>
        <PlaceholderChip label="име на тренер" />
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/legendi/${person.slug}`}
        className={`group inline-flex items-center gap-2 rounded-chip border border-mist bg-white px-3.5 py-2 text-small font-medium text-navy ${focusOnPaper}`}
      >
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-orange" />
        <span className="decoration-2 underline-offset-4 group-hover:underline group-hover:decoration-orange">
          {person.name}
        </span>
      </Link>
    </li>
  );
}

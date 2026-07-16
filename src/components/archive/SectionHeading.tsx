import { cn } from "@/lib/utils";

/**
 * Section heading for the archive templates (D-2.02-3): a short orange rule
 * marker above a serif H2.
 *
 * The homepage labels its sections with a 12px overline only. A season page is
 * a long document that has to be scannable, so these five sections get a real
 * heading instead. The orange stays a *marker* (a rule, never the label's
 * colour) — orange text on paper is 2.8:1 and fails AA (D-1.02-1).
 * `SectionOverline` is unchanged and still used by the homepage.
 */
export function SectionHeading({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <span aria-hidden className="block h-0.5 w-8 bg-orange" />
      <h2
        id={id}
        className="mt-4 font-serif text-h2 font-semibold text-navy"
      >
        {children}
      </h2>
    </div>
  );
}

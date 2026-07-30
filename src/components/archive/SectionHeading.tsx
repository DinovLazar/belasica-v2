import { cn } from "@/lib/utils";
import { SectionOverline } from "@/components/home/SectionOverline";

/**
 * Section heading for the archive templates (D-2.02-3).
 *
 * A season page is a long document that has to be scannable, so its five
 * sections get a real H2 rather than the homepage's label alone. The label
 * is optional and, when given, renders above the heading as the standard
 * `u-label` (orange bar + tracked caps) so a section on a season page opens
 * exactly like a section on the homepage.
 */
export function SectionHeading({
  children,
  id,
  label,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  /** Optional kicker above the heading — e.g. „Сезона". */
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {label ? (
        <SectionOverline>{label}</SectionOverline>
      ) : (
        // No kicker: the orange bar still opens the section, as the marker
        // that every heading on the site carries.
        <span aria-hidden className="block h-2 w-7 bg-orange" />
      )}
      <h2 id={id} className="u-h2 mt-5 text-navy">
        {children}
      </h2>
    </div>
  );
}

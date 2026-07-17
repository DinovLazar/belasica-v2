import { cn } from "@/lib/utils";
import { ROLE_LABEL, type PersonRole } from "@/lib/people";

/**
 * A person's roles as chips — shared by `LegendCard` (§6.1) and `PersonHero`
 * (§6.3) so the two can never drift apart.
 *
 * **All** of a multi-role person's roles are shown (D-2.05-2): they are placed
 * in exactly one band, and these chips are what keeps the roles they were *not*
 * placed under visible. `roles` arrives priority-ordered from `orderedRoles`, so
 * `[0]` is the role that placed them and takes the filled navy chip; the rest
 * are muted outlines.
 *
 * The role name is always spelled out — the chips never encode a role in colour
 * alone (§6.3 a11y).
 */
export function RoleChips({
  roles,
  className,
  onNavy = false,
}: {
  roles: PersonRole[];
  className?: string;
  /** Set on the navy hero band, where the light chips would vanish. */
  onNavy?: boolean;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {roles.map((role, i) => (
        <li key={role}>
          <span
            className={cn(
              "inline-flex items-center rounded-chip px-2.5 py-1 text-small font-medium",
              i === 0
                ? // Primary — the role that placed this person.
                  onNavy
                  ? // Navy-on-navy is invisible, so invert: paper fill, navy
                    // label (13.0:1).
                    "bg-paper text-navy"
                  : // Navy fill, paper label — 13.0:1 on the white card.
                    "bg-navy text-paper"
                : // Secondary — muted, but still ≥ 4.5:1 either way:
                  // neutral-700 on paper is 10.4:1; paper on navy is 13.0:1.
                  onNavy
                  ? "border border-paper/30 text-paper"
                  : "border border-mist bg-paper text-neutral-700",
            )}
          >
            {ROLE_LABEL[role]}
          </span>
        </li>
      ))}
    </ul>
  );
}

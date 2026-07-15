import { cn } from "@/lib/utils";

/**
 * Section overline. Brand rule D-1.02-1: orange never carries text on the
 * paper surface (2.8:1 fails AA). So:
 *  - onPaper  → short orange rule (marker) + navy overline text.
 *  - onNavy   → orange overline text (4.6:1 on navy passes AA), no rule.
 * See brand.md §Color and the Phase 1.05 handover §Layout.
 */
export function SectionOverline({
  children,
  variant = "onPaper",
  className,
}: {
  children: React.ReactNode;
  variant?: "onPaper" | "onNavy";
  className?: string;
}) {
  if (variant === "onNavy") {
    return (
      <p
        className={cn(
          "text-overline font-semibold uppercase tracking-overline text-orange",
          className,
        )}
      >
        {children}
      </p>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span aria-hidden className="h-0.5 w-8 shrink-0 bg-orange" />
      <p className="text-overline font-semibold uppercase tracking-overline text-navy">
        {children}
      </p>
    </div>
  );
}

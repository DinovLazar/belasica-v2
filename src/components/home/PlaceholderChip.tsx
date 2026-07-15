import { cn } from "@/lib/utils";

/**
 * Placeholder chip — brand.md §Components: dashed mist border, hatched fill,
 * mono `[PLACEHOLDER: …]` text. The one legal way to show a missing required
 * display fact (facts.md / content-truth). Never invent content in its place.
 * The hatch + paper background keep it legible on paper and on mist greyboxes.
 */
export function PlaceholderChip({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "placeholder-hatch inline-flex max-w-full items-center rounded-chip border border-dashed border-mist bg-paper px-2 py-1 font-mono text-small text-neutral-700",
        className,
      )}
    >
      [PLACEHOLDER: {label}]
    </span>
  );
}

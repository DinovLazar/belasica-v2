import { cn } from "@/lib/utils";

/**
 * Centres content at the brand max-width (1248px) and applies the page
 * gutters (20px mobile / 32px desktop). The single place those layout
 * tokens live for the whole shell — brand.md §Spacing & layout.
 *
 * Note this wraps the *content* of a block, never the block itself: in this
 * direction a block is full-bleed and its colour runs edge to edge, so the
 * background belongs on the <section> and the Container sits inside it.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-page px-5 md:px-8", className)}>
      {children}
    </div>
  );
}

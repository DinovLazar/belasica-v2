import { cn } from "@/lib/utils";

/**
 * Centres content at the brand max-width (1200px) and applies the page
 * gutters (20px mobile / 40px desktop). The single place those layout
 * tokens live for the whole shell.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-page px-5 md:px-10", className)}>
      {children}
    </div>
  );
}

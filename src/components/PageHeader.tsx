import { Container } from "@/components/Container";
import { Breadcrumb, type Crumb } from "@/components/archive/Breadcrumb";

/**
 * The page-opening block every inner page inherits — brand.md §Components
 * („Hero": the badge/title block is the reusable pattern a season-page or
 * person-page hero inherits).
 *
 * A navy block carrying breadcrumb → H1 → intro → meta. It sits directly under
 * the navy site header, so the two read as one deep band opening the page,
 * with the H1's size carrying the hierarchy rather than a divider. Anything
 * that sticks below it (the archive's decade rail) is `navy-2`, so the bands
 * stay legible as separate objects, and the page's content blocks are paper.
 *
 * `meta` is for counts and other figures derived from published documents. It
 * is never invented and is omitted entirely rather than rendered as zero.
 */
export function PageHeader({
  title,
  crumbs,
  intro,
  meta,
  children,
  crumbStructuredData = true,
}: {
  title: string;
  crumbs: Crumb[];
  /** Structural copy describing the page — never a claim about the club. */
  intro?: string;
  /** A counted figure, e.g. „96 сезони · 11 децении". */
  meta?: React.ReactNode;
  /** Extra content inside the block, below the meta line. */
  children?: React.ReactNode;
  /** Forwarded to `Breadcrumb`. Off on the 404 and error pages (3.23, B6). */
  crumbStructuredData?: boolean;
}) {
  return (
    <header className="bg-navy">
      <Container className="py-section">
        <Breadcrumb
          items={crumbs}
          onNavy
          structuredData={crumbStructuredData}
        />
        <h1 className="u-h1 mt-6 text-paper">{title}</h1>
        {intro && (
          <p className="mt-5 max-w-measure text-body-l text-paper/80">
            {intro}
          </p>
        )}
        {meta && (
          <p className="mt-5 text-overline font-bold uppercase tracking-overline tabular-nums text-paper/80">
            {meta}
          </p>
        )}
        {children}
      </Container>
    </header>
  );
}

/**
 * The site's own address — one source of truth (Phase 3.23, closing PL-4).
 *
 * Until now `https://belasica-v2.vercel.app` was hardcoded in **three** files —
 * `src/app/layout.tsx` (`metadataBase`), `src/app/robots.ts` and
 * `src/app/sitemap.ts` — kept in step by a comment in each asking the next
 * editor to remember the other two. That is the whole of PL-4, and it is the
 * last item on the placeholder register.
 *
 * **The default deliberately stays the Vercel origin.** `www.belasicahistory.mk`
 * is VERIFIED in `facts.md` and is named on `/pravni-informacii`, but DNS does
 * not point at Vercel yet. A canonical tag and a sitemap advertising a host that
 * does not resolve are worse than none, so the cutover is a one-variable Ops
 * step and not a code change:
 *
 *     NEXT_PUBLIC_SITE_URL=https://www.belasicahistory.mk
 *
 * ⚠️ `NEXT_PUBLIC_*` is inlined at **build time**, so setting the variable on
 * Vercel takes effect on the next deploy — changing it alone does nothing.
 *
 * ⚠️ **A fourth place still needs updating by hand at cutover:**
 * `public/llms.txt`. It is a static file served straight off disk, so it cannot
 * import this constant and its URLs are written out in full. Nothing enforces
 * that mechanically — this note is the enforcement.
 *
 * The trailing slash is stripped so callers can concatenate paths (`${SITE_URL}/arhiva`)
 * without producing a double slash if someone sets the variable with one.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://belasica-v2.vercel.app";

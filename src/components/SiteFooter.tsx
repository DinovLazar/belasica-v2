import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { Container } from "@/components/Container";

// Focus: orange 2px ring, 2px offset against the light footer surface.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-footer";

export function SiteFooter() {
  return (
    <footer className="border-t border-mist bg-footer text-ink">
      <Container className="py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-measure">
            <Link
              href="/"
              className={cn("inline-flex items-center gap-2.5 rounded-card", focusRing)}
            >
              {/* Crest on a white tile (matches the header treatment). */}
              <span className="flex shrink-0 items-center rounded-card bg-white p-1">
                <Image
                  src="/crest.png"
                  alt=""
                  width={40}
                  height={57}
                  className="h-9 w-auto"
                />
              </span>
              <span className="font-serif text-h3 font-semibold tracking-tight text-navy">
                ФК Беласица
              </span>
            </Link>
            <p className="mt-4 text-overline uppercase tracking-overline text-neutral-700">
              неофицијална архива
            </p>
            <p className="mt-3 text-small text-neutral-700">
              Ова е неофицијална архива посветена на ФК Беласица. Не е
              официјалната страница на клубот.
            </p>
          </div>

          <nav aria-label="Подножје" className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-sans text-small text-navy underline-offset-4 decoration-2 transition-colors hover:underline hover:decoration-orange",
                  focusRing,
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}

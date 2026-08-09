"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { JumpNav } from "@/components/JumpNav";
import { PageHeader } from "@/components/PageHeader";
import { focusOnNavy } from "@/lib/focus";
import {
  BAND_ANCHOR,
  BAND_TITLE,
  personCountLabel,
  type PersonRole,
} from "@/lib/people";
import { matchesName } from "@/lib/translit";
import type { LegendCardData } from "./LegendCard";
import { RoleBandGrid } from "./RoleBandGrid";

export type LegendBand = { role: PersonRole; people: LegendCardData[] };

/**
 * The whole of /legendi below the site header: the navy page-header block and
 * the bands under it.
 *
 * **It owns the header** as of 3.10 (D-3.10-2). The search field used to open
 * the paper section, which left a wide empty band between the navy header and
 * the first orange band rule. Moving the field into the header closes that gap
 * — and because the input and the filtered list share one component, they can
 * still share state without lifting it into a context or the URL.
 *
 * The roster is small enough to ship whole (one Sanity read on the server), so
 * the filter runs in the browser against the already-rendered list: no request
 * per keystroke, no loading state, and the page still renders every person
 * with JS off — the input is the only thing that needs JS.
 *
 * Placement stays a server decision: this receives the bands already built and
 * name-sorted, and only hides the people whose name does not match. Because
 * `RoleBandGrid` renders nothing when its list is empty, a band with no match
 * disappears on its own — no „0 играчи" heading can appear mid-search.
 *
 * Matching is on **name only**, and accepts Latin spellings (`@/lib/translit`).
 * Role and years are visible on the card but are not searched: a query like
 * „играч" would otherwise return the whole band and read as a broken search
 * rather than a filter.
 */
export function LegendsBrowser({ bands }: { bands: LegendBand[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const needle = normalise(query);
  const searching = needle.length > 0;

  const visible = useMemo(() => {
    if (!needle) return bands;
    return bands.map((band) => ({
      role: band.role,
      people: band.people.filter((person) =>
        matchesName(person.name ?? "", needle),
      ),
    }));
  }, [bands, needle]);

  const matches = visible.reduce((sum, band) => sum + band.people.length, 0);
  const leadRole = visible.find((band) => band.people.length > 0)?.role;

  // Built from `visible`, not from `bands`: a band that filtered down to nobody
  // renders nothing (`RoleBandGrid` self-omits), so a rail built from the full
  // roster would point at a `<section id>` that is not in the document. A search
  // that leaves only one band standing leaves one item, and `JumpNav` declines
  // to render a rail of one. Labels come from `BAND_TITLE`, never retyped, so a
  // band's heading and its rail link cannot drift apart (D-3.13-1).
  const railItems = visible
    .filter((band) => band.people.length > 0)
    .map((band) => ({
      id: BAND_ANCHOR[band.role],
      label: BAND_TITLE[band.role],
    }));

  // The archive total, not the filtered count — the live result count below the
  // input already reports the filter. Counted from the bands themselves, so it
  // can only ever state what the page actually renders.
  const placed = bands.reduce((sum, band) => sum + band.people.length, 0);

  return (
    <>
      <PageHeader
        title="Легенди"
        crumbs={[{ label: "Почетна", href: "/" }, { label: "Легенди" }]}
        // Structural copy — describes the page, claims no fact about the club.
        intro="Играчите, тренерите и раководството што го обележале клубот низ годините."
        meta={personCountLabel(placed)}
      >
        {/* Full width on a phone, where `max-w-md` would strand the field mid
            -row; capped from `sm` up so it stays a field rather than a banner. */}
        <div className="mt-8 w-full sm:max-w-md">
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-small font-bold text-paper"
          >
            Пребарај по име
          </label>

          <div className="relative">
            {/* Decorative — the label above names the field. */}
            <SearchGlyph />

            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Име или презиме"
              autoComplete="off"
              // The surface stays white so it still reads as an input against
              // the navy block; its own text and placeholder are therefore
              // measured against white, not against navy.
              //
              // The browser's own clear affordance is suppressed so there is one
              // clear button rather than two side by side.
              className={cn(
                "block w-full border border-mist bg-white py-2.5 pl-10 pr-10 text-body text-ink",
                "placeholder:text-neutral-500",
                "[&::-webkit-search-cancel-button]:appearance-none",
                focusOnNavy,
              )}
            />

            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className={cn(
                  "absolute inset-y-0 right-0 flex w-10 items-center justify-center",
                  "text-paper/80 hover:text-paper",
                  focusOnNavy,
                )}
              >
                <span className="sr-only">Исчисти го пребарувањето</span>
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              </button>
            )}
          </div>

          {/* Announced on change, so a screen-reader user hears the list shrink
              instead of discovering it. Empty (but present) before the first
              keystroke — a region added later is not announced. */}
          <p
            aria-live="polite"
            className="mt-2 min-h-5 text-small tabular-nums text-paper/80"
          >
            {searching ? resultLabel(matches) : null}
          </p>
        </div>
      </PageHeader>

      <JumpNav items={railItems} ariaLabel="Скок по улога" />

      <Container className="py-section">
        {searching && matches === 0 ? (
          <p className="border border-mist bg-white p-5 text-body text-neutral-700">
            Нема личност со такво име во архивата.
          </p>
        ) : (
          <div className="flex flex-col gap-section">
            {visible.map((band) => (
              <RoleBandGrid
                key={band.role}
                role={band.role}
                people={band.people}
                headingId={`band-${band.role}`}
                anchorId={BAND_ANCHOR[band.role]}
                // The first band with anything in it leads the page, so its first
                // card carries the LCP. `RoleBandGrid` renders nothing when its
                // list is empty, so „first non-empty" is also „first visible" —
                // and during a search that correctly follows the results.
                leadsPage={band.role === leadRole}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

/**
 * Case-folded for Macedonian — now only to answer „is the user searching at
 * all". The match itself lives in `@/lib/translit`, which folds both sides
 * again on its own terms, because a Latin query and a Cyrillic name cannot be
 * compared through a single normalised key.
 */
function normalise(value: string): string {
  return value.trim().toLocaleLowerCase("mk");
}

/** Same singular rule as the band counts (D-2.02-12): only 1 takes the singular. */
function resultLabel(count: number): string {
  return `${count} ${count === 1 ? "резултат" : "резултати"}`;
}

function SearchGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-neutral-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M13.5 13.5L18 18" strokeLinecap="square" />
    </svg>
  );
}

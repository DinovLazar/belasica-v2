"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { focusOnPaper } from "@/lib/focus";
import type { PersonRole } from "@/lib/people";
import type { LegendCardData } from "./LegendCard";
import { RoleBandGrid } from "./RoleBandGrid";

export type LegendBand = { role: PersonRole; people: LegendCardData[] };

/**
 * Search + bands for /legendi.
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
 * Matching is on **name only**. Role and years are visible on the card but are
 * not searched: a query like „играч" would otherwise return the whole band and
 * read as a broken search rather than a filter.
 */
export function LegendsBrowser({ bands }: { bands: LegendBand[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const needle = normalise(query);

  const visible = useMemo(() => {
    if (!needle) return bands;
    return bands.map((band) => ({
      role: band.role,
      people: band.people.filter((person) =>
        normalise(person.name ?? "").includes(needle),
      ),
    }));
  }, [bands, needle]);

  const matches = visible.reduce((sum, band) => sum + band.people.length, 0);
  const searching = needle.length > 0;

  return (
    <div className="flex flex-col gap-section">
      <div className="max-w-md">
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-small font-bold text-navy"
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
            // The browser's own clear affordance is suppressed so there is one
            // clear button rather than two side by side.
            className={cn(
              "block w-full border border-mist bg-white py-2.5 pl-10 pr-10 text-body text-ink",
              "placeholder:text-neutral-500",
              "[&::-webkit-search-cancel-button]:appearance-none",
              focusOnPaper,
            )}
          />

          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className={cn(
                "absolute inset-y-0 right-0 flex w-10 items-center justify-center",
                "text-neutral-500 hover:text-navy",
                focusOnPaper,
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
          className="mt-2 min-h-5 text-small tabular-nums text-neutral-500"
        >
          {searching ? resultLabel(matches) : null}
        </p>
      </div>

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
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Case-folded for Macedonian. No diacritic stripping: Macedonian Cyrillic has
 * no combining marks — „ѓ" and „ќ" are their own letters, and folding them onto
 * „г"/„к" would match names the reader did not type.
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

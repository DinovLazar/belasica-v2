/**
 * Bounded-retry wrapper around the public read client — build resilience for
 * the two templates that fan out over the whole archive (Phase 3.02F-Code).
 *
 * **The problem it solves.** `generateStaticParams` now produces ~96 season
 * pages and ~160 person pages, so a single `npm run build` makes several
 * hundred round trips to `apicdn.sanity.io`. D-3.05a-9 recorded that flake as
 * real and reproducible: four of eight builds died with a
 * `ConnectTimeoutError` on a *different* random season each time, and a plain
 * `curl` to the same host failed at that moment and succeeded minutes later.
 * One transient socket among hundreds should not fail a Vercel deploy.
 *
 * **Retry, then fail loudly.** Three attempts with a short backoff clears a
 * transient timeout. If all three fail, this throws with the failing slug and
 * the underlying error attached — a build that stops with a name in the
 * message is strictly better than one that succeeds and quietly ships an
 * archive page missing half its sections, or a 404 where a season exists.
 *
 * **What it is NOT for.** A query that legitimately matches nothing resolves
 * to `null` and is not an error — the caller still decides whether that means
 * `notFound()`. Only a thrown read failure reaches the retry path.
 */
import { client } from "./client";

/**
 * Five, not the three the brief estimated — **measured, not assumed**
 * (D-3.02F-C-2). Three attempts was tried first and two of three consecutive
 * 270-page builds still died, each after exhausting all three on a different
 * random page (`/arhiva/1971-72`, `/legendi/zlatko-ilievski`). The failure is
 * always the same: `Connect Timeout Error … apicdn.sanity.io:443, timeout:
 * 10000ms`. Because undici burns its own 10s connect timeout per attempt, the
 * real question is how long the wobble lasts, and a 3-attempt window (~32s)
 * measurably does not outlive it.
 */
const ATTEMPTS = 5;

/** Exponential backoff before attempts 2–5. With undici's 10s connect timeout
 *  on top, the window a single page will wait out is ~65s. Only a page that
 *  actually hits a wobble pays anything; a healthy read retries zero times. */
const BACKOFF_MS = [1000, 2000, 4000, 8000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function describe(error: unknown): string {
  if (error instanceof Error) {
    // `cause` carries the real socket error on undici failures; without it the
    // message is often just „fetch failed", which names nothing actionable.
    const cause = error.cause;
    const causeText =
      cause instanceof Error ? ` (cause: ${cause.message})` : "";
    return `${error.name}: ${error.message}${causeText}`;
  }
  return String(error);
}

/**
 * Read from Sanity, retrying transient failures, and throw a named error if
 * every attempt fails.
 *
 * @param label What is being read, in the build log's own terms — e.g.
 *   `season „1963-64"`. This is the whole point of the helper: the thrown
 *   message says which page died, which the raw prerender error does not.
 */
export async function fetchOrThrow<T>(
  query: string,
  params: Record<string, unknown>,
  label: string,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      return await client.fetch<T>(query, params);
    } catch (error) {
      lastError = error;
      // Log every retry. A silent retry hides the very flake this exists for;
      // in a Vercel build log these lines are the evidence that the CDN wobbled
      // and the build absorbed it.
      console.warn(
        `[sanity] read attempt ${attempt}/${ATTEMPTS} failed for ${label} — ${describe(error)}`,
      );
      if (attempt < ATTEMPTS) {
        await sleep(BACKOFF_MS[attempt - 1]);
      }
    }
  }

  throw new Error(
    `Sanity read failed for ${label} after ${ATTEMPTS} attempts — ${describe(lastError)}`,
    { cause: lastError },
  );
}

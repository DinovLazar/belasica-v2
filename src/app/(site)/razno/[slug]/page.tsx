import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/home/Reveal";
import { RaznoNeighbourNav } from "@/components/razno/RaznoNeighbourNav";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";
import {
  RAZNO_SOURCE_CREDIT,
  RAZNO_TITLE,
  RAZNO_TOPICS,
  raznoNeighbours,
  raznoTopic,
  type RaznoBlock,
  type RaznoBlockKind,
} from "@/content/razno";

/**
 * /razno/<slug> — one topic, transcribed from Аце Стојанов's book.
 *
 * **Static, like the index**: the copy is a build-time constant, so there is no
 * Sanity read and no `revalidate` (D-3.07-8's reasoning). All seven pages are
 * prerendered from `RAZNO_TOPICS`, which is also what the index grid and the
 * prev/next spine read — so the three can never disagree about how many topics
 * exist or what order they are in.
 *
 * Every page ends with the same source line. That is what makes the claims here
 * **attributed** — they are the book's assertions, named as such, which is why
 * they need no `facts.md` entry of their own (brief decision 5).
 */

export function generateStaticParams() {
  return RAZNO_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = raznoTopic(slug);
  if (!topic) return {};
  return { title: topic.title, description: topic.metaDescription };
}

/**
 * Consecutive blocks of the same kind, in source order.
 *
 * Only `record` actually groups — a run of them is ONE list, so the hairlines
 * fall between rows of the same list rather than around each line. `para` and
 * `closing` are their own runs so each keeps its own rhythm.
 */
type Run = { kind: RaznoBlockKind; blocks: RaznoBlock[] };

function toRuns(blocks: RaznoBlock[]): Run[] {
  return blocks.reduce<Run[]>((runs, block) => {
    const last = runs.at(-1);
    if (last && last.kind === "record" && block.kind === "record") {
      last.blocks.push(block);
      return runs;
    }
    runs.push({ kind: block.kind, blocks: [block] });
    return runs;
  }, []);
}

export default async function RaznoTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = raznoTopic(slug);

  // An unknown slug is a 404, never an empty page. `generateStaticParams`
  // already fixes the seven, so this only fires for a hand-typed URL.
  if (!topic) notFound();

  const runs = toRuns(topic.blocks);
  const { previous, next } = raznoNeighbours(topic.slug);

  return (
    <>
      <PageHeader
        title={topic.title}
        crumbs={[
          { label: "Почетна", href: "/" },
          { label: RAZNO_TITLE, href: "/razno" },
          { label: topic.title },
        ]}
      />

      {/* One editorial column at the reading measure — this is a chapter of a
          book, read end to end, not a data document. The first section takes no
          top rule: the navy header block's colour change already terminates
          that edge (brand.md — a block boundary is a colour change, not a
          border). */}
      {/* Deliberately unlabelled. A named `<section>` is a `region` landmark,
          and naming this one after the topic would announce „Куп на УЕФА
          region" straight after „Куп на УЕФА heading level 1" — a duplicate
          landmark for the page's only body. The navigation section below IS
          named, because it is a genuinely separate region (D-3.16-8). */}
      <section className="py-section">
        <Container>
          <div className="max-w-measure">
            {runs.map((run, i) => (
              <Reveal
                key={run.blocks[0].line}
                className={i === 0 ? undefined : "mt-8"}
              >
                <BlockRun run={run} />
              </Reveal>
            ))}

            {/* Provenance, not prose: the quiet register the archive uses for a
                photo credit, set apart by a hairline rather than a heading. It
                is rendered on every one of the seven pages, from one constant,
                never reworded per topic. */}
            <Reveal>
              <p className="mt-12 border-t border-mist pt-6 text-small text-neutral-500">
                {RAZNO_SOURCE_CREDIT}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Prev/next + back-link — navigation, not content. Mirrors the season
          page's tail exactly (D-3.04-1). */}
      <section
        aria-label="Навигација низ темите"
        className="border-t border-mist py-section"
      >
        <Container>
          <Reveal>
            <RaznoNeighbourNav previous={previous} next={next} />
          </Reveal>
          <ul
            className={cn("flex flex-col gap-3", (previous || next) && "mt-10")}
          >
            <li>
              <Link
                href="/razno"
                className={`u-link text-navy ${focusOnPaper}`}
              >
                Сите теми
              </Link>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}

/** One run of blocks. Nothing here reformats the text — it renders verbatim. */
function BlockRun({ run }: { run: Run }) {
  if (run.kind === "record") {
    // The `SeasonRecordList variant="results"` cadence: one hairline-separated
    // row per line, `tabular-nums` so the scorelines stand in visual columns
    // without imposing a table the source text does not have. Rendered
    // directly rather than through that component — these are plain strings,
    // not Portable Text, and wrapping them in fake blocks to reuse a renderer
    // would be the long way round (D-3.16-6).
    return (
      <div className="tabular-nums text-neutral-700">
        {run.blocks.map((block) => (
          <p
            key={block.line}
            className="border-b border-mist py-2.5 text-body last:border-b-0"
          >
            {block.text}
          </p>
        ))}
      </div>
    );
  }

  if (run.kind === "closing") {
    // „НАПРЕД БЕЛАСИЦА!" — the chapter's own closing shout. Set apart in the
    // white block capped by the 6px orange top bar that /za-nas and the season
    // page already use for a set-apart statement (brand rule 4: the bar bands a
    // block along its TOP edge, never as a left-hand accent).
    return (
      <div className="u-cap bg-white p-6 md:p-8">
        {run.blocks.map((block) => (
          <p key={block.line} className="u-h3 text-navy">
            {block.text}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="text-body-l text-neutral-700 [&>*:first-child]:mt-0">
      {run.blocks.map((block) => (
        <p key={block.line} className="mt-6">
          {block.text}
        </p>
      ))}
    </div>
  );
}

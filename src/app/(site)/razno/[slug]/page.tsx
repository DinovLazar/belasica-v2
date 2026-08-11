import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/home/Reveal";
import { RaznoNeighbourNav } from "@/components/razno/RaznoNeighbourNav";
import { RaznoPhotoGrid } from "@/components/razno/RaznoPhotoGrid";
import { SectionHeading } from "@/components/archive/SectionHeading";
import {
  SeasonAnchorNav,
  type SeasonAnchor,
} from "@/components/archive/SeasonAnchorNav";
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
  type RaznoTopic,
} from "@/content/razno";
import type { RaznoPhoto } from "@/content/razno-photos";

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

/**
 * The two sections a topic can split into, and the anchor rail built from them
 * (3.19, owner instruction: „како што е кај архивата").
 *
 * Mirrors the season page's `SECTIONS` map, including its governing rule —
 * **only sections that actually hold something appear**, and the rail is built
 * from whatever survives that filter. Разно has no results, no table and no
 * squad, so the split it can honestly carry is prose vs. the book's lists.
 *
 * „Фотографии" is the third entry this file's 3.19 note anticipated, and it
 * lands on the same governing rule as the other two: it appears only where the
 * topic actually has photographs, never as an empty frame. All seven currently
 * do — so all seven now hold at least two sections and every one of them shows
 * the rail, including the four that were a single unbroken read before (the
 * owner's „нека ги има сите горе, како што е кај архивата").
 *
 * It always sorts LAST, after the book's own text, mirroring the season page
 * where „Фотографии" is the final content section.
 */
const SECTIONS = {
  overview: { id: "pregled", label: "Преглед", heading: "Преглед" },
  records: { id: "rekordi", label: "Рекорди", heading: "Рекорди" },
  photos: { id: "fotografii", label: "Фотографии", heading: "Фотографии" },
} as const;

/**
 * A section is either a slice of the chapter or the topic's photographs — the
 * two render at different widths and share no markup, so they are distinct
 * shapes rather than one shape with an empty half.
 */
type TopicSection =
  | { key: "overview" | "records"; blocks: RaznoBlock[] }
  | { key: "photos"; photos: RaznoPhoto[] };

/**
 * Split a topic at its FIRST `record` block — never by filtering kinds.
 *
 * These pages are a verbatim transcription of a printed chapter, so source
 * order is content: „Куп на УЕФА" and „Партизан" both interleave prose with
 * their lists, and gathering every `record` under one heading would silently
 * reorder the author's text. Cutting once, at the point the chapter turns from
 * narrative to lists, keeps every line where the book put it — the prose that
 * sits between two runs of records simply belongs to „Рекорди", which is what
 * it reads as anyway.
 *
 * A topic with no records is one section, so `SeasonAnchorNav` suppresses
 * itself and the page renders exactly as it did before — the right outcome for
 * a chapter that is a single unbroken read.
 */
function toSections(topic: RaznoTopic): TopicSection[] {
  const { blocks } = topic;
  const firstRecord = blocks.findIndex((block) => block.kind === "record");

  const prose: TopicSection[] =
    firstRecord < 0
      ? [{ key: "overview", blocks }]
      : (
          [
            { key: "overview", blocks: blocks.slice(0, firstRecord) },
            { key: "records", blocks: blocks.slice(firstRecord) },
          ] as TopicSection[]
        ).filter((section) => "blocks" in section && section.blocks.length > 0);

  const photos = topic.photos ?? [];
  return photos.length > 0
    ? [...prose, { key: "photos", photos }]
    : prose;
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

  const sections = toSections(topic);
  const { previous, next } = raznoNeighbours(topic.slug);

  // One section is not a document with parts — it is the chapter itself. In
  // that case the rail suppresses itself (< 2 anchors) and the headings are
  // suppressed with it, so a prose-only topic is not given a „Преглед" heading
  // that names the page a second time, right under its own H1.
  //
  // Since 3.20 no live topic takes that branch: all seven have photographs, so
  // every one of them holds at least „Преглед" + „Фотографии". The guard stays
  // because the condition it guards is a property of the DATA, not a constant —
  // a topic added without pictures and without records must still render.
  const isSplit = sections.length > 1;

  // The source line credits the BOOK, so it closes the book's own text — the
  // last prose section — not the page. Hanging it under „Фотографии" would
  // read as attributing the photographs to Аце Стојанов's chapter, which is a
  // provenance claim nobody has made.
  const lastProseIndex = sections.reduce(
    (last, section, i) => (section.key === "photos" ? last : i),
    0,
  );
  const anchors: SeasonAnchor[] = sections.map((section) => ({
    id: SECTIONS[section.key].id,
    label: SECTIONS[section.key].label,
  }));

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

      {/* Sits directly under the navy `PageHeader`, `navy-2` on navy, exactly
          as it does under the season page's title band. Self-suppressing below
          two anchors — which, since „Фотографии" landed, no topic trips: all
          seven now carry the rail, which is what the owner asked for („нека ги
          има сите горе, како што е кај архивата"). */}
      <SeasonAnchorNav anchors={anchors} label="Скок низ темата" />

      {/* One editorial column at the reading measure — this is a chapter of a
          book, read end to end, not a data document. The first section takes no
          top rule: the navy block above it (header, or the rail) already
          terminates that edge by colour change (brand.md — a block boundary is
          a colour change, not a border).

          D-3.16-8 kept this body deliberately unlabelled, because a lone
          `<section>` named after the topic would announce „Куп на УЕФА region"
          straight after „Куп на УЕФА heading level 1". That reasoning holds
          only while there is ONE body region: where the chapter splits, the two
          parts are genuinely separate regions with their own headings, named
          „Преглед" and „Рекорди" rather than after the page — so they are
          labelled, and the unsplit case still is not. */}
      {sections.map((section, index) => {
        const meta = SECTIONS[section.key];
        const headingId = `${meta.id}-heading`;

        return (
          <section
            key={meta.id}
            id={isSplit ? meta.id : undefined}
            aria-labelledby={isSplit ? headingId : undefined}
            className={cn(
              "scroll-mt-header py-section",
              index > 0 && "border-t border-mist",
            )}
          >
            <Container>
              {isSplit && (
                <Reveal className="mb-8">
                  <SectionHeading id={headingId}>{meta.heading}</SectionHeading>
                </Reveal>
              )}

              {section.key === "photos" ? (
                /* Deliberately OUTSIDE `max-w-measure`: the reading measure is
                   for the chapter's text; the gallery takes the full page
                   wrap, exactly as the season page's „Фотографии" does. */
                <RaznoPhotoGrid
                  photos={section.photos}
                  label={`Фотографии — ${topic.title}`}
                />
              ) : (
                <div className="max-w-measure">
                  {toRuns(section.blocks).map((run, i) => (
                    <Reveal
                      key={run.blocks[0].line}
                      className={i === 0 ? undefined : "mt-8"}
                    >
                      <BlockRun run={run} />
                    </Reveal>
                  ))}

                  {/* Provenance, not prose: the quiet register the archive uses
                      for a photo credit, set apart by a hairline rather than a
                      heading. Once per page — closing the book's own text —
                      from one constant, never reworded per topic. */}
                  {index === lastProseIndex && (
                    <Reveal>
                      <p className="mt-12 border-t border-mist pt-6 text-small text-neutral-500">
                        {RAZNO_SOURCE_CREDIT}
                      </p>
                    </Reveal>
                  )}
                </div>
              )}
            </Container>
          </section>
        );
      })}

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

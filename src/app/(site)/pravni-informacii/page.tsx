import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/home/Reveal";
import { focusOnPaper } from "@/lib/focus";
import { CONTACT_EMAIL } from "@/lib/facts";

/**
 * /pravni-informacii — the archive's legal statement.
 *
 * A **static server component**: no Sanity read, no client component, no
 * `revalidate`. Every route around it carries `revalidate = 60` to match
 * D-1.05-4, but that value only means anything to a page that fetches — this
 * one is a build-time constant and an ISR window on it would be noise.
 *
 * The page is deliberately reachable only from the **footer** (D-3.07-2): it
 * belongs on every page without competing with the six real nav destinations,
 * so `src/lib/nav.ts` and `SiteHeader` are untouched. It is indexable — a
 * takedown notice nobody can find is not a takedown notice.
 *
 * Copy is owner-supplied and final (Phase 3.07 brief §Copy), rendered verbatim
 * from `SECTIONS` below. Two values inside it are `facts.md` entries VERIFIED
 * on 2026-07-31: the domain in §1 and `CONTACT_EMAIL` in §10.
 */

export const metadata: Metadata = {
  // Its own path, relative — resolved against `metadataBase`, so the
  // domain cutover stays one environment variable (3.23, B2).
  alternates: { canonical: "/pravni-informacii" },
  title: "Правни информации",
  description:
    "Правни информации за неофицијалната архива на ФК Беласица — авторски права, точност на податоците и барање за отстранување материјал.",
};

/**
 * The page's visible text, verbatim.
 *
 * Held as data rather than as ten hand-written JSX sections so the wording can
 * be diffed against the brief mechanically, and so every section renders
 * through one code path — a legal page whose §7 is styled differently from its
 * §4 invites the reader to weigh them differently.
 */
type Block =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  /** §10's contact address — the one link in the copy (`mailto:`). */
  | { kind: "email" };

type Section = { id: string; heading: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    id: "sekcija-1",
    heading: "1. Што е оваа страница",
    blocks: [
      {
        kind: "p",
        text: "www.belasicahistory.mk е неофицијална дигитална архива посветена на историјата на ФК Беласица.",
      },
      {
        kind: "p",
        text: "Страницата не е официјална страница на ФК Беласица. Не е поврзана со клубот, со неговата управа, играчи, спонзори или официјални претставници, не е одобрена од нив и не зборува во нивно име. Ниту еден текст објавен овде не треба да се сфати како официјално соопштение на клубот.",
      },
      {
        kind: "p",
        text: "За официјални информации обратете се директно до ФК Беласица.",
      },
    ],
  },
  {
    id: "sekcija-2",
    heading: "2. Цел на страницата",
    blocks: [
      {
        kind: "p",
        text: "Оваа страница постои за да собере, сочува и направи достапна на едно место граѓата поврзана со историјата на клубот — фотографии, текстови, резултати, состави, сезони и сеќавања што инаку се расфрлани по приватни архиви, стари изданија и лични колекции.",
      },
      {
        kind: "p",
        text: "Целта е информативна, документарна и културна. Страницата не е комерцијална: не продава производи или услуги, не наплаќа пристап и не прикажува реклами.",
      },
    ],
  },
  {
    id: "sekcija-3",
    heading: "3. Изработена со помош на вештачка интелигенција",
    blocks: [
      {
        kind: "p",
        text: "Оваа страница е изработена со помош на алатки за вештачка интелигенција — во дизајнот, во програмирањето и во подготовката и обработката на текстовите. Материјалот е прегледуван и уредуван од луѓе пред објавување.",
      },
      {
        kind: "p",
        text: "И покрај тоа, содржината може да содржи грешки, непрецизни формулации, погрешни датуми или имиња што настанале при обработката. Ако забележите нешто што не е точно, пишете ни — ќе го провериме и поправиме.",
      },
    ],
  },
  {
    id: "sekcija-4",
    heading: "4. Точност на податоците",
    blocks: [
      {
        kind: "p",
        text: "Историската граѓа е собирана од приватни архиви, печатени изданија, лични колекции и сеќавања. Дел од неа не може да се потврди со официјален извор.",
      },
      {
        kind: "p",
        text: "Податоците се објавуваат со најдобра намера и според најдоброто знаење во моментот на објавување, но не гарантираме дека сè е целосно, точно или ажурирано. Страницата не треба да се користи како единствен извор за официјални, правни или деловни цели.",
      },
      {
        kind: "p",
        text: "Исправките се добредојдени и се внесуваат кога ќе бидат потврдени.",
      },
    ],
  },
  {
    id: "sekcija-5",
    heading: "5. Фотографии, авторски права и материјали од трети лица",
    blocks: [
      {
        kind: "p",
        text: "Голем дел од фотографиите и документите на оваа страница потекнуваат од стари, приватни и донирани архиви. За дел од нив авторот или сопственикот на правата не е познат и не можеше да се утврди и покрај обидите.",
      },
      { kind: "p", text: "Ставот на оваа архива е следниов:" },
      {
        kind: "ul",
        items: [
          "Материјалот се објавува без комерцијална намера, во документарен и архивски контекст, како придонес кон зачувување на локалната спортска историја.",
          "Авторските права остануваат кај своите сопственици. Објавувањето овде не пренесува и не претендира на никакви права.",
          "Каде што авторот е познат, тој се наведува. Ако знаете кој е авторот на некоја фотографија, јавете ни се за да го додадеме.",
          "Ако сте автор или сопственик на права врз некој материјал објавен овде и не сакате тој да биде на страницата, контактирајте нè и материјалот ќе биде отстранет без одлагање и без прашања. Тоа е најбрзиот и најсигурниот пат — не е потребна правна постапка.",
        ],
      },
      {
        kind: "p",
        text: "Не е наша намера да ги повредиме правата на кој било автор. Секоја објава направена без знаење за постоечки права е ненамерна и се решава со отстранување или со наведување на авторот, според желбата на сопственикот.",
      },
    ],
  },
  {
    id: "sekcija-6",
    heading: "6. Име, амблем и обележја на клубот",
    blocks: [
      {
        kind: "p",
        text: "Името „ФК Беласица“, амблемот, боите и другите обележја на клубот се сопственост на клубот, односно на нивните носители на права. Овде се користат исклучиво за идентификација и опис во архивски контекст, без тврдење за сопственост, дозвола, спонзорство или поврзаност.",
      },
    ],
  },
  {
    id: "sekcija-7",
    heading: "7. Ограничување на одговорност",
    blocks: [
      {
        kind: "p",
        text: "Страницата се објавува „како што е“. Во рамките дозволени со закон, авторите на оваа архива не преземаат одговорност за:",
      },
      {
        kind: "ul",
        items: [
          "грешки, пропусти или неточности во објавената содржина;",
          "одлуки донесени врз основа на податоци прочитани овде;",
          "привремена недостапност или технички проблеми со страницата;",
          "содржината на надворешни страници до кои водат линкови.",
        ],
      },
      {
        kind: "p",
        text: "Ако сметате дека нешто на страницата ви штети или ги нарушува вашите права, контактирајте нè прво — недоразбирањата од овој вид најбрзо се решаваат директно.",
      },
    ],
  },
  {
    id: "sekcija-8",
    heading: "8. Надворешни линкови",
    blocks: [
      {
        kind: "p",
        text: "Страницата може да содржи линкови до други сајтови. Тие се дадени заради дополнителен контекст. Немаме контрола врз нивната содржина и не одговараме за неа.",
      },
    ],
  },
  {
    id: "sekcija-9",
    heading: "9. Промени",
    blocks: [
      {
        kind: "p",
        text: "Овие правни информации може да бидат изменети или дополнети. Датумот на последното ажурирање е наведен на почетокот на страницата.",
      },
    ],
  },
  {
    id: "sekcija-10",
    heading: "10. Контакт",
    blocks: [
      {
        kind: "p",
        text: "За исправки, барања за отстранување на материјал, прашања за авторство или каква било друга правна забелешка:",
      },
      { kind: "email" },
      { kind: "p", text: "Одговараме на секое барање." },
    ],
  },
  /**
   * §11 — NEW at 3.23 (B8). **APPENDED, never inserted.** §5 is referenced by
   * its number from `current-state.md` and from OV-23, so renumbering the ten
   * sections above would silently break those references.
   *
   * Why there is no cookie banner: this site sets no cookies of its own, and
   * Vercel Web Analytics identifies a visitor by a hash of the incoming request
   * rather than by storing one — so no consent is required. Regulator guidance
   * is nonetheless that analytics should be *named* in the privacy notice, which
   * is what this section does. Decision already taken; not re-opened here.
   *
   * ⚠️ **This is the only copy on this page that is NOT the owner's.** Every
   * other word was supplied by him as final, native-reviewed text and is
   * rendered verbatim (41/41 lines diff-proven, D-3.07-7). These three
   * paragraphs are the orchestrator's wording and are owed both an owner
   * approval and a native-speaker read. They are descriptive rather than a legal
   * commitment, which is why they ship pending that read rather than blocking on
   * it (D-3.23-9).
   */
  {
    id: "sekcija-11",
    heading: "11. Приватност и аналитика",
    blocks: [
      {
        kind: "p",
        text: "Оваа страница користи Vercel Web Analytics за да измери колку луѓе ја посетуваат и кои страници ги читаат. Vercel Web Analytics не поставува колачиња (cookies) и не собира податоци што би можеле лично да ве идентификуваат — статистиката е збирна и анонимна. Затоа оваа страница нема банер за согласност за колачиња.",
      },
      {
        kind: "p",
        text: "Формуларот за контакт се испраќа преку услугата Formspree. Кога ќе го пополните, вашето име, вашата е-пошта и вашата порака се пренесуваат преку Formspree до сопственикот на архивата и се користат само за да ви одговориме. Не водиме листа за е-пошта и не испраќаме реклами.",
      },
      {
        kind: "p",
        text: "Страницата се хостира на Vercel, кој — како и секој веб-сервер — привремено ги запишува техничките податоци на секое барање, како IP-адресата, времето и адресата на побараната страница.",
      },
    ],
  },
];

/**
 * The address link — brand.md §Components („Text link": a 3px orange underline
 * that swaps to the text colour on hover).
 *
 * It drops the role's condensed **uppercase** caps, and only that: an email
 * address is a value, and „INFO@BELASICAHISTORY.MK" is not the address this
 * page promises to answer (D-3.07-4). Navy ink on paper is 14.95:1; the orange
 * is a rule under the text, never the text itself (brand rule 3).
 */
const emailLink = cn(
  "inline-block border-b-[3px] border-orange pb-1 text-body-l font-bold text-navy transition-colors hover:border-navy",
  focusOnPaper,
);

export default function LegalPage() {
  return (
    <>
      <PageHeader
        title="Правни информации"
        crumbs={[
          { label: "Почетна", href: "/" },
          { label: "Правни информации" },
        ]}
        // 3.23 (A2/P2): this read „16 август 2026" — a date in the FUTURE,
        // written 16 days ahead of the commit that introduced it (git: c2fb001,
        // 2026-07-31) and still ahead of today. §9 makes this label
        // load-bearing („Датумот на последното ажурирање е наведен на почетокот
        // на страницата"), so a wrong date is a wrong statement on the one page
        // that exists to be accurate. Set to the date this phase actually
        // changed the copy by appending §11 (D-3.23-15).
        meta="Последно ажурирање: 14 август 2026"
      />

      {/* One editorial column at the reading measure, like /za-nas — this is
          prose to be read end to end, not a data document. */}
      <Container className="py-section">
        <div className="max-w-measure">
          {SECTIONS.map((section, index) => (
            <Reveal key={section.id}>
              <section
                aria-labelledby={section.id}
                className={index === 0 ? undefined : "mt-14"}
              >
                <h2 id={section.id} className="u-h3 text-navy">
                  {section.heading}
                </h2>
                {section.blocks.map((block, blockIndex) => (
                  <LegalBlock key={blockIndex} block={block} />
                ))}
              </section>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}

/**
 * One block of the copy. `mt-*` lives here rather than on a wrapper so the
 * first block sits tight under its heading and the rest keep one rhythm.
 */
function LegalBlock({ block }: { block: Block }) {
  if (block.kind === "ul") {
    return (
      <ul className="mt-4 flex list-[square] flex-col gap-3 pl-5 text-body text-neutral-700 marker:text-navy">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.kind === "email") {
    return (
      <p className="mt-5">
        <a href={`mailto:${CONTACT_EMAIL}`} className={emailLink}>
          {CONTACT_EMAIL}
        </a>
      </p>
    );
  }

  return <p className="mt-4 text-body text-neutral-700">{block.text}</p>;
}

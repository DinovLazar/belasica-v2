import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/archive/Breadcrumb";
import { ContactForm } from "@/components/contact/ContactForm";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";

// Match the other Part-2 routes (D-1.05-4) for consistency, even though this
// page reads no Sanity content — the value is harmless here and keeps the
// route family uniform (brief task 2).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Контакт",
  description:
    "Контакт со неофицијалната архива на ФК Беласица — прашања, исправки и материјали за архивата.",
};

/**
 * /kontakt — the last nav route to be built; with it, every one of the six
 * top-level nav links now lands on a real page.
 *
 * **Provisional** (D-2.05-1, per the 2.05 handover §5): a set-apart banner says
 * so up top. The form is fully built (all four states), but the Formspree
 * endpoint arrives as configuration in 3.03 (D-0.00-7) — so `ContactForm`
 * reads `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (a **public** form action, not a
 * secret — safe in a public repo, D-2.07-2) and, while it is unset, renders the
 * form visibly disabled with a placeholder (D-2.07-3). No hero: nothing in the
 * locked model sources one (cf. D-2.06-4).
 */
export default function ContactPage() {
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  return (
    <>
      <Container className="py-5">
        <Breadcrumb
          items={[{ label: "Почетна", href: "/" }, { label: "Контакт" }]}
        />
      </Container>

      <Container className="pb-12">
        <h1 className="font-serif text-h1 font-semibold text-navy md:text-display">
          Контакт
        </h1>
        {/* Structural copy — describes the page's own purpose, claims no fact. */}
        <p className="mt-4 max-w-measure text-body-l text-neutral-700">
          Имате прашање, исправка или материјал за архивата? Пишете ни преку
          формуларот или на директните контакти.
        </p>
      </Container>

      <div className="border-t border-mist py-16 md:py-24">
        <Container>
          {/* Provisional banner (task 3) — SeasonEmptyNotice's visual language
              (solid mist border, white, rounded-card), but overline-led rather
              than heading-led so it does not disturb the page's h1 → h2 order.
              Structural copy: it claims nothing about the club. */}
          <Reveal>
            <div className="rounded-card border border-mist bg-white p-6 md:p-8">
              <p className="text-overline font-semibold uppercase tracking-overline text-neutral-700">
                Страницата е во подготовка
              </p>
              <p className="mt-2 text-small text-neutral-700">
                Оваа страница сѐ уште се доработува и може да се промени.
                Контакт-каналите подолу допрва се поставуваат.
              </p>
            </div>
          </Reveal>

          {/* At 1280: form left, direct block right with `border-l border-mist`.
              At 375: single column, form first, direct block below a
              `border-t border-mist` (handover §5). */}
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-0">
            <Reveal>
              <section
                aria-labelledby="form-heading"
                className="md:pr-12 lg:pr-16"
              >
                <h2
                  id="form-heading"
                  className="font-serif text-h3 font-semibold text-navy"
                >
                  Испратете порака
                </h2>
                <div className="mt-6">
                  <ContactForm endpoint={endpoint} />
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section
                aria-labelledby="direct-heading"
                className="border-t border-mist pt-10 md:border-l md:border-t-0 md:pl-12 md:pt-0 lg:pl-16"
              >
                <h2
                  id="direct-heading"
                  className="font-serif text-h3 font-semibold text-navy"
                >
                  Директен контакт
                </h2>

                {/* Email (PL-3). No email exists in facts.md, so this is a
                    placeholder chip — never a `mailto:` with an invented or
                    borrowed address (brief task 6). */}
                <div className="mt-6">
                  <p className="text-overline font-semibold uppercase tracking-overline text-neutral-700">
                    Е-пошта
                  </p>
                  <p className="mt-2">
                    <PlaceholderChip label="адреса за е-пошта" />
                  </p>
                </div>

                {/* Socials (PL-15). UNVERIFIED in facts.md; the footer's social
                    links are unverified demo values (PL-9, D-1.06b-1) and must
                    not be propagated here — placeholder chips instead
                    (D-2.07-4). */}
                <div className="mt-8">
                  <p className="text-overline font-semibold uppercase tracking-overline text-neutral-700">
                    Социјални мрежи
                  </p>
                  <p className="mt-2">
                    <PlaceholderChip label="профили на социјалните мрежи" />
                  </p>
                </div>
              </section>
            </Reveal>
          </div>
        </Container>
      </div>
    </>
  );
}

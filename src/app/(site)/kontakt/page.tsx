import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/SocialLinks";
import { Reveal } from "@/components/home/Reveal";
import { focusOnPaper } from "@/lib/focus";
import { CONTACT_EMAIL } from "@/lib/facts";

// Match the other Part-2 routes (D-1.05-4) for consistency, even though this
// page reads no Sanity content — the value is harmless here and keeps the
// route family uniform (brief task 2).
export const revalidate = 60;

export const metadata: Metadata = {
  // Its own path, relative — resolved against `metadataBase`, so the
  // domain cutover stays one environment variable (3.23, B2).
  alternates: { canonical: "/kontakt" },
  title: "Контакт",
  description:
    "Контакт со неофицијалната архива на ФК Беласица — прашања, исправки и материјали за архивата.",
};

/**
 * /kontakt — the last nav route to be built; with it, every one of the six
 * top-level nav links now lands on a real page.
 *
 * The „во подготовка" banner was **removed at owner request in 3.10** and the
 * page is no longer marked provisional (D-3.10-1).
 *
 * `ContactForm` reads `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (a **public** form
 * action, not a secret — safe in a public repo, D-2.07-2); while it is unset
 * the form renders visibly disabled with a placeholder (D-2.07-3). **Since
 * 3.03b the endpoint is set** in `.env.local` and on Vercel (Prod + Preview),
 * so the live form is what renders (D-3.03b-1). **This page now renders no
 * placeholder chip** — 3.03b cleared PL-14, 3.07 cleared PL-3, and 3.15 closed
 * the last one, PL-15 (socials). The `ContactForm` unset-endpoint chip stays in
 * the component as a defensive fallback; it is unreachable in production and is
 * deliberately not deleted (D-3.15-9). No hero: nothing in the locked model
 * sources one (cf. D-2.06-4).
 */
export default function ContactPage() {
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  return (
    <>
      <PageHeader
        title="Контакт"
        crumbs={[{ label: "Почетна", href: "/" }, { label: "Контакт" }]}
        // Structural copy — describes the page's own purpose, claims no fact.
        intro="Имате прашање, исправка или материјал за архивата? Пишете ни преку формуларот или на директните контакти."
      />

      <div className="py-section">
        <Container>
          {/* At 1280: form left, direct block right with `border-l border-mist`.
              At 375: single column, form first, direct block below a
              `border-t border-mist` (handover §5). */}
          <div className="grid gap-10 md:grid-cols-2 md:gap-0">
            <Reveal>
              <section
                aria-labelledby="form-heading"
                className="md:pr-12 lg:pr-16"
              >
                <h2 id="form-heading" className="u-h3 text-navy">
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
                <h2 id="direct-heading" className="u-h3 text-navy">
                  Директен контакт
                </h2>

                {/* Email (PL-3). VERIFIED in `facts.md` on 2026-07-31, so the
                    chip that stood here since 2.07 is now the real address
                    (D-3.07-5). PL-3 was open on **two** surfaces — this page
                    and the footer — and clearing only the footer would have
                    left „Директен контакт" telling a reader there is no email
                    while the footer of the same page shows one. */}
                <div className="mt-6">
                  <p className="text-overline font-bold uppercase tracking-overline text-neutral-700">
                    Е-пошта
                  </p>
                  <p className="mt-2">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className={cn(
                        "inline-block border-b-[3px] border-orange pb-1 text-body font-bold text-navy transition-colors hover:border-navy",
                        focusOnPaper,
                      )}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>

                {/* Socials — **PL-15 closed at 3.15**, on this surface and in
                    the footer at the same time, from the same `SocialLinks`
                    component and the same VERIFIED `facts.md` entries. Both
                    profiles are authored by Аце Стојанов (owner, chat,
                    2026-08-08); 3.12 had cleared the footer only and left this
                    chip standing (D-3.12-6), so „Директен контакт" told a
                    reader there were no profiles while the footer of the same
                    page linked one. */}
                <div className="mt-8">
                  <p className="text-overline font-bold uppercase tracking-overline text-neutral-700">
                    Следете нѐ
                  </p>
                  <SocialLinks className="mt-1" />
                </div>
              </section>
            </Reveal>
          </div>
        </Container>
      </div>
    </>
  );
}

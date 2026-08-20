"use client";

import { useEffect, useRef, useState } from "react";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

/**
 * The contact form (`/kontakt`) — the repo's second client component, after
 * `StatTable`. The page stays a server component and passes the Formspree
 * endpoint down as a prop; everything stateful lives here (handover §6.4).
 *
 * State machine: `idle → submitting → success | error` (§5 table). The Serbian
 * button copy in the handover („Пошаљи" / „Шаље се…" / „Хвала!" / „Пошаљи
 * поново") is corrected to Macedonian here (D-2.07-1) — the site is
 * Macedonian-only, the same call 2.06 made for its own Serbian strings.
 *
 * The endpoint is a **public** form action by design (not a secret), read from
 * `NEXT_PUBLIC_FORMSPREE_ENDPOINT`. When it is unset the form renders visibly
 * **disabled** with a notice and a `[PLACEHOLDER]` chip (D-2.07-3) — never
 * enabled-but-silently-failing. The real endpoint was wired in **3.03b**
 * (D-3.03b-1), which also **cleared OV-8**: every state is now verified against
 * the live Formspree form, not a fixture — `idle → submitting → success` against
 * the real endpoint, and `idle → submitting → error` against a deliberately
 * dead one, with the typed input retained.
 */

type Status = "idle" | "submitting" | "success" | "error";

const SUBMIT_LABELS: Record<Status, string> = {
  idle: "Испрати",
  submitting: "Се испраќа…",
  success: "Испрати",
  error: "Испрати повторно",
};

export function ContactForm({
  endpoint,
  successMessage = "Пораката е примена. Ќе ви одговориме штом ќе можеме.",
}: {
  endpoint?: string;
  successMessage?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const resultRef = useRef<HTMLDivElement>(null);

  /**
   * Move focus to the result panel once the submit resolves — WCAG 2.4.3 and
   * 4.1.3.
   *
   * Two things went wrong without it, and they compound. Focus was on the
   * submit button at the moment of submission; on `success` the whole form is
   * replaced by the panel below, so that button is unmounted and the browser
   * drops focus on `<body>` — a keyboard user is silently returned to the top
   * of the document. And the panel carries its live-region role in the same
   * insertion that carries its text, which screen readers announce
   * unreliably: a region has to be in the DOM before its contents change for
   * the change to be a change. Landing focus on the panel makes the
   * announcement the focus move itself, which does not depend on live-region
   * timing at all. `tabIndex={-1}` makes it a focus target without adding a
   * tab stop.
   */
  useEffect(() => {
    if (status === "success" || status === "error") resultRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint) return;
    // Guards the second press, which `disabled` used to guard. See the button.
    if (status === "submitting") return;

    const body = new FormData(event.currentTarget);

    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      // Non-2xx and network failures both land in `error`. Formspree's own
      // error text is never surfaced to the visitor.
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Endpoint not configured (the current, expected production state — PL-14).
  // The form is shown but fully disabled, so a visitor can see it exists and
  // that it is not yet live, and no submission is possible.
  if (!endpoint) {
    return (
      <div>
        <div className="border border-mist bg-white p-5">
          <p className="text-overline font-bold uppercase tracking-overline text-neutral-700">
            Формуларот сѐ уште не е активен
          </p>
          <p className="mt-2 text-small text-neutral-700">
            Каналот за пораки допрва се поставува. Формуларот подолу ќе
            проработи штом ќе биде поврзан.
          </p>
          <p className="mt-3">
            <PlaceholderChip label="адреса за примање пораки (Formspree)" />
          </p>
        </div>

        {/* A disabled fieldset switches off every control at once, so the
            button cannot submit and no field is editable. */}
        <fieldset disabled className="mt-6 opacity-60">
          {/* A `<fieldset>` with no `<legend>` has no accessible name, so a
              screen-reader user meets a group boundary that announces nothing
              (SC 1.3.1 / 4.1.2). Visually hidden rather than rendered: the
              notice directly above already says this in the page's own voice,
              and a second visible heading would repeat it. The name carries the
              REASON as well as the label — reaching a disabled control and
              being told only that it is disabled is the part that leaves
              someone stuck. */}
          <legend className="sr-only">
            Контакт формулар — сѐ уште не е активен
          </legend>
          <FormFields />
          <div className="mt-6">
            <SubmitButton status="idle" />
          </div>
        </fieldset>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="border border-mist bg-white p-6 md:p-8"
      >
        <p className="text-overline font-bold uppercase tracking-overline text-neutral-700">
          Пораката е испратена
        </p>
        <p className="mt-3 u-h3 text-navy">
          Ви благодариме!
        </p>
        <p className="mt-3 text-body text-neutral-700">{successMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {status === "error" && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 border border-error bg-white p-4"
        >
          <p className="text-small font-bold text-error">
            Пораката не можеше да се испрати.
          </p>
          <p className="mt-1 text-small text-neutral-700">
            Проверете ја врската и обидете се повторно. Вашиот текст е зачуван
            подолу.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* NOT disabled while submitting. Disabling a focused control blurs it
            and the browser hands focus to `<body>` — so pressing Enter inside
            „Порака" used to send the visitor to the top of the document for the
            length of the request. Nothing needs the lock: `body` is read from
            the form before the request starts, and `handleSubmit` returns early
            on a second submit. */}
        <FormFields />
        <div className="mt-6">
          <SubmitButton status={status} />
        </div>
      </form>
    </div>
  );
}

/**
 * The three fields, shared by the live form and the disabled variant. The
 * disabled variant switches them off through the `<fieldset disabled>` around
 * them rather than per input, and the live form no longer disables them at all
 * while a request is in flight (see the note at the call site). Kept
 * uncontrolled: on the `error → idle` return the inputs keep whatever the
 * visitor typed, since the same DOM nodes stay mounted (§5, „fields retain the
 * user's input"). `required` + `type="email"` give native validation and
 * announce the requirement to assistive tech; the visible `*` is `aria-hidden`.
 */
function FormFields() {
  return (
    <div className="space-y-5">
      <p className="text-small text-neutral-500">
        Полињата означени со <span className="text-error">*</span> се
        задолжителни.
      </p>

      <Field id="name" label="Име" required>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Вашето име"
          className={inputClass}
        />
      </Field>

      <Field id="email" label="Е-пошта" required>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ime@example.com"
          className={inputClass}
        />
      </Field>

      <Field id="message" label="Порака" required>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Вашата порака"
          className={cn(inputClass, "resize-y")}
        />
      </Field>
    </div>
  );
}

const inputClass = cn(
  "block w-full border border-mist bg-white px-3 py-2.5 text-body text-ink",
  "placeholder:text-neutral-500 disabled:cursor-not-allowed",
  focusOnPaper,
);

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-small font-bold text-navy"
      >
        {label}
        {required && (
          <span aria-hidden className="text-error">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

/**
 * Primary navy button (brand.md §Components). A fixed `min-w` reserves room for
 * the longest label („Се испраќа…"), so swapping the text on submit never
 * shifts the layout (§5, „no layout shift — reserve the space").
 */
function SubmitButton({ status }: { status: Status }) {
  const submitting = status === "submitting";
  return (
    <button
      type="submit"
      // `aria-disabled`, not `disabled` (WCAG 2.4.3). This button is the
      // element that has focus at the moment of submission; disabling it blurs
      // it, and every browser then drops focus on `<body>`. `aria-disabled`
      // announces the same state and keeps the control focusable, so the
      // visitor stays where they pressed. The second press it used to block is
      // blocked in `handleSubmit` instead.
      //
      // Emitted only when it is TRUE. `aria-disabled="false"` is not a no-op:
      // in the endpoint-unset branch this button sits inside a
      // `<fieldset disabled>` at `opacity-60`, and an explicit "false"
      // overrode that inheritance for tooling — axe stopped treating the
      // button as an inactive component (which SC 1.4.3 exempts) and reported
      // its dimmed 4.29:1 as a contrast failure. It also contradicted the
      // element's own state. Absent, the fieldset speaks for it.
      aria-disabled={submitting || undefined}
      aria-busy={submitting || undefined}
      className={cn(
        "inline-flex min-w-[13rem] items-center justify-center bg-navy px-6 py-3 text-body font-bold text-paper",
        "transition-colors hover:bg-navy/90",
        // `disabled:` still earns its place: in the endpoint-unset branch this
        // button inherits `:disabled` from the `<fieldset disabled>` around it,
        // and dropping the variant made it render a shade darker than before —
        // the one unintended pixel change this remediation produced, caught by
        // a screenshot diff. It cannot fire in the live branch any more, where
        // the button is never `disabled`; `submitting` covers that state.
        "disabled:cursor-not-allowed disabled:opacity-70",
        submitting && "cursor-not-allowed opacity-70 hover:bg-navy",
        focusOnPaper,
      )}
    >
      {SUBMIT_LABELS[status]}
    </button>
  );
}

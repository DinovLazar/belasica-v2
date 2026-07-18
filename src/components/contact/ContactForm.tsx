"use client";

import { useState } from "react";
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
 * enabled-but-silently-failing. Wiring the real endpoint is 3.03's step
 * (D-0.00-7); until then every live state (idle/submitting/success/error) is
 * fixture-verified only (OV-8).
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint) return;

    // Read the values before the inputs are disabled — a disabled control is
    // excluded from FormData, so building the body first keeps every field.
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
        <div className="rounded-card border border-mist bg-white p-5">
          <p className="text-overline font-semibold uppercase tracking-overline text-neutral-700">
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
        role="status"
        aria-live="polite"
        className="rounded-card border border-mist bg-white p-6 md:p-8"
      >
        <p className="text-overline font-semibold uppercase tracking-overline text-neutral-700">
          Пораката е испратена
        </p>
        <p className="mt-3 font-serif text-h3 font-semibold text-navy">
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
          role="alert"
          className="mb-6 rounded-card border border-error bg-white p-4"
        >
          <p className="text-small font-semibold text-error">
            Пораката не можеше да се испрати.
          </p>
          <p className="mt-1 text-small text-neutral-700">
            Проверете ја врската и обидете се повторно. Вашиот текст е зачуван
            подолу.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormFields disabled={status === "submitting"} />
        <div className="mt-6">
          <SubmitButton status={status} />
        </div>
      </form>
    </div>
  );
}

/**
 * The three fields, shared by the live form and the disabled variant. Kept
 * uncontrolled: on the `error → idle` return the inputs keep whatever the
 * visitor typed, since the same DOM nodes stay mounted (§5, „fields retain the
 * user's input"). `required` + `type="email"` give native validation and
 * announce the requirement to assistive tech; the visible `*` is `aria-hidden`.
 */
function FormFields({ disabled }: { disabled?: boolean }) {
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
          disabled={disabled}
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
          disabled={disabled}
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
          disabled={disabled}
          placeholder="Вашата порака"
          className={cn(inputClass, "resize-y")}
        />
      </Field>
    </div>
  );
}

const inputClass = cn(
  "block w-full rounded-card border border-mist bg-white px-3 py-2.5 text-body text-ink",
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
        className="mb-1.5 block text-small font-medium text-navy"
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
      disabled={submitting}
      aria-busy={submitting}
      className={cn(
        "inline-flex min-w-[13rem] items-center justify-center rounded-card bg-navy px-6 py-3 text-body font-medium text-paper",
        "transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-70",
        focusOnPaper,
      )}
    >
      {SUBMIT_LABELS[status]}
    </button>
  );
}

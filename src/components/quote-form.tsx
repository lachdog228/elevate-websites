"use client";

import { useState, type FormEvent } from "react";
import { Check, AlertCircle } from "lucide-react";
import { business } from "@/lib/business";
import { SubmitButton } from "./ui/button";

type Field = {
  name: string;
  label: string;
  type: string;
  autoComplete: string;
  required: boolean;
  inputMode?: "text" | "tel" | "email";
};

const fields: Field[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: true, inputMode: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: false, inputMode: "email" },
];

const inputClass =
  "min-h-12 w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 " +
  "text-[1rem] text-ink transition-colors duration-200 " +
  "placeholder:text-stone/60 focus:border-clay focus:outline-none " +
  "disabled:opacity-60";

type Status = "idle" | "sending" | "sent" | "error";

/** Only obviously bad input is caught here; Netlify does the real validation. */
function validate(data: FormData) {
  const errors: Record<string, string> = {};

  if (!String(data.get("name") ?? "").trim()) {
    errors.name = "Please tell us your name.";
  }

  const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
  if (phone.length < 8) {
    errors.phone = "Please enter a phone number we can reach you on.";
  }

  const email = String(data.get("email") ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "That email address doesn't look right.";
  }

  if (!String(data.get("message") ?? "").trim()) {
    errors.message = "A sentence or two about the job is enough.";
  }

  return errors;
}

export function QuoteForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  /**
   * Netlify Forms handles delivery. The runtime no longer reads forms out of
   * prerendered Next.js pages, so the submission is POSTed to the static
   * declaration in public/__forms.html instead of navigating.
   */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");

    try {
      const body = new URLSearchParams();
      for (const [key, value] of data.entries()) {
        body.append(key, typeof value === "string" ? value : value.name);
      }

      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) throw new Error(`Netlify responded ${response.status}`);

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-l-2 border-clay bg-bone-deep px-6 py-7">
        <Check aria-hidden className="size-5 text-clay" strokeWidth={2} />
        <p className="mt-4 font-display text-2xl text-ink">Thanks — that&apos;s sent.</p>
        <p className="mt-2 text-[0.9375rem] text-stone">
          We&apos;ll be in touch shortly to arrange a time. If it&apos;s urgent,
          call{" "}
          <a
            href={business.phoneHref}
            className="text-graphite underline decoration-line-strong underline-offset-4 transition-colors hover:text-clay"
          >
            {business.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form name="quote" onSubmit={onSubmit} noValidate className="space-y-8">
      <input type="hidden" name="form-name" value="quote" />

      {/* Honeypot — hidden from people, tempting to bots */}
      <p className="hidden">
        <label>
          Leave this field empty
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.name === "email" ? "sm:col-span-2" : ""}>
            <label htmlFor={field.name} className="eyebrow block text-graphite">
              {field.label}
              {!field.required ? (
                <span className="ml-2 normal-case tracking-normal text-stone">
                  (optional)
                </span>
              ) : null}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              disabled={sending}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              className={inputClass}
            />
            {errors[field.name] ? (
              <p id={`${field.name}-error`} className="mt-2 text-sm text-clay">
                {errors[field.name]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="message" className="eyebrow block text-graphite">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          disabled={sending}
          placeholder="What needs painting, and roughly when?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputClass} resize-y`}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-sm text-clay">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <SubmitButton disabled={sending} aria-busy={sending} className="disabled:opacity-70">
          {sending ? "Sending…" : "Send Enquiry"}
        </SubmitButton>

        {status === "error" ? (
          <p role="alert" className="flex items-start gap-2 text-sm text-clay">
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
            <span>
              That didn&apos;t send. Please try again, or call{" "}
              <a href={business.phoneHref} className="underline underline-offset-4">
                {business.phone}
              </a>
              .
            </span>
          </p>
        ) : null}
      </div>
    </form>
  );
}

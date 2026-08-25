"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
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
  "placeholder:text-stone/60 focus:border-clay focus:outline-none";

export function QuoteForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  /**
   * Netlify Forms handles delivery. This only catches obviously bad input
   * before the round trip — the real validation is server-side at Netlify.
   */
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};

    if (!String(data.get("name") ?? "").trim()) {
      next.name = "Please tell us your name.";
    }

    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
    if (phone.length < 8) {
      next.phone = "Please enter a phone number we can reach you on.";
    }

    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "That email address doesn't look right.";
    }

    if (!String(data.get("message") ?? "").trim()) {
      next.message = "A sentence or two about the job is enough.";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      event.preventDefault();
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setSent(true);
  }

  return (
    <form
      name="quote"
      method="POST"
      data-netlify="true"
      netlify-honeypot="company"
      action="/?sent=1#contact"
      onSubmit={onSubmit}
      noValidate
      className="space-y-8"
    >
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
            <label
              htmlFor={field.name}
              className="eyebrow block text-graphite"
            >
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
        <SubmitButton>Send Enquiry</SubmitButton>
        {sent ? (
          <p className="inline-flex items-center gap-2 text-sm text-stone" role="status">
            <Check aria-hidden className="size-4 text-clay" strokeWidth={2} />
            Sending…
          </p>
        ) : null}
      </div>
    </form>
  );
}

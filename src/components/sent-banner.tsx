"use client";

import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

/**
 * Netlify redirects back to /?sent=1#contact after a successful submission,
 * so the confirmation lives here rather than on a separate thank-you page.
 */
export function SentBanner() {
  const sent = useSearchParams().get("sent");
  if (!sent) return null;

  return (
    <div
      role="status"
      className="mb-9 flex items-start gap-3 border-l-2 border-clay bg-bone-deep px-5 py-4"
    >
      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={2} />
      <p className="text-[0.9375rem] text-graphite">
        Thanks — your enquiry has been sent. We&apos;ll be in touch shortly.
      </p>
    </div>
  );
}

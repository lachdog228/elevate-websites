import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactDetails } from "@/components/sections/contact-details";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Request a free quote from M. McCrohan — Painting & Decorating. Call 0411 353 716, or send an enquiry. Leopold VIC, serving Geelong and the Bellarine.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Ready to transform{" "}
            <span className="italic text-clay-light">your space?</span>
          </>
        }
        lede="Tell us what you have in mind and we'll come and take a look. Quotes are free, and there's no obligation either way."
      />
      <ContactDetails />
    </>
  );
}

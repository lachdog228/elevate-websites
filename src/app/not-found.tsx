import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
import { business, navLinks } from "@/lib/business";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Page not found | M. McCrohan — Painting & Decorating",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title={
          <>
            That page isn&apos;t{" "}
            <span className="italic text-clay-light">here.</span>
          </>
        }
        lede="It may have moved, or the link may be out of date. Everything on the site is one of the pages below."
      />

      <section className="bg-bone py-[var(--sec)]">
        <div className="shell">
          <ul className="border-t border-line">
            {navLinks.map((link, index) => (
              <Reveal as="li" key={link.href} delay={index * 0.06}>
                <a
                  href={link.href}
                  className="flex min-h-16 items-center border-b border-line font-display text-2xl text-ink transition-colors hover:text-clay sm:text-3xl"
                >
                  {link.label}
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/" variant="solid">
                Back to home
              </ButtonLink>
              <ButtonLink href={business.phoneHref} variant="outline">
                Call {business.phone}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

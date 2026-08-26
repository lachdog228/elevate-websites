import { Phone } from "lucide-react";
import { business } from "@/lib/business";
import { Reveal } from "../ui/reveal";
import { ButtonLink } from "../ui/button";

type Props = {
  /** Overrides the default heading where a page wants a closer follow-on. */
  title?: string;
  body?: string;
};

/**
 * The closing call to action. Every page that isn't /contact ends with it, so
 * the next step is never more than one screen away.
 */
export function CtaBand({
  title = "Ready to transform your space?",
  body = "Tell us what you have in mind and we'll come and take a look. Quotes are free, and there's no obligation either way.",
}: Props) {
  return (
    <section className="bg-bone-deep py-[var(--sec)]">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Get in touch</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="display-lg mt-5">{title}</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lede mt-6">{body}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.24}>
              <a
                href={business.phoneHref}
                className="group block"
                aria-label={`Call ${business.legalName} on ${business.phone}`}
              >
                <span className="eyebrow">Call</span>
                <span className="mt-2 block font-display text-[clamp(2rem,4.5vw,3rem)] leading-none text-ink transition-colors duration-300 group-hover:text-clay">
                  {business.phone}
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={business.phoneHref} variant="solid">
                  <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                  Call Now
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Request a Quote
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

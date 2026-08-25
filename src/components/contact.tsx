import { Suspense } from "react";
import { Phone, MapPin, Clock } from "lucide-react";
import { business, addressLine, mapsHref } from "@/lib/business";
import { Reveal } from "./ui/reveal";
import { ButtonLink } from "./ui/button";
import { QuoteForm } from "./quote-form";
import { SentBanner } from "./sent-banner";

export function Contact() {
  return (
    <section id="contact" className="bg-bone-deep py-[var(--sec)]">
      <div className="shell">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Call to action + details */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Contact</p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="display-lg mt-5">
                Ready to transform
                <span className="block italic text-clay">your space?</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="lede mt-7">
                Tell us what you have in mind and we&apos;ll come and take a look.
                Quotes are free, and there&apos;s no obligation either way.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <a
                href={business.phoneHref}
                className="group mt-10 block"
                aria-label={`Call ${business.legalName} on ${business.phone}`}
              >
                <span className="eyebrow">Call</span>
                <span className="mt-2 block font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-none text-ink transition-colors duration-300 group-hover:text-clay">
                  {business.phone}
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={business.phoneHref} variant="solid">
                  <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                  Call Now
                </ButtonLink>
                <ButtonLink href="#quote-form" variant="outline">
                  Request a Quote
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.38}>
              <dl className="mt-14 space-y-7 border-t border-line-strong pt-9">
                <div className="flex gap-4">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.5} />
                  <div>
                    <dt className="eyebrow">Where we are</dt>
                    <dd className="mt-1.5 text-[0.9375rem] text-graphite">
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center underline decoration-line-strong underline-offset-4 transition-colors hover:text-clay hover:decoration-clay"
                      >
                        {addressLine}
                      </a>
                      <span className="mt-1 block text-stone">
                        Serving {business.areaServed.join(", ")}
                      </span>
                    </dd>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.5} />
                  <div>
                    <dt className="eyebrow">Hours</dt>
                    <dd className="mt-1.5 space-y-1 text-[0.9375rem] text-graphite">
                      {business.hours.map((entry) => (
                        <span key={entry.days} className="flex gap-3">
                          <span className="w-40 shrink-0 text-stone">{entry.days}</span>
                          <span>{entry.time}</span>
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.12}>
              <div id="quote-form" className="bg-paper p-7 sm:p-10 lg:p-12">
                <h3 className="display-md">Request a quote</h3>
                <p className="mt-3 text-[0.9375rem] text-stone">
                  We&apos;ll get back to you with a time to come and measure up.
                </p>
                <div className="mt-10">
                  <Suspense fallback={null}>
                    <SentBanner />
                  </Suspense>
                  <QuoteForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

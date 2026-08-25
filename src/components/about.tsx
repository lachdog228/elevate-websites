import Image from "next/image";
import { business, addressLine } from "@/lib/business";
import { Reveal } from "./ui/reveal";
import { ButtonLink } from "./ui/button";

const marks = [
  { label: "Based in", value: "Leopold" },
  { label: "Serving", value: "Geelong & the Bellarine" },
  { label: "Work", value: "Interior & exterior" },
];

export function About() {
  return (
    <section id="about" className="bg-bone py-[var(--sec)]">
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Photograph */}
          <Reveal className="lg:col-span-5" distance={26}>
            <figure className="relative aspect-4/5 overflow-hidden bg-bone-deep">
              <Image
                src="/images/about.jpg"
                alt="Painter cutting in a wall by hand from a work platform"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={80}
                className="object-cover"
              />
            </figure>
          </Reveal>

          {/* Copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">About</p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="display-lg mt-5">
                A careful trade,
                <span className="block italic text-clay">done properly.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-graphite [max-width:var(--measure)]">
                <p>
                  {business.legalName} is a painting and decorating business
                  working out of Leopold, on the edge of the Bellarine. Interior
                  and exterior, new work and repaints — homes across Geelong and
                  the peninsula.
                </p>
                <p>
                  The work is straightforward: proper preparation, clean lines,
                  and a finish that still looks right years later. Surfaces are
                  protected, edges are cut by hand, and the site is left tidy at
                  the end of every day.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border-y border-line sm:grid-cols-3 sm:gap-px sm:bg-line">
                {marks.map((mark) => (
                  <div
                    key={mark.label}
                    className="border-b border-line bg-bone py-5 last:border-b-0 sm:border-b-0 sm:px-6 sm:first:pl-0"
                  >
                    <dt className="eyebrow">{mark.label}</dt>
                    <dd className="mt-2 font-display text-xl text-ink">
                      {mark.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href="#contact" variant="outline">
                  Request a Quote
                </ButtonLink>
                <p className="text-sm text-stone">{addressLine}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

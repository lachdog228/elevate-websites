import Image from "next/image";
import { business, addressLine, mapsHref } from "@/lib/business";
import { Reveal } from "../ui/reveal";

const marks = [
  { label: "Based in", value: "Leopold" },
  { label: "Serving", value: "Geelong & the Bellarine" },
  { label: "Work", value: "Painting & maintenance" },
];

const approach = [
  {
    title: "Preparation",
    body: "Filling, sanding and spot-priming happen before a finish coat goes anywhere near a wall. It is the least visible part of the job and the part that decides how the rest of it lasts.",
  },
  {
    title: "Clean work",
    body: "Floors and fittings are covered, edges are cut in by hand, and the site is left tidy at the end of every day — including the days in the middle, not just the last one.",
  },
  {
    title: "A finish that lasts",
    body: "The right product for the surface, applied in full coats, inside and out. A finish that still looks right in five years is worth more than one that looks right in five days.",
  },
];

export function AboutDetail() {
  return (
    <section className="bg-bone py-[var(--sec)]">
      <div className="shell">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28" distance={26}>
            <figure className="relative aspect-4/5 overflow-hidden bg-bone-deep">
              <Image
                src="/images/about.jpg"
                alt="Painter cutting in a wall by hand from a work platform"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={80}
                className="object-cover"
              />
            </figure>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="space-y-5 text-[1.0625rem] leading-relaxed text-graphite [max-width:var(--measure)]">
                <p>
                  {business.legalName} works out of Leopold, on the edge of the
                  Bellarine. Interior and exterior painting, new work and
                  repaints, for homes across Geelong and the peninsula.
                </p>
                <p>
                  Alongside the painting, the business specialises in
                  maintenance and carpentry — and takes on project management
                  for clients who don&apos;t have the time to oversee the work
                  themselves, organising the trades a job needs and keeping it
                  moving.
                </p>
                <p>
                  The work is straightforward: proper preparation, clean lines,
                  and a finish that still looks right years later. Most of what
                  separates a good paint job from an average one happens before
                  the first coat, and none of it shows up in a photograph — which
                  is exactly why it matters.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border-y border-line sm:grid-cols-3">
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

            <Reveal delay={0.16}>
              <h2 className="display-md mt-16">How we work</h2>
            </Reveal>

            <dl className="mt-8 border-t border-line">
              {approach.map((item, index) => (
                <Reveal key={item.title} delay={0.2 + index * 0.06}>
                  <div className="grid gap-2 border-b border-line py-7 sm:grid-cols-12 sm:gap-8">
                    <dt className="font-display text-xl text-ink sm:col-span-4">
                      {item.title}
                    </dt>
                    <dd className="leading-relaxed text-stone sm:col-span-8">
                      {item.body}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={0.3}>
              <p className="mt-10 text-sm text-stone">
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline decoration-line-strong underline-offset-4 transition-colors hover:text-clay hover:decoration-clay"
                >
                  {addressLine}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

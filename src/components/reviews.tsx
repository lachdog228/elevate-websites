import { Star, ArrowUpRight } from "lucide-react";
import { business, mapsHref } from "@/lib/business";
import { Reveal } from "./ui/reveal";

const pillars = [
  {
    title: "Preparation",
    body: "Filling, sanding and priming done before a finish coat goes anywhere near a wall.",
  },
  {
    title: "Clean work",
    body: "Floors and fittings covered, edges cut by hand, the site left tidy each day.",
  },
  {
    title: "A finish that lasts",
    body: "The right product for the surface, applied in full coats — inside and out.",
  },
];

export function Reviews() {
  return (
    <section className="bg-ink py-[var(--sec)] text-bone">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Rating */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-bone/60">Reviews</p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-7 flex items-end gap-5">
                <span className="font-display text-[5.5rem] leading-[0.8] text-bone">
                  {business.rating.value.toFixed(1)}
                </span>
                <div className="pb-2">
                  <span className="flex gap-1" aria-hidden>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="size-4 fill-clay-light text-clay-light"
                        strokeWidth={0}
                      />
                    ))}
                  </span>
                  <p className="mt-2 text-[0.8125rem] tracking-[0.06em] text-bone/70">
                    {business.rating.source} rating
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-7 text-[1.0625rem] leading-relaxed text-bone/80 [max-width:38ch]">
                Every review left for {business.name} on {business.rating.source}{" "}
                is a five — {business.rating.count} of {business.rating.count}.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex min-h-11 items-center gap-2.5 border-b border-bone/30 pb-3 text-[0.75rem] uppercase tracking-[0.18em] text-bone/80 transition-colors hover:border-clay-light hover:text-bone"
              >
                Read them on {business.rating.source}
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </a>
            </Reveal>
          </div>

          {/* Trust statement */}
          <div className="lg:col-span-7">
            <Reveal delay={0.12}>
              <h2 className="display-md text-bone">
                The standard behind the rating
              </h2>
            </Reveal>

            <dl className="mt-10 border-t border-bone/15">
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={0.2 + index * 0.08}>
                  <div className="grid gap-2 border-b border-bone/15 py-6 sm:grid-cols-12 sm:gap-8">
                    <dt className="font-display text-xl text-bone sm:col-span-4">
                      {pillar.title}
                    </dt>
                    <dd className="text-[1rem] leading-relaxed text-bone/70 sm:col-span-8">
                      {pillar.body}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

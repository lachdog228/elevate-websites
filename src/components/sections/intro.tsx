import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { business } from "@/lib/business";
import { Reveal } from "../ui/reveal";

/**
 * The home page's introduction. Deliberately short — the full story lives on
 * /about, and this only has to earn the click.
 */
export function Intro() {
  return (
    <section id="intro" className="bg-bone py-[var(--sec)]">
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
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
              <p className="lede mt-8">
                {business.legalName} works out of Leopold, on the edge of the
                Bellarine — painting inside and out, maintenance and carpentry,
                and project management for owners who can&apos;t be on site.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <Link
                href="/about"
                className="group mt-9 inline-flex min-h-11 items-center gap-3 border-b border-line-strong pb-2 text-[0.75rem] uppercase tracking-[0.18em] text-ink transition-colors hover:border-clay hover:text-clay"
              >
                More about the business
                <ArrowRight
                  aria-hidden
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

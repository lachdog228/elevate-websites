import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "@/lib/business";
import { Reveal } from "../ui/reveal";
import { SectionHeading } from "../ui/section-heading";

export function ServicesList() {
  return (
    <section className="bg-bone-deep py-[var(--sec)]">
      <div className="shell">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              What we <span className="italic text-clay">do</span>
            </>
          }
        >
          <p className="lede">
            Three kinds of work, all of it residential, all of it finished to the
            same standard.
          </p>
        </SectionHeading>

        <ul className="mt-16 border-t border-line-strong lg:mt-20">
          {services.map((service, index) => (
            <Reveal as="li" key={service.title} delay={index * 0.08}>
              <Link
                href="/contact"
                className="group relative flex items-start gap-6 border-b border-line-strong py-9 transition-colors duration-300 hover:bg-bone sm:gap-10 sm:py-11 lg:items-center"
              >
                <span className="mt-1 font-sans text-[0.75rem] tracking-[0.18em] text-clay lg:mt-0">
                  {service.index}
                </span>

                <div className="min-w-0 flex-1 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
                  <h3 className="display-md transition-transform duration-500 ease-out group-hover:translate-x-1.5 lg:col-span-4">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone lg:col-span-7 lg:mt-0">
                    {service.description}
                  </p>
                </div>

                {/* Thumbnail — appears on hover, desktop only. Decorative. */}
                <span
                  aria-hidden
                  className="pointer-events-none relative hidden h-24 w-32 shrink-0 overflow-hidden opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 xl:block"
                >
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="128px"
                    quality={70}
                    className="scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-100"
                  />
                </span>

                <ArrowUpRight
                  aria-hidden
                  className="mt-1.5 size-5 shrink-0 text-stone transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay lg:mt-0"
                  strokeWidth={1.25}
                />
                <span className="sr-only">— request a quote for {service.title}</span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.12}>
          <Link
            href="/services"
            className="group mt-12 inline-flex min-h-11 items-center gap-3 border-b border-line-strong pb-2 text-[0.75rem] uppercase tracking-[0.18em] text-ink transition-colors hover:border-clay hover:text-clay"
          >
            See what each one involves
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

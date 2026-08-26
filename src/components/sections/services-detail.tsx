import Image from "next/image";
import { services } from "@/lib/business";
import { Reveal } from "../ui/reveal";
import { ButtonLink } from "../ui/button";

/**
 * The services page. Each service gets a full spread with its photograph,
 * alternating sides so the page reads as a sequence rather than a list.
 */
export function ServicesDetail() {
  return (
    <div className="bg-bone">
      {services.map((service, index) => {
        const flipped = index % 2 === 1;

        return (
          <section
            key={service.title}
            id={service.title.toLowerCase().replace(/[^a-z]+/g, "-")}
            className={[
              "py-[var(--sec)]",
              flipped ? "bg-bone-deep" : "bg-bone",
            ].join(" ")}
          >
            <div className="shell">
              <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
                <Reveal
                  className={[
                    "lg:col-span-6",
                    flipped ? "lg:order-2" : "",
                  ].join(" ")}
                  distance={26}
                >
                  <figure className="relative aspect-4/3 overflow-hidden bg-bone-deep lg:aspect-4/5">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      quality={80}
                      className="object-cover"
                    />
                  </figure>
                </Reveal>

                <div className={["lg:col-span-6", flipped ? "lg:order-1" : ""].join(" ")}>
                  <Reveal>
                    <p className="eyebrow text-clay">{service.index}</p>
                  </Reveal>

                  <Reveal delay={0.08}>
                    <h2 className="display-lg mt-4">{service.title}</h2>
                  </Reveal>

                  <Reveal delay={0.16}>
                    <p className="lede mt-7">{service.description}</p>
                  </Reveal>

                  <Reveal delay={0.24}>
                    <p className="mt-6 leading-relaxed text-stone [max-width:var(--measure)]">
                      {service.detail}
                    </p>
                  </Reveal>

                  <Reveal delay={0.32}>
                    <div className="mt-10">
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
      })}
    </div>
  );
}

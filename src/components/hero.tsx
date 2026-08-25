"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";
import { business } from "@/lib/business";
import { ButtonLink } from "./ui/button";
import { RevealOnLoad } from "./ui/reveal";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="top" className="relative isolate min-h-[92svh] overflow-hidden bg-ink">
      {/* Photograph: settles from a slight scale, so the page arrives rather than snaps */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: reduced ? 1 : 1.07, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/images/hero.jpg"
          alt="Weatherboard home with a wraparound verandah, painted in a soft white"
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover object-center"
        />
      </motion.div>

      {/* Two-axis scrim. The vertical wash sets the mood; the horizontal one
          sits under the text column only, so the photograph stays open on the
          right while every line of type clears AA against it. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/72 via-ink/60 to-ink/88 sm:from-ink/70 sm:via-ink/40 sm:to-ink/85"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-ink/80 via-ink/55 to-ink/10 sm:block"
      />

      <div className="shell relative flex min-h-[92svh] flex-col justify-end pb-16 pt-32 sm:pb-20 lg:pb-24">
        <div className="max-w-4xl">
          <RevealOnLoad delay={0.25}>
            <p className="eyebrow text-bone/85">
              Leopold · Geelong · The Bellarine
            </p>
          </RevealOnLoad>

          <RevealOnLoad delay={0.38} distance={26}>
            <h1 className="display-xl mt-6 text-bone">
              Premium Painting
              <span className="block italic text-clay-light">&amp; Decorating</span>
            </h1>
          </RevealOnLoad>

          <RevealOnLoad delay={0.52}>
            <p className="lede mt-8 max-w-xl text-bone">
              Quality finishes and professional painting services across Geelong
              and the Bellarine.
            </p>
          </RevealOnLoad>

          <RevealOnLoad delay={0.64}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <ButtonLink href="#contact" variant="invert">
                Request a Quote
              </ButtonLink>
              <ButtonLink href="#work" variant="light">
                View Our Work
              </ButtonLink>
            </div>
          </RevealOnLoad>
        </div>

        {/* Rating strip, sitting on the hairline that closes the hero */}
        <RevealOnLoad delay={0.8}>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-bone/20 pt-6">
            <div className="flex items-center gap-3.5">
              <span className="flex gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-3.5 fill-clay-light text-clay-light"
                    strokeWidth={0}
                  />
                ))}
              </span>
              <p className="text-[0.8125rem] tracking-[0.06em] text-bone">
                {business.rating.value.toFixed(1)} on {business.rating.source}
                <span className="text-bone/75">
                  {" "}
                  · {business.rating.count} reviews
                </span>
              </p>
            </div>

            <a
              href="#about"
              className="group inline-flex min-h-11 items-center gap-2.5 text-[0.75rem] uppercase tracking-[0.18em] text-bone/90 transition-colors hover:text-bone"
            >
              Scroll
              <ArrowDown
                aria-hidden
                className="size-3.5 transition-transform duration-300 group-hover:translate-y-1"
                strokeWidth={1.5}
              />
            </a>
          </div>
        </RevealOnLoad>
      </div>
    </section>
  );
}

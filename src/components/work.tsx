"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { gallery } from "@/lib/business";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

export function Work() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + gallery.length) % gallery.length,
      ),
    [],
  );

  useEffect(() => {
    if (openIndex === null) {
      lastFocused.current?.focus();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : gallery[openIndex];

  return (
    <section id="work" className="bg-bone py-[var(--sec)]">
      <div className="shell">
        <SectionHeading
          eyebrow="Our Work"
          title={
            <>
              Finishes worth <span className="italic text-clay">looking at</span>
            </>
          }
        >
          <p className="lede">
            Interiors, exteriors and the details in between.
          </p>
        </SectionHeading>

        {/* Composed spread: each frame has a footprint chosen for the
            photograph in it, so the grid never leaves a hole to explain. */}
        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4 lg:mt-20">
          {gallery.map((item, index) => (
            <Reveal
              key={item.src}
              delay={(index % 3) * 0.08}
              distance={26}
              className={item.frame}
            >
              <button
                type="button"
                onClick={(event) => {
                  lastFocused.current = event.currentTarget;
                  setOpenIndex(index);
                }}
                aria-label={`Open larger view: ${item.caption}`}
                className="group relative block size-full cursor-pointer overflow-hidden bg-bone-deep"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 94vw"
                  quality={80}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                />

                {/* Caption veil — only on hover/focus, so the photograph leads */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center p-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  <span className="text-[0.6875rem] uppercase tracking-[0.18em] text-bone">
                    {item.caption}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/97 backdrop-blur-sm"
            onClick={close}
          >
            <div className="flex items-center justify-between px-[var(--gut)] py-5">
              <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-bone/70">
                {active.caption}
                <span className="ml-3 text-bone/40">
                  {(openIndex ?? 0) + 1} / {gallery.length}
                </span>
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close larger view"
                className="-mr-2 grid size-11 cursor-pointer place-items-center text-bone/75 transition-colors hover:text-bone"
              >
                <X aria-hidden className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <div
              className="relative flex-1 px-[var(--gut)] pb-6"
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                key={active.src}
                initial={{ opacity: 0, scale: reduced ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative size-full"
              >
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="100vw"
                  quality={85}
                  className="object-contain"
                />
              </motion.div>
            </div>

            <div
              className="flex items-center justify-center gap-3 pb-8"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="grid size-12 cursor-pointer place-items-center border border-bone/25 text-bone/75 transition-colors hover:border-bone hover:text-bone"
              >
                <ChevronLeft aria-hidden className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="grid size-12 cursor-pointer place-items-center border border-bone/25 text-bone/75 transition-colors hover:border-bone hover:text-bone"
              >
                <ChevronRight aria-hidden className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

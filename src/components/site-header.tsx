"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { business, navLinks } from "@/lib/business";

/** "/" matches only itself; every other link matches its own subtree. */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  /**
   * The route the panel was opened on. Deriving `open` from it means a
   * navigation closes the panel on its own, with no effect to synchronise.
   */
  const [openPath, setOpenPath] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const open = openPath === pathname;

  /** Only the home page puts a photograph behind the header. */
  const overHero = pathname === "/";
  /** True whenever the header needs its own background rather than the photo. */
  const solid = scrolled || open || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile panel, and close it on Escape.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Move focus into the panel when it opens, so the keyboard follows the eye.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
  }, [open]);


  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-out",
        solid
          ? "border-b border-line bg-bone/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="shell">
        <div
          className={[
            "flex items-center justify-between transition-[height] duration-500 ease-out",
            scrolled || !overHero ? "h-[4.5rem]" : "h-[5.5rem] sm:h-24",
          ].join(" ")}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group -ml-0.5 flex min-h-11 items-center gap-2"
            aria-label={`${business.legalName} — home`}
          >
            <span
              className={[
                "font-display text-2xl leading-none transition-colors duration-300 sm:text-[1.75rem]",
                solid ? "text-ink" : "text-bone",
              ].join(" ")}
            >
              M. McCrohan
            </span>
            <span
              aria-hidden
              className={[
                "hidden h-px w-8 transition-colors duration-300 sm:block",
                solid ? "bg-clay" : "bg-clay-light",
              ].join(" ")}
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "relative inline-flex min-h-11 items-center text-[0.8125rem] tracking-[0.06em] transition-colors duration-200",
                        "after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left",
                        "after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100",
                        active ? "after:scale-x-100" : "after:scale-x-0",
                        solid
                          ? "text-graphite hover:text-ink after:bg-clay"
                          // Over the photograph the indicator takes the text
                          // colour — clay-light drops under 3:1 on a bright frame.
                          : "text-bone/85 hover:text-bone after:bg-bone",
                        active ? (solid ? "text-ink" : "text-bone") : "",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={business.phoneHref}
              className={[
                "hidden min-h-11 items-center gap-2 px-1 text-[0.8125rem] tracking-[0.06em] transition-colors duration-200 md:inline-flex",
                solid ? "text-graphite hover:text-clay" : "text-bone/85 hover:text-bone",
              ].join(" ")}
            >
              <Phone aria-hidden className="size-3.5" strokeWidth={1.5} />
              {business.phone}
            </a>

            <Link
              href="/contact"
              className={[
                "hidden min-h-11 items-center px-6 text-[0.75rem] font-medium uppercase tracking-[0.14em]",
                "transition-colors duration-200 sm:inline-flex",
                solid
                  ? "bg-ink text-bone hover:bg-clay"
                  : "border border-bone/50 text-bone hover:bg-bone hover:text-ink",
              ].join(" ")}
            >
              Request a Quote
            </Link>

            {/* Call — the one action worth a permanent slot on a small screen */}
            <a
              href={business.phoneHref}
              aria-label={`Call ${business.phone}`}
              className={[
                "grid size-11 cursor-pointer place-items-center transition-colors duration-200 md:hidden",
                solid ? "text-ink hover:text-clay" : "text-bone",
              ].join(" ")}
            >
              <Phone aria-hidden className="size-[1.15rem]" strokeWidth={1.5} />
            </a>

            {/* Mobile toggle */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpenPath(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={[
                "-mr-2 grid size-11 cursor-pointer place-items-center transition-colors duration-200 lg:hidden",
                solid ? "text-ink" : "text-bone",
              ].join(" ")}
            >
              {open ? (
                <X aria-hidden className="size-5" strokeWidth={1.5} />
              ) : (
                <Menu aria-hidden className="size-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-bone lg:hidden"
          >
            <nav aria-label="Mobile" className="shell py-8">
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href} className="border-b border-line last:border-b-0">
                      <Link
                        href={link.href}
                        onClick={() => setOpenPath(null)}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "flex min-h-14 items-center font-display text-3xl",
                          active ? "text-clay" : "text-ink",
                        ].join(" ")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={business.phoneHref}
                  onClick={() => setOpenPath(null)}
                  className="inline-flex min-h-13 items-center justify-center gap-2.5 border border-line-strong px-6 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-ink"
                >
                  <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                  {business.phone}
                </a>
                <Link
                  href="/contact"
                  onClick={() => setOpenPath(null)}
                  className="inline-flex min-h-13 items-center justify-center bg-ink px-6 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-bone"
                >
                  Request a Quote
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

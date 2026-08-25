import { business, addressLine, navLinks } from "@/lib/business";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink py-16 text-bone">
      <div className="shell">
        <div className="flex flex-col gap-10 border-b border-bone/15 pb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-3xl">M. McCrohan</p>
            <p className="mt-2 text-[0.8125rem] uppercase tracking-[0.18em] text-bone/55">
              {business.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-[0.875rem] text-bone/70 transition-colors hover:text-bone"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic text-[0.875rem] leading-relaxed text-bone/70">
            <a
              href={business.phoneHref}
              className="inline-flex min-h-11 items-center text-bone transition-colors hover:text-clay-light"
            >
              {business.phone}
            </a>
            <span className="mt-1 block">{addressLine}</span>
          </address>
        </div>

        <p className="mt-8 text-[0.8125rem] text-bone/45">
          © {year} {business.legalName}. Painting &amp; decorating in Geelong and
          the Bellarine.
        </p>
      </div>
    </footer>
  );
}

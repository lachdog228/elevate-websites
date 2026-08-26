import type { ReactNode } from "react";
import { RevealOnLoad } from "./ui/reveal";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
};

/**
 * The masthead every page except home opens with. It carries the page's h1
 * and clears the fixed header, so sections below can start at their own
 * rhythm without extra top padding.
 */
export function PageHeader({ eyebrow, title, lede }: Props) {
  return (
    <header className="bg-ink pb-[var(--sec)] pt-36 text-bone sm:pt-44">
      <div className="shell">
        <RevealOnLoad delay={0.05}>
          <p className="eyebrow text-bone/65">{eyebrow}</p>
        </RevealOnLoad>

        <RevealOnLoad delay={0.15} distance={24}>
          <h1 className="display-lg mt-6 max-w-4xl text-bone">{title}</h1>
        </RevealOnLoad>

        {lede ? (
          <RevealOnLoad delay={0.28}>
            <p className="lede mt-7 max-w-xl text-bone/80">{lede}</p>
          </RevealOnLoad>
        ) : null}
      </div>
    </header>
  );
}

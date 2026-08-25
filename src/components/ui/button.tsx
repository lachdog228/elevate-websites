import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "solid" | "invert" | "outline" | "light";

const base =
  "group inline-flex items-center justify-center gap-2.5 min-h-12 px-7 " +
  "text-[0.8125rem] font-medium uppercase tracking-[0.14em] " +
  "cursor-pointer transition-colors duration-200 ease-out";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-bone hover:bg-clay",
  invert: "bg-bone text-ink hover:bg-clay-light",
  outline: "border border-line-strong text-ink hover:bg-ink hover:text-bone hover:border-ink",
  light: "border border-bone/70 text-bone hover:bg-bone hover:text-ink hover:border-bone",
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "solid",
  children,
  className = "",
  ...rest
}: ButtonLinkProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const external = href.startsWith("tel:") || href.startsWith("http");

  if (external) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

type SubmitButtonProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function SubmitButton({ children, className = "", ...rest }: SubmitButtonProps) {
  return (
    <button type="submit" className={`${base} ${variants.solid} ${className}`} {...rest}>
      {children}
    </button>
  );
}

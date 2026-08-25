import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type Props = {
  eyebrow: string;
  title: ReactNode;
  /** Rendered under the title, at reading width. */
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  tone = "dark",
}: Props) {
  const alignment = align === "center" ? "items-center text-center" : "items-start";
  const eyebrowTone = tone === "light" ? "text-bone/65" : "";
  const titleTone = tone === "light" ? "text-bone" : "";

  return (
    <div className={`flex flex-col ${alignment}`}>
      <Reveal>
        <p className={`eyebrow ${eyebrowTone}`}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`display-lg mt-5 ${titleTone}`}>{title}</h2>
      </Reveal>
      {children ? (
        <Reveal delay={0.16}>
          <div className={align === "center" ? "mx-auto mt-6" : "mt-6"}>{children}</div>
        </Reveal>
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import { isDraft } from "./site";

const suffix = "M. McCrohan — Painting & Decorating";

/**
 * Per-page metadata. Canonical URLs and the Open Graph card are withheld while
 * the site is a draft, so a stray crawl can't index placeholder photography as
 * the business's own work.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = path === "/" ? title : `${title} | ${suffix}`;

  return {
    title: fullTitle,
    description,
    alternates: isDraft ? undefined : { canonical: path },
    openGraph: isDraft
      ? undefined
      : {
          type: "website",
          locale: "en_AU",
          url: path,
          siteName: suffix,
          title: fullTitle,
          description,
          images: [
            {
              url: "/images/og-card.jpg",
              width: 1200,
              height: 630,
              alt: "Weatherboard home painted by M. McCrohan, Leopold",
            },
          ],
        },
  };
}

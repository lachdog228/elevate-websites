import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { ServicesList } from "@/components/sections/services-list";
import { WorkGallery } from "@/components/sections/work-gallery";
import { Reviews } from "@/components/sections/reviews";
import { CtaBand } from "@/components/sections/cta-band";
import { galleryPreview } from "@/lib/business";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "M. McCrohan — Painting & Decorating | Geelong & the Bellarine",
  description:
    "Interior and exterior painting, new work and repaints. Based in Leopold, serving Geelong and the Bellarine. Rated 5.0 on Google. Call 0411 353 716 for a free quote.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <ServicesList />
      <WorkGallery
        items={galleryPreview}
        lede="A few recent finishes, inside and out."
        moreHref="/work"
      />
      <Reviews />
      <CtaBand />
    </>
  );
}

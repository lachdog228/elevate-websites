import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AboutDetail } from "@/components/sections/about-detail";
import { Reviews } from "@/components/sections/reviews";
import { CtaBand } from "@/components/sections/cta-band";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "M. McCrohan is a painting and decorating business working out of Leopold — interior and exterior, new work and repaints, for homes across Geelong and the Bellarine.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            A careful trade,{" "}
            <span className="italic text-clay-light">done properly.</span>
          </>
        }
        lede="Painting and decorating out of Leopold, for homes across Geelong and the Bellarine."
      />
      <AboutDetail />
      <Reviews compact />
      <CtaBand />
    </>
  );
}

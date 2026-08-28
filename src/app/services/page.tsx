import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ServicesDetail } from "@/components/sections/services-detail";
import { CtaBand } from "@/components/sections/cta-band";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Interior painting, exterior painting, and repaints and decorating across Geelong and the Bellarine — what each one involves and how the work is done.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            What we <span className="italic text-clay-light">do</span>
          </>
        }
        lede="Painting, carpentry and the coordination that keeps a job moving — all of it finished to the same standard."
      />
      <ServicesDetail />
      <CtaBand />
    </>
  );
}

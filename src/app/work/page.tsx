import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { WorkGallery } from "@/components/sections/work-gallery";
import { CtaBand } from "@/components/sections/cta-band";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Our Work",
  description:
    "A gallery of interior and exterior painting across Geelong and the Bellarine — walls, ceilings, trim, weatherboard and render.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title={
          <>
            Finishes worth{" "}
            <span className="italic text-clay-light">looking at</span>
          </>
        }
        lede="Interiors, exteriors and the details in between."
      />
      <WorkGallery
        eyebrow="Gallery"
        title={<>Recent work</>}
        lede="Select any frame for a closer look."
      />
      <CtaBand />
    </>
  );
}

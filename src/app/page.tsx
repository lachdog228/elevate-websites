import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
import { Reviews } from "@/components/reviews";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Work />
        <Reviews />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}

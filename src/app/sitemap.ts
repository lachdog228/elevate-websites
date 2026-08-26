import type { MetadataRoute } from "next";
import { navLinks } from "@/lib/business";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return navLinks.map((link) => ({
    url: link.href === "/" ? siteUrl : `${siteUrl}${link.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}

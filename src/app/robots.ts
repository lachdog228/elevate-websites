import type { MetadataRoute } from "next";
import { isDraft, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (isDraft) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

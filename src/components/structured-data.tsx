import { business, addressLine } from "@/lib/business";
import { siteUrl } from "@/lib/site";

/**
 * LocalBusiness (HousePainter) markup. Every value is taken from the
 * business's own public listings — see src/lib/business.ts.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    "@id": `${siteUrl}/#business`,
    name: business.legalName,
    url: siteUrl,
    image: `${siteUrl}/images/og-card.jpg`,
    telephone: business.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.suburb,
      addressRegion: business.address.state,
      postalCode: business.address.postcode,
      addressCountry: business.address.country,
    },
    areaServed: business.areaServed.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    openingHours: business.openingHours,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating.value,
      reviewCount: business.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    description: `${business.legalName} — interior and exterior painting, new work and repaints, at ${addressLine}. Serving Geelong and the Bellarine.`,
  };

  return (
    <script
      type="application/ld+json"
      // Content is a fixed object built above, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

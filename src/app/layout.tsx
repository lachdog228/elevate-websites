import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { StructuredData } from "@/components/structured-data";
import { isDraft, siteUrl } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const title = "M. McCrohan — Painting & Decorating | Geelong & the Bellarine";
const description =
  "Interior and exterior painting, new work and repaints. Based in Leopold, serving Geelong and the Bellarine. Rated 5.0 on Google. Call 0411 353 716 for a free quote.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "M. McCrohan — Painting & Decorating",
  alternates: isDraft ? undefined : { canonical: "/" },
  robots: isDraft
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },
  openGraph: isDraft
    ? undefined
    : {
        type: "website",
        locale: "en_AU",
        url: siteUrl,
        siteName: "M. McCrohan — Painting & Decorating",
        title,
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
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#17150f",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-bone"
        >
          Skip to content
        </a>
        {children}
        <StructuredData />
      </body>
    </html>
  );
}

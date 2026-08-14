import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, localBusinessJsonLd } from "@/lib/seo";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "custom tailoring Trivandrum",
    "tailor Trivandrum",
    "stitching centre Trivandrum",
    "cloth stitching online",
    "custom stitching centre Thiruvananthapuram",
    "made to measure clothing Kerala",
    "bespoke tailoring Thiruvananthapuram",
    "custom kurta shirt dress Trivandrum",
    "Knit and Knot",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

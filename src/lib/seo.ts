export const SITE_URL = "https://www.knitandknot.shop";
export const SITE_NAME = "Knit & Knot";
export const BUSINESS_PHONE = "+919562572931";
export const BUSINESS_INSTAGRAM = "https://www.instagram.com/knit__and_knot/";
export const BUSINESS_WHATSAPP = "https://wa.me/919562572931";

export const DEFAULT_TITLE = "Knit & Knot — Custom Tailoring & Stitching Centre in Trivandrum";
export const DEFAULT_DESCRIPTION =
  "Knit & Knot is a custom tailoring and stitching centre in Trivandrum for working professionals and college students. Choose a material, customise a design, or order stitched clothing online — made to your measurements with doorstep delivery.";

// A representative shot used as the default social-share / OG image until
// a proper brand photo/logo is supplied.
export const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80";

// LocalBusiness structured data — helps Google understand this is a real,
// local tailoring business (feeds the Maps 3-pack / local search results,
// not just organic web results).
//
// TODO: once the exact shop address and opening hours are available, add:
//   address: { "@type": "PostalAddress", streetAddress: "...", addressLocality: "Thiruvananthapuram", addressRegion: "Kerala", postalCode: "...", addressCountry: "IN" },
//   openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: [...], opens: "10:00", closes: "19:00" }],
// This matters a lot for "near me" / local pack ranking — pair it with a
// fully completed Google Business Profile using the same details.
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["ClothingStore", "TailorShop"],
  name: SITE_NAME,
  url: SITE_URL,
  telephone: BUSINESS_PHONE,
  priceRange: "₹₹",
  image: DEFAULT_OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  areaServed: {
    "@type": "City",
    name: "Thiruvananthapuram (Trivandrum)",
  },
  sameAs: [BUSINESS_INSTAGRAM, BUSINESS_WHATSAPP],
};

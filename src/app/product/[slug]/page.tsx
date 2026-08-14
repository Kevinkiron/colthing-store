import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicSupabase } from "@/lib/supabase/public";
import { getProductBySlug } from "@/lib/queries";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(publicSupabase, slug);
  if (!product) return {};

  const title = product.name;
  const description =
    product.description?.slice(0, 155) ??
    `${product.name} — made to measure at Knit & Knot, a custom tailoring centre in Trivandrum.`;
  const image = product.product_images?.[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(publicSupabase, slug);
  if (!product) notFound();

  const inStock = (product.product_variants ?? []).some((v) => v.stock > 0);
  const image = product.product_images?.[0]?.url;

  // Invisible to visitors — this only feeds search engines, letting Google
  // show price/availability directly in the search result for this page.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: image ? [image] : undefined,
    sku: product.sku ?? undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.base_price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}

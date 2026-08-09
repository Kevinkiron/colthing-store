import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicSupabase } from "@/lib/supabase/public";
import { getProductBySlug } from "@/lib/queries";
import ProductDetailClient from "@/components/product/ProductDetailClient";

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

  return <ProductDetailClient product={product} />;
}

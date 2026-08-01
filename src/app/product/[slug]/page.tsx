import { notFound } from "next/navigation";
import { publicSupabase } from "@/lib/supabase/public";
import { getProductBySlug } from "@/lib/queries";
import ProductDetailClient from "@/components/product/ProductDetailClient";

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

import { notFound } from "next/navigation";
import { publicSupabase } from "@/lib/supabase/public";
import { getProductBySlug } from "@/lib/queries";
import CustomizeClient from "@/components/product/CustomizeClient";

export default async function CustomizePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(publicSupabase, slug);
  if (!product || !product.customization_enabled) notFound();

  return <CustomizeClient product={product} />;
}

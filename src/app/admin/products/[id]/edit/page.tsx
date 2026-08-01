"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*, categories(*), product_images(*), product_variants(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProduct(data as Product);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-sm text-black/50">Loading...</p>;
  if (!product) return <p className="text-sm text-black/50">Product not found.</p>;

  return (
    <div>
      <h1 className="font-display mb-8 text-3xl">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}

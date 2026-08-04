"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { publicSupabase } from "@/lib/supabase/public";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/shop/ProductCard";
import { useWishlistStore } from "@/store/wishlist-store";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.productIds);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    publicSupabase
      .from("products")
      .select(
        "*, categories(id,name,slug,sort_order), product_images(*), product_variants(*)"
      )
      .in("id", ids)
      .then(({ data }) => setProducts((data as Product[]) ?? []));
  }, [ids]);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <h1 className="font-display mb-10 text-4xl">Your Wishlist</h1>
      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-black/60">Nothing saved yet.</p>
          <Link href="/shop" className="mt-6 inline-block rounded-full bg-espresso px-8 py-3 text-sm text-white">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}

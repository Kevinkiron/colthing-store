"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { publicSupabase } from "@/lib/supabase/public";
import { getCategories, getProducts } from "@/lib/queries";
import type { Category, Product } from "@/lib/types";
import ProductCard from "@/components/shop/ProductCard";
import Filters from "@/components/shop/Filters";

function ShopContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState("newest");

  const activeCategory = params.get("category");

  useEffect(() => {
    getCategories(publicSupabase).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(publicSupabase, {
      categorySlug: activeCategory ?? undefined,
      search: search || undefined,
    })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") list.sort((a, b) => a.base_price - b.base_price);
    if (sort === "price-desc") list.sort((a, b) => b.base_price - a.base_price);
    return list;
  }, [products, sort]);

  function setCategory(slug: string | null) {
    const sp = new URLSearchParams(params.toString());
    if (slug) sp.set("category", slug);
    else sp.delete("category");
    router.push(`/shop?${sp.toString()}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-10 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Shop</span>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">The Full Collection</h1>
      </div>

      <div className="mb-8 flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 md:max-w-sm">
        <Search className="h-4 w-4 text-black/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <Filters
        categories={categories}
        active={activeCategory}
        onChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-black/5" />
          ))
        ) : sorted.length === 0 ? (
          <p className="col-span-full py-20 text-center text-black/50">
            No products found. Add your first item from the admin panel.
          </p>
        ) : (
          sorted.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
        )}
      </div>
    </main>
  );
}

export default function ShopClient() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}

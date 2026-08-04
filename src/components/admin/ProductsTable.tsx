"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductsTable() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*, categories(*), materials(name), product_images(*), product_variants(*)")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm text-white">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-black/50">No products yet. Add your first one.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs uppercase text-black/40">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Material</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stock = (p.product_variants ?? []).reduce((s, v) => s + v.stock, 0);
                const img = p.product_images?.[0]?.url;
                return (
                  <tr key={p.id} className="border-b border-black/5">
                    <td className="flex items-center gap-3 p-4">
                      <div className="relative h-12 w-10 overflow-hidden rounded bg-cream">
                        {img && <Image src={img} alt={p.name} fill className="object-cover" />}
                      </div>
                      {p.name}
                    </td>
                    <td className="p-4 text-black/60">{p.categories?.name ?? "—"}</td>
                    <td className="p-4 text-black/60">{p.materials?.name ?? "—"}</td>
                    <td className="p-4">{formatPrice(p.base_price)}</td>
                    <td className="p-4">{stock}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize">{p.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-3">
                        <Link href={`/admin/products/${p.id}/edit`} aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                        <button onClick={() => handleDelete(p.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

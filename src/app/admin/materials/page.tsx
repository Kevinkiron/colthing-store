"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Material } from "@/lib/types";

export default function AdminMaterialsPage() {
  const supabase = createClient();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("materials").select("*, categories(*)").order("created_at", { ascending: false });
    setMaterials((data as Material[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this material? Products using it will keep their data but lose the material link.")) return;
    await supabase.from("materials").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl">Materials</h1>
        <Link href="/admin/materials/new" className="flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm text-white">
          <Plus className="h-4 w-4" /> Add Material
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : materials.length === 0 ? (
        <p className="text-sm text-black/50">No materials yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs uppercase text-black/40">
                <th className="p-4">Material</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="border-b border-black/5">
                  <td className="flex items-center gap-3 p-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-cream">
                      {m.main_image && <Image src={m.main_image} alt={m.name} fill className="object-cover" />}
                    </div>
                    {m.name}
                    {m.is_featured && <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] text-gold">Featured</span>}
                  </td>
                  <td className="p-4 text-black/60">{m.categories?.name ?? "—"}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${m.is_active ? "bg-black/5" : "bg-red-50 text-red-600"}`}>
                      {m.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/materials/${m.id}/edit`} aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => remove(m.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

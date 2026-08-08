"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import { slugify } from "@/lib/utils";

type FormState = { id?: string; name: string; slug: string; description: string; sort_order: string; is_active: boolean };
const emptyForm: FormState = { name: "", slug: "", description: "", sort_order: "0", is_active: true };

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm({ ...emptyForm });
  }
  function openEdit(c: Category) {
    setForm({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      sort_order: String(c.sort_order),
      is_active: c.is_active,
    });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      sort_order: parseInt(form.sort_order || "0", 10),
      is_active: form.is_active,
    };
    if (form.id) {
      await supabase.from("categories").update(payload).eq("id", form.id);
    } else {
      await supabase.from("categories").insert(payload);
    }
    setSaving(false);
    setForm(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Materials referencing it will keep their material but lose the category link.")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl">Categories</h1>
        <button onClick={openNew} className="flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm text-white">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs uppercase text-black/40">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-black/5">
                  <td className="p-4">{c.name}</td>
                  <td className="p-4 text-black/50">{c.slug}</td>
                  <td className="p-4">{c.sort_order}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${c.is_active ? "bg-black/5" : "bg-red-50 text-red-600"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(c)} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(c.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl">{form.id ? "Edit" : "Add"} Category</h3>
              <button onClick={() => setForm(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm" />
              <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm" />
              <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            </div>
            <button disabled={saving || !form.name} onClick={save} className="mt-5 w-full rounded-full bg-espresso py-2.5 text-sm text-white disabled:opacity-50">
              {saving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

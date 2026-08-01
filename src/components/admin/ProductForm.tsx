"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

type ImageRow = { id?: string; url: string; alt: string; color: string };
type VariantRow = { id?: string; size: string; color: string; color_hex: string; sku: string; price: string; stock: string };

export default function ProductForm({ product }: { product?: Product }) {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [basePrice, setBasePrice] = useState(product?.base_price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compare_at_price?.toString() ?? "");
  const [fabric, setFabric] = useState(product?.fabric ?? "");
  const [care, setCare] = useState(product?.care_instructions ?? "");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isBestseller, setIsBestseller] = useState(product?.is_bestseller ?? false);
  const [isNew, setIsNew] = useState(product?.is_new ?? true);
  const [status, setStatus] = useState(product?.status ?? "active");
  const [images, setImages] = useState<ImageRow[]>(
    product?.product_images?.map((i) => ({ id: i.id, url: i.url, alt: i.alt ?? "", color: i.color ?? "" })) ?? []
  );
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.product_variants?.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      color_hex: v.color_hex ?? "",
      sku: v.sku ?? "",
      price: v.price?.toString() ?? "",
      stock: v.stock?.toString() ?? "0",
    })) ?? [{ size: "M", color: "Black", color_hex: "#111111", sku: "", price: "", stock: "10" }]
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => {
      setCategories((data as Category[]) ?? []);
    });
  }, [supabase]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  function addVariant() {
    setVariants((v) => [...v, { size: "", color: "", color_hex: "#111111", sku: "", price: "", stock: "0" }]);
  }
  function updateVariant(i: number, patch: Partial<VariantRow>) {
    setVariants((v) => v.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function addImageUrl() {
    setImages((imgs) => [...imgs, { url: "", alt: name, color: "" }]);
  }
  function updateImage(i: number, patch: Partial<ImageRow>) {
    setImages((imgs) => imgs.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  function removeImage(i: number) {
    setImages((imgs) => imgs.filter((_, idx) => idx !== i));
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newImages: ImageRow[] = [];
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error: uploadErr } = await supabase.storage.from("product-images").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        newImages.push({ url: data.publicUrl, alt: name, color: "" });
      }
      setImages((imgs) => [...imgs, ...newImages]);
    } catch (err) {
      console.error(err);
      setError("Image upload failed. You can also paste an image URL instead.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        slug,
        description,
        category_id: categoryId || null,
        base_price: parseFloat(basePrice || "0"),
        compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
        fabric,
        care_instructions: care,
        is_featured: isFeatured,
        is_bestseller: isBestseller,
        is_new: isNew,
        status,
      };

      let productId = product?.id;

      if (productId) {
        const { error: updateErr } = await supabase.from("products").update(payload).eq("id", productId);
        if (updateErr) throw updateErr;
        await supabase.from("product_images").delete().eq("product_id", productId);
        await supabase.from("product_variants").delete().eq("product_id", productId);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from("products")
          .insert(payload)
          .select()
          .single();
        if (insertErr) throw insertErr;
        productId = inserted.id;
      }

      if (images.length > 0) {
        const { error: imgErr } = await supabase.from("product_images").insert(
          images
            .filter((i) => i.url)
            .map((i, idx) => ({
              product_id: productId,
              url: i.url,
              alt: i.alt || name,
              color: i.color || null,
              sort_order: idx,
            }))
        );
        if (imgErr) throw imgErr;
      }

      if (variants.length > 0) {
        const { error: varErr } = await supabase.from("product_variants").insert(
          variants
            .filter((v) => v.size && v.color)
            .map((v) => ({
              product_id: productId,
              size: v.size,
              color: v.color,
              color_hex: v.color_hex || null,
              sku: v.sku || null,
              price: v.price ? parseFloat(v.price) : null,
              stock: parseInt(v.stock || "0", 10),
            }))
        );
        if (varErr) throw varErr;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to save product.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 pb-24">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-black/50">Product Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-black/50">Slug (URL)</label>
          <input
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
            className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-black/50">Description</label>
        <textarea value={description ?? ""} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-black/50">Category</label>
          <select value={categoryId ?? ""} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm">
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-black/50">Base Price (₹)</label>
          <input required type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-black/50">Compare-at Price (₹)</label>
          <input type="number" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-black/50">Fabric</label>
          <input value={fabric ?? ""} onChange={(e) => setFabric(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-black/50">Care Instructions</label>
          <input value={care ?? ""} onChange={(e) => setCare(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} /> Bestseller</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} /> New</label>
        <div className="flex items-center gap-2">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="rounded-lg border border-black/15 px-2 py-1.5 text-sm">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs text-black/50">Images</label>
          <div className="flex gap-3">
            <button type="button" onClick={addImageUrl} className="text-xs text-black/60 underline">+ Add URL</button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-xs text-black/60 underline">
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />} Upload
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFileUpload(e.target.files)} />
          </div>
        </div>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input placeholder="Image URL" value={img.url} onChange={(e) => updateImage(i, { url: e.target.value })} className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-xs" />
              <input placeholder="Color (optional)" value={img.color} onChange={(e) => updateImage(i, { color: e.target.value })} className="w-32 rounded-lg border border-black/15 px-3 py-2 text-xs" />
              <button type="button" onClick={() => removeImage(i)} aria-label="Remove image"><Trash2 className="h-4 w-4 text-black/40" /></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs text-black/50">Variants (Size / Colour / Stock)</label>
          <button type="button" onClick={addVariant} className="flex items-center gap-1 text-xs text-black/60 underline">
            <Plus className="h-3 w-3" /> Add Variant
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-6 gap-2">
              <input placeholder="Size" value={v.size} onChange={(e) => updateVariant(i, { size: e.target.value })} className="rounded-lg border border-black/15 px-2 py-2 text-xs" />
              <input placeholder="Colour" value={v.color} onChange={(e) => updateVariant(i, { color: e.target.value })} className="rounded-lg border border-black/15 px-2 py-2 text-xs" />
              <input type="color" value={v.color_hex || "#111111"} onChange={(e) => updateVariant(i, { color_hex: e.target.value })} className="h-9 w-full rounded-lg border border-black/15" />
              <input placeholder="SKU" value={v.sku} onChange={(e) => updateVariant(i, { sku: e.target.value })} className="rounded-lg border border-black/15 px-2 py-2 text-xs" />
              <input type="number" step="0.01" placeholder="Price override" value={v.price} onChange={(e) => updateVariant(i, { price: e.target.value })} className="rounded-lg border border-black/15 px-2 py-2 text-xs" />
              <div className="flex items-center gap-1">
                <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariant(i, { stock: e.target.value })} className="w-full rounded-lg border border-black/15 px-2 py-2 text-xs" />
                <button type="button" onClick={() => removeVariant(i)} aria-label="Remove variant"><Trash2 className="h-4 w-4 text-black/40" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button disabled={saving} className="rounded-full bg-[--color-charcoal] px-8 py-3 text-sm text-white disabled:opacity-50">
        {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}

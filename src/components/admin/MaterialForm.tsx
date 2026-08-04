"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Category, Material } from "@/lib/types";

type ImageRow = { id?: string; url: string; image_type: "gallery" | "texture" | "lifestyle"; alt: string };

export default function MaterialForm({ material }: { material?: Material }) {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(material?.name ?? "");
  const [slug, setSlug] = useState(material?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!material);
  const [categoryId, setCategoryId] = useState(material?.category_id ?? "");
  const [description, setDescription] = useState(material?.description ?? "");
  const [composition, setComposition] = useState(material?.composition ?? "");
  const [color, setColor] = useState(material?.color ?? "");
  const [texture, setTexture] = useState(material?.texture ?? "");
  const [characteristics, setCharacteristics] = useState(material?.characteristics ?? "");
  const [care, setCare] = useState(material?.care_instructions ?? "");
  const [mainImage, setMainImage] = useState(material?.main_image ?? "");
  const [isActive, setIsActive] = useState(material?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(material?.is_featured ?? false);
  const [images, setImages] = useState<ImageRow[]>(
    material?.material_images?.map((i) => ({ id: i.id, url: i.url, image_type: i.image_type, alt: i.alt ?? "" })) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  async function handleUpload(files: FileList | null, type: ImageRow["image_type"]) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: ImageRow[] = [];
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error: uploadErr } = await supabase.storage.from("material-images").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from("material-images").getPublicUrl(path);
        uploaded.push({ url: data.publicUrl, image_type: type, alt: name });
      }
      setImages((imgs) => [...imgs, ...uploaded]);
      if (!mainImage && uploaded[0]) setMainImage(uploaded[0].url);
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
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
        name, slug, category_id: categoryId || null, description,
        composition, color, texture, characteristics, care_instructions: care,
        main_image: mainImage || null, is_active: isActive, is_featured: isFeatured,
      };

      let materialId = material?.id;
      if (materialId) {
        const { error: updateErr } = await supabase.from("materials").update(payload).eq("id", materialId);
        if (updateErr) throw updateErr;
        await supabase.from("material_images").delete().eq("material_id", materialId);
      } else {
        const { data: inserted, error: insertErr } = await supabase.from("materials").insert(payload).select().single();
        if (insertErr) throw insertErr;
        materialId = inserted.id;
      }

      if (images.length > 0) {
        await supabase.from("material_images").insert(
          images.map((img, idx) => ({
            material_id: materialId,
            url: img.url,
            image_type: img.image_type,
            alt: img.alt || name,
            sort_order: idx,
          }))
        );
      }

      router.push("/admin/materials");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save material.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 pb-24">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-black/50">Material Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-black/50">Slug</label>
          <input required value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-black/50">Category</label>
        <select value={categoryId ?? ""} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm">
          <option value="">Uncategorized</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-black/50">Description</label>
        <textarea value={description ?? ""} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-black/50">Composition</label>
          <input value={composition ?? ""} onChange={(e) => setComposition(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-black/50">Colour</label>
          <input value={color ?? ""} onChange={(e) => setColor(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-black/50">Texture</label>
        <textarea value={texture ?? ""} onChange={(e) => setTexture(e.target.value)} rows={2} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-black/50">Characteristics</label>
        <textarea value={characteristics ?? ""} onChange={(e) => setCharacteristics(e.target.value)} rows={2} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-black/50">Care Instructions</label>
        <textarea value={care ?? ""} onChange={(e) => setCare(e.target.value)} rows={2} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" />
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured</label>
      </div>

      <div>
        <label className="mb-1 block text-xs text-black/50">Main Image URL</label>
        <input value={mainImage} onChange={(e) => setMainImage(e.target.value)} className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm" placeholder="https://..." />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs text-black/50">Gallery / Texture / Lifestyle Images</label>
          <div className="flex gap-3">
            {(["gallery", "texture", "lifestyle"] as const).map((t) => (
              <button key={t} type="button" onClick={() => { fileInputRef.current!.dataset.type = t; fileInputRef.current?.click(); }} className="flex items-center gap-1 text-xs capitalize text-black/60 underline">
                {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />} {t}
              </button>
            ))}
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleUpload(e.target.files, (fileInputRef.current?.dataset.type as ImageRow["image_type"]) || "gallery")} />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="h-20 w-full rounded-lg object-cover" />
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] capitalize text-white">{img.image_type}</span>
              <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button disabled={saving} className="rounded-full bg-espresso px-8 py-3 text-sm text-white disabled:opacity-50">
        {saving ? "Saving..." : material ? "Save Changes" : "Create Material"}
      </button>
    </form>
  );
}

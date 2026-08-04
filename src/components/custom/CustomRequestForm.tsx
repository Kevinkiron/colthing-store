"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { GarmentType, Material } from "@/lib/types";
import { GARMENT_TYPE_LABELS } from "@/lib/measurementFields";
import MeasurementFields from "@/components/custom/MeasurementFields";
import SavedProfilesPicker from "@/components/custom/SavedProfilesPicker";

function CustomRequestFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialSlug, setMaterialSlug] = useState(params.get("material") ?? "");
  const inspiredProductSlug = params.get("product");

  const [garmentType, setGarmentType] = useState<GarmentType>("shirt");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [preferredFit, setPreferredFit] = useState("Regular");
  const [colorRequirements, setColorRequirements] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [budget, setBudget] = useState("");
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [images, setImages] = useState<{ url: string; type: "reference" | "sketch" | "inspiration" }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("materials").select("*").eq("is_active", true).then(({ data }) => {
      setMaterials((data as Material[]) ?? []);
    });
  }, []);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: typeof images = [];
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error: uploadErr } = await supabase.storage.from("custom-request-images").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from("custom-request-images").getPublicUrl(path);
        uploaded.push({ url: data.publicUrl, type: "reference" });
      }
      setImages((imgs) => [...imgs, ...uploaded]);
    } catch (err) {
      console.error(err);
      setError("Some images failed to upload. You can still submit without them.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const material = materials.find((m) => m.slug === materialSlug);
      let inspiredProductId: string | null = null;
      if (inspiredProductSlug) {
        const { data: p } = await supabase.from("products").select("id").eq("slug", inspiredProductSlug).single();
        inspiredProductId = p?.id ?? null;
      }

      const { data: request, error: insertErr } = await supabase
        .from("custom_requests")
        .insert({
          user_id: sessionData.session?.user.id ?? null,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          material_id: material?.id ?? null,
          inspired_by_product_id: inspiredProductId,
          garment_type: garmentType,
          description,
          measurements,
          preferred_fit: preferredFit,
          color_requirements: colorRequirements,
          additional_requirements: additionalRequirements,
          desired_delivery_date: deliveryDate || null,
          budget: budget ? parseFloat(budget) : null,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      if (images.length > 0) {
        await supabase.from("custom_request_images").insert(
          images.map((img, i) => ({
            request_id: request.id,
            url: img.url,
            image_type: img.type,
            sort_order: i,
          }))
        );
      }

      router.push(`/requests/${request.request_number}?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8 pb-10">
      {inspiredProductSlug && (
        <p className="rounded-lg bg-cream/60 px-4 py-3 text-sm text-espresso/70">
          Inspired by a design you were viewing — we&apos;ll take that into account.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
        <input required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-espresso/50">Material</label>
          <select required value={materialSlug} onChange={(e) => setMaterialSlug(e.target.value)} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm">
            <option value="">Select a material</option>
            {materials.map((m) => (
              <option key={m.id} value={m.slug}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-espresso/50">Garment Type</label>
          <select value={garmentType} onChange={(e) => setGarmentType(e.target.value as GarmentType)} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm">
            {Object.entries(GARMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-espresso/50">Describe what you imagine</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. An oversized long dress with a Mandarin neckline, balloon sleeves, side pockets, and a relaxed silhouette."
          className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-espresso/50">Preferred Fit</label>
          <select value={preferredFit} onChange={(e) => setPreferredFit(e.target.value)} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm">
            {["Slim", "Regular", "Relaxed", "Oversized"].map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <input placeholder="Colour requirements (optional)" value={colorRequirements} onChange={(e) => setColorRequirements(e.target.value)} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
      </div>

      <textarea
        rows={2}
        placeholder="Additional requirements (optional)"
        value={additionalRequirements}
        onChange={(e) => setAdditionalRequirements(e.target.value)}
        className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-espresso/50">Desired delivery date (optional)</label>
          <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-espresso/50">Budget in ₹ (optional)</label>
          <input type="number" placeholder="e.g. 3000" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm" />
        </div>
      </div>

      <div className="border-t border-black/10 pt-6">
        <p className="mb-4 font-display text-lg">Measurements</p>
        <SavedProfilesPicker garmentType={garmentType} onSelect={setMeasurements} />
        <MeasurementFields garmentType={garmentType} values={measurements} onChange={(field, value) => setMeasurements((m) => ({ ...m, [field]: value }))} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs text-espresso/50">Reference / Sketch / Inspiration Images</label>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-xs text-espresso/60 underline">
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />} Upload
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleUpload(e.target.files)} />
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="Reference upload" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button disabled={submitting} className="w-full rounded-full bg-espresso py-3.5 text-sm tracking-wide text-white transition hover:bg-charcoal disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit Custom Request"}
      </button>
    </form>
  );
}

export default function CustomRequestForm() {
  return (
    <Suspense fallback={null}>
      <CustomRequestFormInner />
    </Suspense>
  );
}

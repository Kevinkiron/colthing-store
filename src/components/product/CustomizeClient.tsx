"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product, SelectedCustomization } from "@/lib/types";
import { cn } from "@/lib/utils";
import MeasurementFields from "@/components/custom/MeasurementFields";
import SavedProfilesPicker from "@/components/custom/SavedProfilesPicker";

export default function CustomizeClient({ product }: { product: Product }) {
  const router = useRouter();
  const supabase = createClient();
  const images = product.product_images ?? [];
  const options = (product.customization_options ?? [])
    .filter((o) => o.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null);

  function selectValue(optionId: string, valueId: string) {
    setSelections((s) => ({ ...s, [optionId]: valueId }));
  }

  const chosen: SelectedCustomization[] = useMemo(() => {
    const list: SelectedCustomization[] = [];
    for (const opt of options) {
      const valueId = selections[opt.id];
      const value = opt.customization_values?.find((v) => v.id === valueId);
      if (value) list.push({ optionName: opt.name, valueLabel: value.label, price: value.additional_price });
    }
    return list;
  }, [options, selections]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const choiceSummary = chosen.map((c) => `${c.optionName}: ${c.valueLabel}`).join(", ");
      const additionalRequirements = [choiceSummary, description].filter(Boolean).join(" — ");

      const { data: request, error: insertErr } = await supabase
        .from("custom_requests")
        .insert({
          user_id: sessionData.session?.user.id ?? null,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          material_id: product.material_id,
          inspired_by_product_id: product.id,
          garment_type: product.garment_type,
          description: description || `Customized version of ${product.name}`,
          measurements,
          additional_requirements: additionalRequirements || null,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      setSubmittedNumber(request.request_number);
    } catch (err) {
      console.error(err);
      setError("Something went wrong submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-10 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Customize This Design</span>
        <h1 className="font-display mt-4 text-4xl">{product.name}</h1>
        {product.materials && <p className="mt-2 text-sm text-espresso/50">Made with {product.materials.name}</p>}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-12 md:grid-cols-2">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
            {images[0] && <Image src={images[0].url} alt={product.name} fill className="object-cover" />}
          </div>
        </div>

        <div>
          {product.materials?.color && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wide text-espresso/50">
                Base Colour — <span className="normal-case text-espresso/80">{product.materials.color}</span>
              </p>
            </div>
          )}

          {options.length === 0 ? (
            <p className="text-sm text-espresso/50">
              This design has no customization options configured yet.
            </p>
          ) : (
            <div className="space-y-8">
              {options.map((opt) => (
                <div key={opt.id}>
                  <p className="mb-3 text-xs uppercase tracking-wide text-espresso/50">{opt.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {(opt.customization_values ?? [])
                      .filter((v) => v.is_active)
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => selectValue(opt.id, v.id)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-xs transition",
                            selections[opt.id] === v.id ? "border-gold bg-gold text-white" : "border-black/15 hover:border-black/40"
                          )}
                        >
                          {v.label}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-black/10 pt-8">
            <p className="mb-4 font-display text-lg">Tell Us More</p>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Anything else you'd like us to know about how you want this design customized?"
              className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm"
            />
          </div>

          <div className="mt-8 border-t border-black/10 pt-8">
            <p className="mb-3 font-display text-lg">Your Measurements</p>
            <p className="mb-4 rounded-lg bg-gold/10 px-4 py-3 text-xs text-espresso/70">
              Don&apos;t know your measurements yet? No problem —{" "}
              <Link href="/contact" className="font-medium underline underline-offset-2">reach out to us</Link>{" "}
              and we&apos;ll help you get them, or leave this section blank and we&apos;ll contact you.
            </p>
            <SavedProfilesPicker garmentType={product.garment_type} onSelect={setMeasurements} />
            <MeasurementFields
              garmentType={product.garment_type}
              values={measurements}
              onChange={(field, value) => setMeasurements((m) => ({ ...m, [field]: value }))}
            />
          </div>

          <div className="mt-8 grid gap-4 border-t border-black/10 pt-8 sm:grid-cols-3">
            <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
            <input required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-espresso py-3.5 text-sm tracking-wide text-white transition hover:bg-charcoal disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Send Customization Request"}
          </button>
          <p className="mt-3 text-center text-xs text-espresso/40">
            No payment here — we&apos;ll review your request and get in touch to confirm pricing and details.
          </p>
        </div>
      </form>

      {submittedNumber && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center">
            <p className="font-display text-2xl">Request Received!</p>
            <p className="mt-2 text-sm text-espresso/60">
              We&apos;ve received your customization request ({submittedNumber}). We&apos;ll get in touch with you soon.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={`/requests/${submittedNumber}?email=${encodeURIComponent(email)}`}
                className="rounded-full bg-espresso py-3 text-center text-sm text-white"
              >
                Track Your Request
              </Link>
              <button
                onClick={() => router.push("/shop")}
                className="rounded-full border border-black/15 py-3 text-sm"
              >
                Keep Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

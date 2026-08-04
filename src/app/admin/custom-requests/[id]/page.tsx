"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { CustomRequestStatus } from "@/lib/types";

const STATUS_OPTIONS: CustomRequestStatus[] = [
  "submitted", "under_review", "need_more_info", "quotation_ready", "approved",
  "payment_received", "in_production", "quality_check", "shipped", "delivered", "cancelled",
];

type Detail = {
  id: string;
  request_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  garment_type: string;
  description: string;
  measurements: Record<string, string>;
  preferred_fit: string | null;
  color_requirements: string | null;
  additional_requirements: string | null;
  desired_delivery_date: string | null;
  budget: number | null;
  status: CustomRequestStatus;
  materials: { name: string } | null;
  products: { name: string } | null;
  custom_request_images: { id: string; url: string; image_type: string }[];
  quotations: { id: string; status: string; total: number; notes: string | null; quotation_items: { id: string; label: string; amount: number }[] }[];
};

export default function AdminCustomRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [request, setRequest] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<CustomRequestStatus>("submitted");
  const [savingStatus, setSavingStatus] = useState(false);

  const [items, setItems] = useState<{ label: string; amount: string }[]>([{ label: "Tailoring", amount: "" }]);
  const [notes, setNotes] = useState("");
  const [savingQuote, setSavingQuote] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("custom_requests")
      .select("*, materials(name), products(name), custom_request_images(*), quotations(*, quotation_items(*))")
      .eq("id", id)
      .single();
    const d = data as unknown as Detail;
    setRequest(d);
    if (d) {
      setStatus(d.status);
      const existing = d.quotations?.[0];
      if (existing) {
        setItems(existing.quotation_items.map((i) => ({ label: i.label, amount: i.amount.toString() })));
        setNotes(existing.notes ?? "");
      }
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function updateStatus() {
    setSavingStatus(true);
    await supabase.from("custom_requests").update({ status }).eq("id", id);
    setSavingStatus(false);
    load();
  }

  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

  async function saveQuotation() {
    setSavingQuote(true);
    const existing = request?.quotations?.[0];
    let quotationId = existing?.id;

    if (quotationId) {
      await supabase.from("quotations").update({ total, notes }).eq("id", quotationId);
      await supabase.from("quotation_items").delete().eq("quotation_id", quotationId);
    } else {
      const { data: inserted } = await supabase
        .from("quotations")
        .insert({ custom_request_id: id, total, notes, status: "pending" })
        .select()
        .single();
      quotationId = inserted?.id;
    }

    if (quotationId) {
      await supabase.from("quotation_items").insert(
        items.filter((i) => i.label).map((i, idx) => ({ quotation_id: quotationId, label: i.label, amount: parseFloat(i.amount) || 0, sort_order: idx }))
      );
    }

    await supabase.from("custom_requests").update({ status: "quotation_ready" }).eq("id", id);
    setSavingQuote(false);
    load();
  }

  if (loading) return <p className="text-sm text-black/50">Loading...</p>;
  if (!request) return <p className="text-sm text-black/50">Request not found.</p>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">{request.request_number}</h1>
        <div className="flex items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as CustomRequestStatus)} className="rounded-full border border-black/15 px-3 py-2 text-xs capitalize">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
          <button disabled={savingStatus} onClick={updateStatus} className="rounded-full bg-espresso px-4 py-2 text-xs text-white disabled:opacity-50">
            {savingStatus ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <p className="font-display mb-3 text-lg">Customer</p>
          <p className="text-sm">{request.customer_name}</p>
          <p className="text-sm text-black/50">{request.customer_email}</p>
          <p className="text-sm text-black/50">{request.customer_phone}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <p className="font-display mb-3 text-lg">Request Details</p>
          <p className="text-sm"><span className="text-black/40">Material:</span> {request.materials?.name ?? "—"}</p>
          <p className="text-sm"><span className="text-black/40">Inspired by:</span> {request.products?.name ?? "—"}</p>
          <p className="text-sm capitalize"><span className="text-black/40">Garment:</span> {request.garment_type}</p>
          <p className="text-sm"><span className="text-black/40">Fit:</span> {request.preferred_fit ?? "—"}</p>
          <p className="text-sm"><span className="text-black/40">Colour:</span> {request.color_requirements ?? "—"}</p>
          <p className="text-sm"><span className="text-black/40">Delivery by:</span> {request.desired_delivery_date ?? "—"}</p>
          <p className="text-sm"><span className="text-black/40">Budget:</span> {request.budget ? formatPrice(request.budget) : "—"}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-black/10 bg-white p-6">
        <p className="font-display mb-3 text-lg">Description</p>
        <p className="text-sm text-black/70">{request.description}</p>
        {request.additional_requirements && <p className="mt-2 text-sm text-black/50">{request.additional_requirements}</p>}
      </div>

      {Object.keys(request.measurements ?? {}).length > 0 && (
        <div className="mt-6 rounded-xl border border-black/10 bg-white p-6">
          <p className="font-display mb-3 text-lg">Measurements</p>
          <div className="grid grid-cols-3 gap-3 text-sm sm:grid-cols-4">
            {Object.entries(request.measurements).map(([k, v]) => (
              <div key={k}><span className="text-black/40">{k}:</span> {v}&quot;</div>
            ))}
          </div>
        </div>
      )}

      {request.custom_request_images.length > 0 && (
        <div className="mt-6 rounded-xl border border-black/10 bg-white p-6">
          <p className="font-display mb-3 text-lg">Reference Images</p>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {request.custom_request_images.map((img) => (
              <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-cream">
                <Image src={img.url} alt="Reference" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-black/10 bg-white p-6">
        <p className="font-display mb-3 text-lg">Quotation</p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input placeholder="Label, e.g. Tailoring" value={item.label} onChange={(e) => setItems((it) => it.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm" />
              <input type="number" step="0.01" placeholder="Amount" value={item.amount} onChange={(e) => setItems((it) => it.map((x, idx) => idx === i ? { ...x, amount: e.target.value } : x))} className="w-32 rounded-lg border border-black/15 px-3 py-2 text-sm" />
              <button onClick={() => setItems((it) => it.filter((_, idx) => idx !== i))} aria-label="Remove"><Trash2 className="h-4 w-4 text-black/40" /></button>
            </div>
          ))}
          <button onClick={() => setItems((it) => [...it, { label: "", amount: "" }])} className="flex items-center gap-1 text-xs text-black/50 underline"><Plus className="h-3 w-3" /> Add Line Item</button>
        </div>
        <textarea placeholder="Notes to customer (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-4 w-full rounded-lg border border-black/15 px-3 py-2 text-sm" />
        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
          <p className="font-medium">Total: {formatPrice(total)}</p>
          <button disabled={savingQuote} onClick={saveQuotation} className="rounded-full bg-espresso px-6 py-2.5 text-sm text-white disabled:opacity-50">
            {savingQuote ? "Saving..." : "Save & Send Quotation"}
          </button>
        </div>
      </div>
    </div>
  );
}

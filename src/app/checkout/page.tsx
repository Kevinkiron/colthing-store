"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { publicSupabase } from "@/lib/supabase/public";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-6 pb-24 pt-32 text-center">
        <p className="text-black/60">Your bag is empty.</p>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: order, error: orderErr } = await publicSupabase
        .from("orders")
        .insert({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: {
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          subtotal,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      const items = lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        variant_id: l.variantId,
        product_name: l.name,
        size: l.size,
        color: l.color,
        quantity: l.quantity,
        unit_price: l.price,
      }));
      const { error: itemsErr } = await publicSupabase.from("order_items").insert(items);
      if (itemsErr) throw itemsErr;

      clear();
      router.push(`/checkout/success?order=${order.order_number}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:px-10">
      <h1 className="font-display mb-10 text-4xl">Checkout</h1>
      <div className="grid gap-12 md:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Full name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
            <input required type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
          </div>
          <input required placeholder="Phone number" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm" />
          <input required placeholder="Address" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm" />
          <div className="grid gap-4 sm:grid-cols-3">
            <input required placeholder="City" value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
            <input required placeholder="State" value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
            <input required placeholder="Pincode" value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
          </div>

          <p className="!mt-6 text-xs text-black/45">
            This is a demo checkout — no payment is collected here. Your order
            will be saved and the store owner will contact you to confirm
            payment and delivery.
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={submitting}
            className="w-full rounded-full bg-[--color-charcoal] py-3.5 text-sm text-white hover:bg-[--color-espresso] disabled:opacity-50"
          >
            {submitting ? "Placing order..." : `Place Order — ${formatPrice(subtotal)}`}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-black/10 p-6">
          <p className="mb-4 font-display">Order Summary</p>
          <ul className="space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.variantId} className="flex justify-between text-black/70">
                <span>{l.name} ({l.color}/{l.size}) x{l.quantity}</span>
                <span>{formatPrice(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4 font-medium">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

// ─── Razorpay global type ────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => {
      open(): void;
      on(event: string, callback: () => void): void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [checkedAuth, setCheckedAuth] = useState(false);

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/account/login?redirect=/checkout");
        return;
      }
      setForm((f) => ({ ...f, email: f.email || data.session!.user.email || "" }));
      setCheckedAuth(true);
    });
  }, []);

  if (!checkedAuth) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-espresso/40">Loading...</div>;
  }

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
      const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!publicKey) {
        throw new Error(
          "Payments are not configured yet. Please contact us to complete your order."
        );
      }

      // ── Step 1: Load Razorpay script ────────────────────────────────────
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway. Please check your connection and try again.");
      }

      // ── Step 2: Create Razorpay order on the server ─────────────────────
      // Only ids and quantities go up — the server works out what it costs.
      const cartPayload = lines.map((l) => ({
        product_id: l.productId,
        variant_id: l.variantId,
        size: l.size,
        quantity: l.quantity,
        item_type: l.itemType,
      }));

      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartPayload }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Could not initiate payment.");
      }

      const razorpayOrder = await createRes.json() as {
        id: string;
        amount: number;
        currency: string;
      };

      // ── Step 3: Open Razorpay checkout popup ─────────────────────────────
      await new Promise<void>((resolve, reject) => {
        const options = {
          key: publicKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Knit & Knot",
          description: `Order for ${lines.length} item${lines.length > 1 ? "s" : ""}`,
          order_id: razorpayOrder.id,
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#3d2b1f" }, // espresso brand colour
          modal: {
            ondismiss: () => reject(new Error("Payment was cancelled.")),
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // ── Step 4: Verify payment & place order ───────────────────
              const verifyRes = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  form,
                  items: cartPayload,
                }),
              });

              if (!verifyRes.ok) {
                const err = await verifyRes.json();
                reject(new Error(err.error || "Payment verification failed."));
                return;
              }

              const { order_number } = await verifyRes.json() as { order_number: string };
              clear();
              router.push(`/checkout/success?order=${order_number}`);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          reject(new Error("Payment failed. Please try again or use a different payment method."));
        });
        rzp.open();
      });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "";
      setError(message || "Something went wrong. Please try again.");
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={submitting}
            className="w-full rounded-full bg-espresso py-3.5 text-sm text-white hover:bg-charcoal disabled:opacity-50"
          >
            {submitting ? "Opening payment..." : `Pay Now — ${formatPrice(subtotal)}`}
          </button>

          <p className="text-xs text-espresso/45 text-center">
            Secured by Razorpay · UPI, Cards, Net Banking &amp; more
          </p>
        </form>

        <div className="h-fit rounded-2xl border border-black/10 p-6">
          <p className="mb-4 font-display">Order Summary</p>
          <ul className="space-y-4 text-sm">
            {lines.map((l) => (
              <li key={l.cartLineId} className="text-espresso/70">
                <div className="flex justify-between">
                  <span>{l.name} x{l.quantity}</span>
                  <span>{formatPrice(l.price * l.quantity)}</span>
                </div>
                <span className="text-xs text-espresso/40">
                  {l.itemType === "customized" ? "Customized Design" : "Original Design"} — {l.size}
                </span>
                {l.customization && l.customization.length > 0 && (
                  <ul className="mt-1 pl-3 text-xs text-espresso/40">
                    {l.customization.map((c, i) => (
                      <li key={i}>{c.optionName}: {c.valueLabel}{c.price > 0 ? ` (+${formatPrice(c.price)})` : ""}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4 font-medium">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

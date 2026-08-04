"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:px-10">
      <h1 className="font-display mb-10 text-4xl">Your Bag</h1>

      {lines.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-black/60">Your bag is empty.</p>
          <Link href="/shop" className="mt-6 inline-block rounded-full bg-espresso px-8 py-3 text-sm text-white">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 md:grid-cols-[1fr_320px]">
          <ul className="space-y-6">
            {lines.map((l) => (
              <li key={l.cartLineId} className="flex gap-4 border-b border-black/10 pb-6">
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-cream">
                  {l.image && <Image src={l.image} alt={l.name} fill className="object-cover" />}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <p className="font-display">{l.name}</p>
                    <button onClick={() => removeLine(l.cartLineId)} aria-label="Remove">
                      <Trash2 className="h-4 w-4 text-black/40" />
                    </button>
                  </div>
                  <span className="mt-0.5 w-fit rounded-full bg-black/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-black/50">
                    {l.itemType === "customized" ? "Customized Design" : "Original Design"}
                  </span>
                  <p className="mt-1 text-sm text-black/50">{l.color} / {l.size}</p>
                  {l.customization && l.customization.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-xs text-black/45">
                      {l.customization.map((c, i) => (
                        <li key={i}>{c.optionName}: {c.valueLabel}{c.price > 0 ? ` (+${formatPrice(c.price)})` : ""}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-black/15 px-3 py-1.5">
                      <button onClick={() => updateQuantity(l.cartLineId, l.quantity - 1)} aria-label="Decrease">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm">{l.quantity}</span>
                      <button onClick={() => updateQuantity(l.cartLineId, l.quantity + 1)} aria-label="Increase">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-medium">{formatPrice(l.price * l.quantity)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit rounded-2xl border border-black/10 p-6">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-black/40">Shipping calculated at checkout.</p>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-full bg-espresso py-3.5 text-center text-sm text-white hover:bg-charcoal"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

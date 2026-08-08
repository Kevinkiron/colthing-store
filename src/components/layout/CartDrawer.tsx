"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-black/40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <h3 className="font-display text-xl">Your Bag ({lines.length})</h3>
              <button onClick={close} aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <p className="mt-10 text-center text-sm text-black/60">
                  Your bag is empty. Discover a material, choose a design.
                </p>
              ) : (
                <ul className="space-y-6">
                  {lines.map((l) => (
                    <li key={l.cartLineId} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-cream">
                        {l.image && <Image src={l.image} alt={l.name} fill className="object-cover" />}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <p className="font-display text-sm">{l.name}</p>
                          <button onClick={() => removeLine(l.cartLineId)} aria-label="Remove">
                            <Trash2 className="h-4 w-4 text-black/40" />
                          </button>
                        </div>
                        <span className="mt-0.5 w-fit rounded-full bg-black/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-black/50">
                          {l.itemType === "customized" ? "Customized Design" : "Original Design"}
                        </span>
                        <p className="mt-1 text-xs text-black/50">
                          {l.size}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-black/15 px-2 py-1">
                            <button onClick={() => updateQuantity(l.cartLineId, l.quantity - 1)} aria-label="Decrease">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center text-xs">{l.quantity}</span>
                            <button onClick={() => updateQuantity(l.cartLineId, l.quantity + 1)} aria-label="Increase">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm font-medium">{formatPrice(l.price * l.quantity)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-black/10 px-6 py-5">
                <div className="mb-4 flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full rounded-full bg-espresso py-3 text-center text-sm tracking-wide text-white transition hover:bg-charcoal"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

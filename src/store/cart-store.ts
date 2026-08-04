"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addLine: (line: Omit<CartLine, "cartLineId">) => void;
  removeLine: (cartLineId: string) => void;
  updateQuantity: (cartLineId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

function makeLineId(line: Omit<CartLine, "cartLineId">) {
  if (line.itemType === "customized") {
    return `${line.variantId}-custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  return `${line.variantId}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addLine: (line) =>
        set((state) => {
          if (line.itemType === "standard") {
            const existing = state.lines.find(
              (l) => l.itemType === "standard" && l.variantId === line.variantId
            );
            if (existing) {
              return {
                lines: state.lines.map((l) =>
                  l.cartLineId === existing.cartLineId
                    ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.maxStock) }
                    : l
                ),
                isOpen: true,
              };
            }
          }
          return {
            lines: [...state.lines, { ...line, cartLineId: makeLineId(line) }],
            isOpen: true,
          };
        }),
      removeLine: (cartLineId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.cartLineId !== cartLineId) })),
      updateQuantity: (cartLineId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.cartLineId === cartLineId
              ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxStock)) }
              : l
          ),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "knit-and-knot-cart" }
  )
);

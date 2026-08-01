"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  productIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (id) =>
        set((state) => ({
          productIds: state.productIds.includes(id)
            ? state.productIds.filter((p) => p !== id)
            : [...state.productIds, id],
        })),
      has: (id) => get().productIds.includes(id),
    }),
    { name: "luna-atelier-wishlist" }
  )
);

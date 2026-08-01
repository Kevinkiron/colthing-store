"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/lib/types";

export default function CollectionShowcase({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-[--color-ivory] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-[--color-gold]">
            New Arrivals
          </span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">The Latest Collection</h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/shop"
            className="rounded-full border border-[--color-charcoal]/20 px-8 py-3 text-sm tracking-wide transition hover:border-[--color-gold] hover:text-[--color-gold]"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

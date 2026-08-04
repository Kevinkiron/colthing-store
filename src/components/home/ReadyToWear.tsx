"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ReadyToWear({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Ready to Wear</span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">Designs, Finished and Ready</h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.slice(0, 8).map((p, i) => {
            const img = p.product_images?.[0]?.url;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream">
                  {img && <Image src={img} alt={p.name} fill className="object-cover" />}
                </div>
                <p className="font-display mt-3 text-sm">{p.name}</p>
                <p className="text-xs text-espresso/50">{formatPrice(p.base_price)}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/product/${p.slug}`}
                    className="flex-1 rounded-full border border-espresso/20 py-2 text-center text-[11px] uppercase tracking-wide transition hover:border-gold hover:text-gold"
                  >
                    View Design
                  </Link>
                  <Link
                    href={`/product/${p.slug}`}
                    className="flex-1 rounded-full bg-espresso py-2 text-center text-[11px] uppercase tracking-wide text-white transition hover:bg-charcoal"
                  >
                    Buy As Shown
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

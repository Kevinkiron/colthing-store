"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import Spin360 from "./Spin360";

export default function FeaturedProduct3D({ product, frames }: { product: Product | null; frames: string[] }) {
  const sizes = Array.from(new Set((product?.product_variants ?? []).map((v) => v.size)));
  const [size, setSize] = useState(sizes[0] ?? "M");

  if (frames.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-espresso py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:px-10">
        <Spin360 frames={frames} alt={product?.name ?? "Rotating view of a Knit & Knot garment"} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold-light">See It Take Shape</span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">{product?.name ?? "Made-to-Measure, Your Way"}</h2>
          <p className="mt-5 max-w-md text-white/60">
            {product?.description ??
              "A real look at one of our designs, shot in the round. Drag to rotate and see the fit, the fall, and the finish before you choose your own."}
          </p>

          {product?.materials?.color && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wide text-white/50">
                Colour — <span className="normal-case text-white/80">{product.materials.color}</span>
              </p>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-wide text-white/50">Size — {size}</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-10 w-10 rounded-full border text-sm transition",
                      size === s ? "border-gold bg-gold text-white" : "border-white/25 hover:border-white/60"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product && <p className="mt-6 text-lg">{formatPrice(product.base_price)}</p>}

          <Link
            href={product ? `/product/${product.slug}` : "/shop"}
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm tracking-wide text-charcoal transition hover:bg-gold-light"
          >
            {product ? "View This Design" : "Browse Designs"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

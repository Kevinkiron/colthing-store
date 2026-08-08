"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";

export default function ProductShowcase({ product }: { product: Product | null }) {
  const images = (product?.product_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const sizes = Array.from(new Set((product?.product_variants ?? []).map((v) => v.size)));

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(sizes[0] ?? "");

  if (!product || images.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-espresso py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:px-10">
        <div>
          <motion.div
            key={images[activeImage].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-charcoal"
          >
            <Image
              src={images[activeImage].url}
              alt={images[activeImage].alt ?? product.name}
              fill
              className="object-cover"
            />
          </motion.div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={cn(
                    "relative h-20 w-16 overflow-hidden rounded-lg border-2 transition",
                    activeImage === i ? "border-gold" : "border-white/20 hover:border-white/50"
                  )}
                >
                  <Image src={img.url} alt={img.alt ?? product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold-light">See It Up Close</span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">{product.name}</h2>
          <p className="mt-5 max-w-md text-white/60">
            {product.description ??
              "Real fabric, real stitching, made to your measurements. Take a closer look at one of our designs before you choose your own."}
          </p>

          {product.materials?.color && (
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

          <p className="mt-6 text-lg">{formatPrice(product.base_price)}</p>

          <Link
            href={`/product/${product.slug}`}
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm tracking-wide text-charcoal transition hover:bg-gold-light"
          >
            View This Design
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

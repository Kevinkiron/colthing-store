"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Material, Product } from "@/lib/types";

export default function OneMaterialManyPossibilities({
  material,
  products,
}: {
  material: Material;
  products: Product[];
}) {
  if (!material || products.length === 0) return null;

  return (
    <section className="bg-cream/50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold">One Material. Many Possibilities.</span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">{material.name}</h2>
        </motion.div>

        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className="relative h-[420px] overflow-hidden rounded-2xl shadow-xl"
          >
            {material.main_image && (
              <Image src={material.main_image} alt={material.name} fill className="object-cover" />
            )}
          </motion.div>

          <div>
            <p className="max-w-md text-espresso/70">
              One considered material, shaped into an entire wardrobe of
              possibilities. Here is what our atelier has designed with{" "}
              {material.name} so far.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((p, i) => {
                const img = p.product_images?.[0]?.url;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link href={`/product/${p.slug}`} className="group block">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-ivory">
                        {img && (
                          <Image src={img} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        )}
                      </div>
                      <p className="mt-2 text-sm">{p.name}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <Link
              href={`/materials/${material.slug}`}
              className="mt-8 inline-block rounded-full bg-espresso px-8 py-3 text-sm tracking-wide text-white transition hover:bg-charcoal"
            >
              See All Designs in {material.name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import MaterialCard from "@/components/materials/MaterialCard";
import type { Material } from "@/lib/types";

export default function FeaturedMaterials({ materials }: { materials: Material[] }) {
  if (materials.length === 0) return null;

  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Materials that inspire</span>
          <h2 className="font-display mt-4 max-w-xl text-4xl md:text-5xl">
            Thoughtfully Selected Materials for Flawless Designs.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
          {materials.map((m, i) => (
            <MaterialCard key={m.id} material={m} index={i} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/materials"
            className="rounded-full border border-espresso/20 px-8 py-3 text-sm tracking-wide transition hover:border-gold hover:text-gold"
          >
            Explore All Materials
          </Link>
        </div>
      </div>
    </section>
  );
}

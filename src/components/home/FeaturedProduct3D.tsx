"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ProductScene = dynamic(() => import("./ProductScene"), { ssr: false });

const colors = [
  { name: "Ivory", hex: "#efe6d8" },
  { name: "Charcoal", hex: "#2b2b2b" },
  { name: "Rosewood", hex: "#7a3b3b" },
  { name: "Sage", hex: "#8a9a7e" },
];
const sizes = ["XS", "S", "M", "L", "XL"];

export default function FeaturedProduct3D() {
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState("M");

  return (
    <section className="relative overflow-hidden bg-[--color-charcoal] py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:px-10">
        <div className="relative h-[420px] cursor-grab active:cursor-grabbing md:h-[560px]">
          <ProductScene color={color.hex} />
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/40">
            Drag to rotate
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-[--color-gold-light]">
            Signature Piece
          </span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">The Atelier Midi Dress</h2>
          <p className="mt-5 max-w-md text-white/60">
            Fluid drape, a flattering fit-and-flare silhouette, and a fabric
            blend that breathes through the day. Explore it in four
            considered colourways.
          </p>

          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-wide text-white/50">Colour — {color.name}</p>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  aria-label={c.name}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition",
                    color.name === c.name ? "border-[--color-gold]" : "border-white/20"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-wide text-white/50">Size — {size}</p>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "h-10 w-10 rounded-full border text-sm transition",
                    size === s
                      ? "border-[--color-gold] bg-[--color-gold] text-[--color-charcoal]"
                      : "border-white/25 hover:border-white/60"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-2xl">₹2,499</p>
        </motion.div>
      </div>
    </section>
  );
}

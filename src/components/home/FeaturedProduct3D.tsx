"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ProductScene = dynamic(() => import("./ProductScene"), { ssr: false });

const colors = [
  { name: "Beige", hex: "#e8ddce" },
  { name: "Midnight", hex: "#2b2b2b" },
  { name: "Dusty Rose", hex: "#c99a95" },
  { name: "Sage", hex: "#8f9b7d" },
];
const sizes = ["XS", "S", "M", "L", "XL"];

export default function FeaturedProduct3D() {
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState("M");

  return (
    <section className="relative overflow-hidden bg-espresso py-24 text-white md:py-32">
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
          <span className="text-xs uppercase tracking-[0.35em] text-gold-light">See It Take Shape</span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">The Relaxed Linen Shirt</h2>
          <p className="mt-5 max-w-md text-white/60">
            Explore how one design changes across colourways and fits before
            you commit. This is the same customization experience you get on
            every product page — rotate, compare, and decide.
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
                    color.name === c.name ? "border-gold" : "border-white/20"
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
                    size === s ? "border-gold bg-gold text-white" : "border-white/25 hover:border-white/60"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/product/relaxed-linen-shirt"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm tracking-wide text-charcoal transition hover:bg-gold-light"
          >
            View This Design
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

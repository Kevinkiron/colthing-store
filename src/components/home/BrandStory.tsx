"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-ivory py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-2 h-[420px] overflow-hidden rounded-2xl shadow-xl md:order-1 md:h-[560px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1200&q=80"
            alt="Close detail of woven fabric texture"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="order-1 md:order-2"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Our Craft</span>
          <h2 className="font-display mt-4 text-4xl leading-tight md:text-5xl">
            We begin with the material —
            <br /> everything else follows.
          </h2>
          <p className="mt-6 max-w-md text-espresso/70">
            Knit &amp; Knot is built around a simple idea: choose a material
            you love, and let it become anything. Every piece starts life as
            a fabric we&apos;ve sourced and lived with, before our atelier
            shapes it into a design — one you can wear as shown, personalise,
            or reimagine entirely as your own.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-black/10 pt-8">
            <div>
              <p className="font-display text-3xl text-gold">20+</p>
              <p className="mt-1 text-xs text-espresso/60">Curated materials</p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">100%</p>
              <p className="mt-1 text-xs text-espresso/60">Made to order</p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">4.9★</p>
              <p className="mt-1 text-xs text-espresso/60">Average rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

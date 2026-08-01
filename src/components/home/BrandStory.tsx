"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-[--color-ivory] py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-2 h-[420px] overflow-hidden rounded-2xl shadow-xl md:order-1 md:h-[560px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80"
            alt="Fabric detail and craftsmanship"
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
          <span className="text-xs uppercase tracking-[0.35em] text-[--color-gold]">
            Our Story
          </span>
          <h2 className="font-display mt-4 text-4xl leading-tight md:text-5xl">
            Couture-level detail,
            <br /> without the couture markup.
          </h2>
          <p className="mt-6 max-w-md text-[--color-charcoal]/70">
            Luna Atelier was founded on a simple belief: every woman deserves
            clothing that feels considered — fine stitching, fabrics that move
            with you, silhouettes that flatter — without paying luxury-house
            prices for it. We work directly with mills and ateliers to keep
            quality high and prices honest.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-black/10 pt-8">
            <div>
              <p className="font-display text-3xl text-[--color-gold]">120+</p>
              <p className="mt-1 text-xs text-[--color-charcoal]/60">Daily-wear styles</p>
            </div>
            <div>
              <p className="font-display text-3xl text-[--color-gold]">40k+</p>
              <p className="mt-1 text-xs text-[--color-charcoal]/60">Happy customers</p>
            </div>
            <div>
              <p className="font-display text-3xl text-[--color-gold]">4.8★</p>
              <p className="mt-1 text-xs text-[--color-charcoal]/60">Average rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

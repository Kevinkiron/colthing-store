"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MakeItYours() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold-light">Make It Yours</span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">
            Love a design? Adjust it until it&apos;s truly yours.
          </h2>
          <p className="mt-5 max-w-md text-white/65">
            Change the fit, the sleeve, the collar, the length. Add
            embroidery, or leave it minimal. Every ready-to-wear design can
            be personalised to your measurements before it&apos;s made.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm tracking-wide text-charcoal transition hover:bg-gold-light"
          >
            Customize a Design
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="relative h-[360px] overflow-hidden rounded-2xl md:h-[440px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1100&q=80"
            alt="Detail of tailoring and stitching"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}

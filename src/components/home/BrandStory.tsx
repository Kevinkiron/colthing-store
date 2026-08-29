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
            src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlkWraAb0exW3ChF6cJXsJDqN6j3J64x1lmxR3s6R9cO64ZPrvcUX0GIWROAkcO02mAACtoc05_Z1wEsx0tOzMDoOclzYcc2BYkVMoK5_OLc4Bb5Y32irhCWFvzi4TKzgLvLgWuxwDYdAJg=w1600-h1200-k-no"
            alt="Inside the Knit & Knot tailoring studio in Trivandrum"
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
          <span className="text-xs uppercase tracking-[0.35em] text-gold">About Knit &amp; Knot</span>
          <h2 className="font-display mt-4 text-4xl leading-tight md:text-5xl">
            Your Destination for Custom Tailoring in Trivandrum
          </h2>
          <p className="mt-6 max-w-md text-espresso/70">
            Knit &amp; Knot is a custom tailoring centre in Trivandrum,
            creating personalised outfits for working professionals and
            college students. Choose from our premium materials and
            pre-designed styles, or share your own ideas to customise an
            outfit that perfectly matches your needs.
          </p>
          <p className="mt-4 max-w-md text-espresso/70">
            With affordable pricing, expert craftsmanship, and attention to
            detail, we deliver stylish, well-fitted clothing along with
            convenient doorstep delivery.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-black/10 pt-8 sm:grid-cols-4">
            <div>
              <p className="font-display text-3xl text-gold">10+</p>
              <p className="mt-1 text-xs text-espresso/60">Years Expertise</p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">100%</p>
              <p className="mt-1 text-xs text-espresso/60">Made-to-Measure Fit</p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">20+</p>
              <p className="mt-1 text-xs text-espresso/60">Fabric Choices</p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">150+</p>
              <p className="mt-1 text-xs text-espresso/60">Happy Customers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

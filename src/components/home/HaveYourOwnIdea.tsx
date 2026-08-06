"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HaveYourOwnIdea() {
  return (
    <section className="bg-cream/60 py-24 text-center md:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Have your own idea</span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">
            Have a Style You&apos;ve Been Waiting to Wear?
          </h2>
          <p className="mt-5 text-espresso/70">
            Have a design in mind? Simply share your reference images,
            measurements, and preferred details with us. Then, we carefully
            customise the style, fit, and finishing touches to match your
            requirements.
          </p>
          <Link
            href="/custom-request"
            className="mt-8 inline-block rounded-full bg-espresso px-8 py-3 text-sm tracking-wide text-white transition hover:bg-charcoal"
          >
            Create Something Custom
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

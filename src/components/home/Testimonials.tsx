"use client";
import { motion } from "framer-motion";
import { Truck, PackageCheck, Sparkles, Leaf } from "lucide-react";

const testimonials = [
  {
    name: "Ananya R.",
    quote:
      "The fabric feels genuinely premium — I get compliments every time I wear the co-ord set, and it cost less than a dinner out.",
  },
  {
    name: "Priya S.",
    quote:
      "Finally a brand that fits real bodies. The sizing chart was spot on and the midi dress fits like it was tailored.",
  },
  {
    name: "Meera K.",
    quote:
      "Fast shipping, beautiful packaging, and the quality rivals brands twice the price. I've reordered three times now.",
  },
];

const values = [
  { icon: Sparkles, label: "Premium Fabrics", desc: "Curated mill-direct materials" },
  { icon: Truck, label: "Pan-India Shipping", desc: "3–6 day delivery, tracked" },
  { icon: PackageCheck, label: "Easy 7-Day Returns", desc: "No questions asked" },
  { icon: Leaf, label: "Responsible Production", desc: "Low-waste cutting, small batches" },
];

const stats = [
  { number: "40,000+", label: "Customers styled" },
  { number: "120+", label: "Everyday styles" },
  { number: "4.8 / 5", label: "Average rating" },
  { number: "6", label: "Cities with studios" },
];

export default function Testimonials() {
  return (
    <section className="bg-[--color-ivory] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-[--color-gold]">
            Loved by Thousands
          </span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">What Our Customers Say</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <p className="text-[--color-gold]">★★★★★</p>
              <p className="mt-4 text-sm text-[--color-charcoal]/75">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-5 font-display text-sm">{t.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid gap-8 border-y border-black/10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <v.icon className="h-7 w-7 text-[--color-gold]" />
              <p className="font-display mt-4 text-base">{v.label}</p>
              <p className="mt-1 text-xs text-[--color-charcoal]/55">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-3xl text-[--color-gold] md:text-4xl">{s.number}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-[--color-charcoal]/55">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

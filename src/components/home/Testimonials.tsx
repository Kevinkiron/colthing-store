"use client";
import { motion } from "framer-motion";
import { Ruler, Truck, Sparkles, ShieldCheck } from "lucide-react";

const testimonials = [
  {
    name: "Ananya R.",
    quote:
      "I picked the linen, tweaked the sleeve and collar, and got a shirt that fits better than anything off a rack. The whole process felt like working with a real tailor.",
  },
  {
    name: "Priya S.",
    quote:
      "I described a dress I couldn't find anywhere — oversized, a specific neckline — and Knit & Knot quoted it, made it, and it arrived exactly as I imagined.",
  },
  {
    name: "Meera K.",
    quote:
      "The material pages are beautiful, and knowing exactly what fabric my garment is made from before I even choose a design made the whole decision easy.",
  },
];

const values = [
  { icon: Truck, label: "Timely Delivery", desc: "Your order, ready on time." },
  { icon: Sparkles, label: "Expert Craftsmanship", desc: "Every stitch is made with care." },
  { icon: Ruler, label: "Perfect Fit", desc: "Tailored to suit your measurements." },
  { icon: ShieldCheck, label: "100% Quality", desc: "Quality checked for every detail." },
];

const stats = [
  { number: "10+", label: "Years", desc: "Experience in every stitch" },
  { number: "150+", label: "Happy Customers", desc: "Trusted for quality and care" },
  { number: "100%", label: "Customised", desc: "Made around your preferences" },
  { number: "1", label: "Perfect Fit", desc: "Tailored especially for you" },
];

export default function Testimonials() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Loved by our customers</span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">Customer Love &amp; Feedback</h2>
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
              <p className="text-gold">★★★★★</p>
              <p className="mt-4 text-sm text-espresso/75">&ldquo;{t.quote}&rdquo;</p>
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
              <v.icon className="h-7 w-7 text-gold" />
              <p className="font-display mt-4 text-base">{v.label}</p>
              <p className="mt-1 text-xs text-espresso/55">{v.desc}</p>
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
              <p className="font-display text-3xl text-gold md:text-4xl">{s.number} <span className="text-xl md:text-2xl">{s.label}</span></p>
              <p className="mt-1 text-xs text-espresso/55">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const tiles = [
  {
    title: "Dresses",
    href: "/shop?category=dresses",
    img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Tops",
    href: "/shop?category=tops",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    span: "",
  },
  {
    title: "Co-ord Sets",
    href: "/shop?category=co-ords-sets",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    span: "",
  },
  {
    title: "Loungewear",
    href: "/shop?category=loungewear",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    span: "md:col-span-2",
  },
];

export default function WomensEditorial() {
  return (
    <section className="bg-[--color-beige]/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-[--color-gold]">
            Shop by Edit
          </span>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">Everyday Wardrobe Edit</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
          {tiles.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative min-h-[280px] overflow-hidden rounded-2xl ${t.span}`}
            >
              <Link href={t.href} className="block h-full w-full">
                <Image src={t.img} alt={t.title} fill className="object-cover transition-transform duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <p className="font-display absolute bottom-6 left-6 text-2xl text-white">{t.title}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

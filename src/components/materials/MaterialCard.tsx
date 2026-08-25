"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Material } from "@/lib/types";

export default function MaterialCard({ material, index = 0 }: { material: Material; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/materials/${material.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cream">
          {material.main_image && (
            <Image
              src={material.main_image}
              alt={material.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-display text-xl text-white">{material.name}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const images = product.product_images ?? [];
  const primary = images.sort((a, b) => a.sort_order - b.sort_order)[0];
  const secondary = images[1];
  const toggle = useWishlistStore((s) => s.toggle);
  const has = useWishlistStore((s) => s.has(product.id));
  const requireAuth = useRequireAuth();
  const [hover, setHover] = useState(false);

  const lowestStock = Math.min(...(product.product_variants?.map((v) => v.stock) ?? [0]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream">
          {primary && (
            <Image
              src={primary.url}
              alt={primary.alt ?? product.name}
              fill
              className={cn(
                "object-cover transition-opacity duration-500",
                secondary && hover ? "opacity-0" : "opacity-100"
              )}
            />
          )}
          {secondary && (
            <Image
              src={secondary.url}
              alt={secondary.alt ?? product.name}
              fill
              className={cn(
                "object-cover transition-opacity duration-500",
                hover ? "opacity-100" : "opacity-0"
              )}
            />
          )}

          {product.is_new && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase tracking-wide">
              New
            </span>
          )}
          {lowestStock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white px-4 py-1.5 text-xs">Sold Out</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              requireAuth(() => toggle(product.id));
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 rounded-full bg-white/85 p-2 opacity-0 backdrop-blur transition group-hover:opacity-100"
          >
            <Heart className={cn("h-4 w-4", has ? "fill-gold text-gold" : "text-espresso")} />
          </button>

          <div className="absolute inset-x-0 bottom-0 translate-y-full glass p-3 transition-transform duration-500 group-hover:translate-y-0">
            <p className="font-display truncate text-sm text-white">{product.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-sm text-white">{formatPrice(product.base_price)}</p>
              {product.compare_at_price && (
                <p className="text-xs text-white/60 line-through">
                  {formatPrice(product.compare_at_price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between md:hidden">
        <div>
          <p className="font-display text-sm">{product.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm">{formatPrice(product.base_price)}</p>
            {product.compare_at_price && (
              <p className="text-xs text-black/40 line-through">
                {formatPrice(product.compare_at_price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

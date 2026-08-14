"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Ruler, Sparkles, Wand2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, cn, splitList } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import SizeGuideModal from "@/components/product/SizeGuideModal";

export default function ProductDetailClient({ product }: { product: Product }) {
  const images = (product.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const variants = product.product_variants ?? [];
  const sizes = Array.from(new Set(variants.map((v) => v.size)));

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(sizes[0] ?? "");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [qty, setQty] = useState(1);

  const addLine = useCartStore((s) => s.addLine);
  const toggle = useWishlistStore((s) => s.toggle);
  const has = useWishlistStore((s) => s.has(product.id));
  const requireAuth = useRequireAuth();

  const selectedVariant = useMemo(
    () => variants.find((v) => v.size === size),
    [variants, size]
  );

  const price = selectedVariant?.price ?? product.base_price;
  const maxQty = selectedVariant?.stock ?? 0;
  const inStock = maxQty > 0;

  // Stock differs per size, so clamp quantity whenever the selected variant
  // changes instead of letting it silently exceed what's actually in stock.
  useEffect(() => {
    setQty((q) => Math.min(Math.max(q, 1), Math.max(maxQty, 1)));
  }, [maxQty]);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
            {images[activeImage] && (
              <Image
                src={images[activeImage].url}
                alt={images[activeImage].alt ?? product.name}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-20 w-16 overflow-hidden rounded-lg border-2",
                    activeImage === i ? "border-gold" : "border-transparent"
                  )}
                >
                  <Image src={img.url} alt={img.alt ?? product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {product.categories && (
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{product.categories.name}</p>
          )}
          <h1 className="font-display mt-3 text-3xl md:text-4xl">{product.name}</h1>

          {product.materials && (
            <Link
              href={`/materials/${product.materials.slug}`}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs text-espresso/70 transition hover:bg-cream/70"
            >
              Made with <span className="font-medium text-espresso">{product.materials.name}</span>
            </Link>
          )}

          <div className="mt-4 flex items-center gap-3">
            <p className="text-xl">{formatPrice(price)}</p>
            {product.compare_at_price && (
              <p className="text-sm text-black/40 line-through">{formatPrice(product.compare_at_price)}</p>
            )}
          </div>

          <p className="mt-6 max-w-md text-sm text-espresso/65">{product.description}</p>
          {product.design_details && (
            <p className="mt-2 max-w-md text-sm text-espresso/50">{product.design_details}</p>
          )}

          {product.materials?.color && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wide text-espresso/50">
                Colour — <span className="normal-case text-espresso/80">{product.materials.color}</span>
              </p>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-espresso/50">Size — {size}</p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 text-xs text-espresso/50 underline underline-offset-2"
                >
                  <Ruler className="h-3 w-3" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const stockForSize = variants.find((v) => v.size === s)?.stock ?? 0;
                  return (
                    <button
                      key={s}
                      disabled={stockForSize === 0}
                      onClick={() => setSize(s)}
                      className={cn(
                        "h-10 w-10 rounded-full border text-sm transition",
                        size === s ? "border-gold bg-gold text-white" : "border-black/20 hover:border-black/50",
                        stockForSize === 0 && "cursor-not-allowed opacity-30 line-through"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className={cn("mt-8 flex items-center gap-2 rounded-full border border-black/15 px-3 py-2 w-fit", !inStock && "opacity-40")}>
            <button disabled={!inStock || qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="disabled:cursor-not-allowed disabled:opacity-40">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm">{qty}</span>
            <button disabled={!inStock || qty >= maxQty} onClick={() => setQty((q) => Math.min(q + 1, maxQty))} aria-label="Increase" className="disabled:cursor-not-allowed disabled:opacity-40">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex gap-3">
              <button
                disabled={!inStock || !selectedVariant}
                onClick={() => {
                  if (!selectedVariant) return;
                  addLine({
                    itemType: "standard",
                    productId: product.id,
                    variantId: selectedVariant.id,
                    slug: product.slug,
                    name: product.name,
                    size,
                    basePrice: price,
                    customizationPrice: 0,
                    price,
                    image: images[0]?.url ?? null,
                    quantity: qty,
                    maxStock: selectedVariant.stock,
                  });
                }}
                className="flex-1 rounded-full bg-espresso py-3.5 text-sm tracking-wide text-white transition hover:bg-charcoal disabled:opacity-40"
              >
                {inStock ? "Buy As Shown" : "Out of Stock"}
              </button>
              <button
                onClick={() => requireAuth(() => toggle(product.id))}
                aria-label="Wishlist"
                className="rounded-full border border-black/15 p-3.5"
              >
                <Heart className={cn("h-5 w-5", has ? "fill-gold text-gold" : "")} />
              </button>
            </div>

            {product.customization_enabled && (
              <Link
                href={`/customize/${product.slug}`}
                className="flex items-center justify-center gap-2 rounded-full border border-gold px-6 py-3.5 text-sm tracking-wide text-gold transition hover:bg-gold hover:text-white"
              >
                <Wand2 className="h-4 w-4" /> Customize This Design
              </Link>
            )}

            <Link
              href={`/custom-request?${product.materials ? `material=${product.materials.slug}&` : ""}product=${product.slug}`}
              className="flex items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm tracking-wide text-espresso/80 transition hover:border-espresso"
            >
              <Sparkles className="h-4 w-4" /> Create Something Different
            </Link>
          </div>

          {(product.fabric || product.production_time) && (
            <div className="mt-10 space-y-2 border-t border-black/10 pt-6 text-sm text-espresso/60">
              {product.fabric && <p><span className="text-espresso/40">Fabric:</span> {product.fabric}</p>}
              {product.care_instructions && (
                <div>
                  <span className="text-espresso/40">Care:</span>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {splitList(product.care_instructions).map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              {product.production_time && <p><span className="text-espresso/40">Production time:</span> {product.production_time}</p>}
            </div>
          )}
        </motion.div>
      </div>

      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
    </main>
  );
}

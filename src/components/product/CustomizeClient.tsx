"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product, SelectedCustomization } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import MeasurementFields from "@/components/custom/MeasurementFields";
import SavedProfilesPicker from "@/components/custom/SavedProfilesPicker";

export default function CustomizeClient({ product }: { product: Product }) {
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);
  const images = product.product_images ?? [];
  const colors = Array.from(new Set((product.product_variants ?? []).map((v) => v.color)));
  const options = (product.customization_options ?? [])
    .filter((o) => o.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const [color, setColor] = useState(colors[0] ?? "");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  function selectValue(optionId: string, valueId: string) {
    setSelections((s) => ({ ...s, [optionId]: valueId }));
  }

  const chosen: SelectedCustomization[] = useMemo(() => {
    const list: SelectedCustomization[] = [];
    for (const opt of options) {
      const valueId = selections[opt.id];
      const value = opt.customization_values?.find((v) => v.id === valueId);
      if (value) list.push({ optionName: opt.name, valueLabel: value.label, price: value.additional_price });
    }
    return list;
  }, [options, selections]);

  const customizationPrice = chosen.reduce((sum, c) => sum + c.price, 0);
  const total = product.base_price + customizationPrice;

  const representativeVariant = (product.product_variants ?? []).find((v) => v.color === color) ?? null;

  function handleAddToCart() {
    addLine({
      itemType: "customized",
      productId: product.id,
      variantId: representativeVariant?.id ?? null,
      slug: product.slug,
      name: product.name,
      size: "Made to Measure",
      color: color || "As Shown",
      basePrice: product.base_price,
      customizationPrice,
      price: total,
      image: images[0]?.url ?? null,
      quantity: 1,
      maxStock: 999,
      customization: chosen,
      measurements,
    });
    setAdded(true);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-10 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Customize This Design</span>
        <h1 className="font-display mt-4 text-4xl">{product.name}</h1>
        {product.materials && <p className="mt-2 text-sm text-espresso/50">Made with {product.materials.name}</p>}
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
            {images[0] && <Image src={images[0].url} alt={product.name} fill className="object-cover" />}
          </div>
        </div>

        <div>
          {colors.length > 1 && (
            <div className="mb-8">
              <p className="mb-3 text-xs uppercase tracking-wide text-espresso/50">Base Colour — {color}</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-xs transition",
                      color === c ? "border-gold bg-gold/10" : "border-black/15"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {options.length === 0 ? (
            <p className="text-sm text-espresso/50">
              This design has no customization options configured yet.
            </p>
          ) : (
            <div className="space-y-8">
              {options.map((opt) => (
                <div key={opt.id}>
                  <p className="mb-3 text-xs uppercase tracking-wide text-espresso/50">{opt.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {(opt.customization_values ?? [])
                      .filter((v) => v.is_active)
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((v) => (
                        <button
                          key={v.id}
                          onClick={() => selectValue(opt.id, v.id)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-xs transition",
                            selections[opt.id] === v.id ? "border-gold bg-gold text-white" : "border-black/15 hover:border-black/40"
                          )}
                        >
                          {v.label}
                          {v.additional_price > 0 && <span className="ml-1 opacity-70">+{formatPrice(v.additional_price)}</span>}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-black/10 pt-8">
            <p className="mb-4 font-display text-lg">Your Measurements</p>
            <SavedProfilesPicker garmentType={product.garment_type} onSelect={setMeasurements} />
            <MeasurementFields
              garmentType={product.garment_type}
              values={measurements}
              onChange={(field, value) => setMeasurements((m) => ({ ...m, [field]: value }))}
            />
          </div>

          <div className="mt-10 rounded-2xl bg-cream/50 p-6">
            <div className="flex justify-between text-sm text-espresso/60">
              <span>Original design</span>
              <span>{formatPrice(product.base_price)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-espresso/60">
              <span>Customization</span>
              <span>{formatPrice(customizationPrice)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-black/10 pt-3 text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {added ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/cart" className="flex-1 rounded-full bg-espresso py-3.5 text-center text-sm text-white">
                View Bag
              </Link>
              <button
                onClick={() => router.push("/shop")}
                className="flex-1 rounded-full border border-black/15 py-3.5 text-sm"
              >
                Keep Browsing
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="mt-6 w-full rounded-full bg-espresso py-3.5 text-sm tracking-wide text-white transition hover:bg-charcoal"
            >
              Add Customized Design to Bag — {formatPrice(total)}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

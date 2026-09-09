import { createClient } from "@/lib/supabase/server";

export type IncomingItem = {
  product_id: string;
  variant_id: string | null;
  size: string;
  quantity: number;
  item_type: string;
};

export type PricedItem = IncomingItem & {
  product_name: string;
  unit_price: number;
  customization: null;
  measurements: null;
  customization_price: number;
};

/**
 * Recomputes what a cart *actually* costs straight from the database.
 *
 * The browser sends us product ids and quantities, but never a price we
 * trust — otherwise anyone could edit the request and pay ₹1 for a ₹3,000
 * kurti. Every rupee charged is derived here, server-side, from the real
 * variant/product row.
 */
export async function priceCart(items: IncomingItem[]): Promise<
  | { ok: true; total: number; items: PricedItem[] }
  | { ok: false; error: string }
> {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "Your bag is empty." };
  }

  const supabase = await createClient();

  const productIds = [...new Set(items.map((i) => i.product_id))];
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, base_price, status")
    .in("id", productIds);

  if (prodErr || !products) {
    return { ok: false, error: "Could not load product prices." };
  }

  const variantIds = items
    .map((i) => i.variant_id)
    .filter((v): v is string => Boolean(v));

  const { data: variants } = variantIds.length
    ? await supabase
        .from("product_variants")
        .select("id, product_id, price, stock, size")
        .in("id", variantIds)
    : { data: [] as { id: string; product_id: string; price: number | null; stock: number; size: string }[] };

  const priced: PricedItem[] = [];

  for (const item of items) {
    const quantity = Math.floor(Number(item.quantity));
    if (!Number.isFinite(quantity) || quantity < 1) {
      return { ok: false, error: "Invalid quantity in your bag." };
    }

    const product = products.find((p) => p.id === item.product_id);
    if (!product) {
      return { ok: false, error: "One of the items is no longer available." };
    }
    if (product.status !== "active") {
      return { ok: false, error: `"${product.name}" is no longer available.` };
    }

    const variant = variants?.find((v) => v.id === item.variant_id);
    if (item.variant_id && !variant) {
      return { ok: false, error: `The selected size for "${product.name}" is unavailable.` };
    }
    if (variant && variant.product_id !== product.id) {
      return { ok: false, error: "Item mismatch in your bag." };
    }
    if (variant && variant.stock < quantity) {
      return {
        ok: false,
        error: `Only ${variant.stock} left of "${product.name}" in size ${variant.size}.`,
      };
    }

    const unitPrice = Number(variant?.price ?? product.base_price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return { ok: false, error: `Pricing unavailable for "${product.name}".` };
    }

    priced.push({
      product_id: product.id,
      variant_id: item.variant_id,
      product_name: product.name,
      size: variant?.size ?? item.size,
      quantity,
      unit_price: unitPrice,
      item_type: "standard",
      customization: null,
      measurements: null,
      customization_price: 0,
    });
  }

  const total = priced.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  return { ok: true, total, items: priced };
}

/**
 * Shared "buy 2 for / buy 3 for" bundle pricing math.
 *
 * Both the server (pricing.ts, for the real charge) and the browser (product
 * page and cart, for display) need the exact same calculation, or a customer
 * could see one number and be charged another. This file is the single
 * source of truth for that math — pure functions, no I/O, safe to import
 * from either side.
 */

export type BundlePrices = {
  bundle_price_2?: number | null;
  bundle_price_3?: number | null;
};

/**
 * Cheapest possible total for `quantity` units of an item, given its regular
 * unit price and any bundle deals. Uses whichever combination of singles,
 * pairs and triples costs the least — so a customer buying 5 with a "buy 3
 * for ₹1700" deal automatically gets 3-at-bundle + 2-at-regular if that's
 * cheaper than any other split, without needing to hit an exact multiple.
 */
export function cheapestTotalForQuantity(
  quantity: number,
  unitPrice: number,
  bundle: BundlePrices
): number {
  const bundle2 = bundle.bundle_price_2 ?? null;
  const bundle3 = bundle.bundle_price_3 ?? null;

  if (!Number.isFinite(quantity) || quantity < 1) return 0;

  // cost[n] = cheapest total for n units
  const cost: number[] = [0];
  for (let n = 1; n <= quantity; n++) {
    let best = cost[n - 1] + unitPrice;
    if (n >= 2 && bundle2 !== null && bundle2 > 0) {
      best = Math.min(best, cost[n - 2] + bundle2);
    }
    if (n >= 3 && bundle3 !== null && bundle3 > 0) {
      best = Math.min(best, cost[n - 3] + bundle3);
    }
    cost[n] = best;
  }
  return cost[quantity];
}

/** How much cheaper `quantity` units are versus paying full unit price for all of them. */
export function bundleSavings(
  quantity: number,
  unitPrice: number,
  bundle: BundlePrices
): number {
  const fullPrice = unitPrice * quantity;
  const discounted = cheapestTotalForQuantity(quantity, unitPrice, bundle);
  return Math.max(0, fullPrice - discounted);
}

/** True if a product has any bundle offer configured at all. */
export function hasBundleOffer(bundle: BundlePrices): boolean {
  return Boolean(
    (bundle.bundle_price_2 && bundle.bundle_price_2 > 0) ||
      (bundle.bundle_price_3 && bundle.bundle_price_3 > 0)
  );
}

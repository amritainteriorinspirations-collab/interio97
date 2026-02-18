// lib/pricing/cartPricing.js

/**
 * PRICING — SINGLE SOURCE OF TRUTH
 *
 * Canonical totals shape used everywhere (cart API, cart UI, checkout, saved order):
 * ┌─────────────────┬──────────────────────────────────────────────────────────┐
 * │ mrp             │ sum of all lineOriginalTotal (market price before discount)│
 * │ discount        │ total rupees saved  (mrp - subtotal)                      │
 * │ subtotal        │ items total AFTER discounts, BEFORE delivery              │
 * │ deliveryCharge  │ fixed ₹399                                                │
 * │ grandTotal      │ subtotal + deliveryCharge                                 │
 * └─────────────────┴──────────────────────────────────────────────────────────┘
 *
 * Per-item pricing shape (in cart API response + order pricingSnapshot):
 * ┌───────────────────┬──────────────────────────────────────┐
 * │ unitOriginalPrice │ MRP per unit                         │
 * │ unitFinalPrice    │ after-discount price per unit        │
 * │ discountPerUnit   │ rupees saved per unit (0 if none)    │
 * │ discountPercent   │ % off rounded (0 if none)            │
 * │ lineOriginalTotal │ unitOriginalPrice × qty              │
 * │ lineFinalTotal    │ unitFinalPrice × qty                 │
 * └───────────────────┴──────────────────────────────────────┘
 */

const DELIVERY_CHARGE = 399;

/** Private: assembles canonical totals from accumulated mrp + subtotal. */
function buildTotals(mrp, subtotal) {
  return {
    mrp,
    discount:       mrp - subtotal,
    subtotal,
    deliveryCharge: DELIVERY_CHARGE,
    grandTotal:     subtotal + DELIVERY_CHARGE,
  };
}

/**
 * Resolves per-unit pricing for a single product based on user role.
 */
export function resolveUnitPrice(product, role) {
  const isEnterprise = role === "enterprise";

  const originalPrice = isEnterprise
    ? product.enterprisePrice
    : product.retailPrice;

  const discountPrice = isEnterprise
    ? product.enterpriseDiscountPrice
    : product.retailDiscountPrice;

  const hasDiscount =
    discountPrice != null &&
    discountPrice > 0 &&
    discountPrice < originalPrice;

  const finalPrice      = hasDiscount ? discountPrice : originalPrice;
  const discountPerUnit = hasDiscount ? originalPrice - discountPrice : 0;
  const discountPercent = hasDiscount
    ? Math.round((discountPerUnit / originalPrice) * 100)
    : 0;

  return {
    unitOriginalPrice: originalPrice,
    unitFinalPrice:    finalPrice,
    discountPerUnit,
    discountPercent,
  };
}

/**
 * Resolves full per-item pricing: unit prices + line totals for a given quantity.
 */
export function resolveCartItemPricing({ product, quantity, role }) {
  const unit = resolveUnitPrice(product, role);

  return {
    ...unit,
    lineOriginalTotal: unit.unitOriginalPrice * quantity,
    lineFinalTotal:    unit.unitFinalPrice    * quantity,
  };
}

/**
 * Resolves pricing for the full cart.
 * Returns items (each with `pricing` attached) + canonical totals.
 */
export function resolveCartPricing({ items, role }) {
  let mrp      = 0;
  let subtotal = 0;

  const resolvedItems = items.map((item) => {
    const pricing = resolveCartItemPricing({
      product:  item.product,
      quantity: item.quantity,
      role,
    });

    mrp      += pricing.lineOriginalTotal;
    subtotal += pricing.lineFinalTotal;

    return { ...item, pricing };
  });

  return {
    items:  resolvedItems,
    totals: buildTotals(mrp, subtotal),
  };
}

/**
 * Recalculates canonical totals from already-resolved cart items.
 *
 * Use this for client-side optimistic updates (qty change, item removal)
 * so the cart summary stays accurate without a server round-trip.
 *
 * Requires items that already have a `pricing` key (as the cart API returns).
 */
export function recalcTotalsFromItems(items) {
  let mrp      = 0;
  let subtotal = 0;

  for (const item of items) {
    mrp      += item.pricing.lineOriginalTotal;
    subtotal += item.pricing.lineFinalTotal;
  }

  return buildTotals(mrp, subtotal);
}
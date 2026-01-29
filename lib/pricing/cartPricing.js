// lib/pricing/cartPricing.js

export function resolveUnitPrice(product, role) {
  const isEnterprise = role === "enterprise";

  const originalPrice = isEnterprise
    ? product.enterprisePrice
    : product.retailPrice;

  const discountPrice = isEnterprise
    ? product.enterpriseDiscountPrice
    : product.retailDiscountPrice;

  const hasDiscount =
    discountPrice &&
    discountPrice > 0 &&
    discountPrice < originalPrice;

  const finalPrice = hasDiscount ? discountPrice : originalPrice;

  const discountPerUnit = hasDiscount
    ? originalPrice - discountPrice
    : 0;

  const discountPercent = hasDiscount
    ? Math.round((discountPerUnit / originalPrice) * 100)
    : 0;

  return {
    unitOriginalPrice: originalPrice,
    unitFinalPrice: finalPrice,
    discountPerUnit,
    discountPercent,
  };
}

export function resolveCartItemPricing({ product, quantity, role }) {
  const unit = resolveUnitPrice(product, role);

  return {
    ...unit,
    lineOriginalTotal: unit.unitOriginalPrice * quantity,
    lineFinalTotal: unit.unitFinalPrice * quantity,
  };
}

export function resolveCartPricing({ items, role }) {
  let totalOriginalPrice = 0;
  let totalFinalPrice = 0;

  const resolvedItems = items.map((item) => {
    const pricing = resolveCartItemPricing({
      product: item.product,
      quantity: item.quantity,
      role,
    });

    totalOriginalPrice += pricing.lineOriginalTotal;
    totalFinalPrice += pricing.lineFinalTotal;

    return {
      ...item,
      pricing,
    };
  });

  const totalDiscount = totalOriginalPrice - totalFinalPrice;
  const deliveryCharge = 399;

  return {
    items: resolvedItems,
    totals: {
      totalOriginalPrice,
      totalDiscount,
      deliveryCharge,
      grandTotal: totalFinalPrice + deliveryCharge,
    },
  };
}

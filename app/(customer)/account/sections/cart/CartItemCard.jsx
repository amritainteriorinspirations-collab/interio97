// app/(customer)/account/sections/cart/CartItemCard.jsx
"use client";

import { useAccount } from "../../AccountDataProvider";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import { recalcTotalsFromItems } from "@/lib/pricing/cartPricing";
import QuantityControl from "./QuantityControl";
import { useState } from "react";
import { Trash2, AlertCircle, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartItemCard({ item }) {
  const { cart, setCart } = useAccount();
  const [updating, setUpdating]   = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError]         = useState(null);

  const { product, quantity, pricing } = item;

  // ─── Quantity Change ───────────────────────────────────────────────────────
  async function changeQuantity(newQty) {
    if (newQty < 1) return;

    setUpdating(true);
    setError(null);

    // Build updated items with recalculated per-item pricing
    const updatedItems = cart.items.map((i) => {
      if (i.product._id !== product._id) return i;

      // Recalc line totals for the new quantity; unit prices are unchanged
      return {
        ...i,
        quantity: newQty,
        pricing: {
          ...i.pricing,
          lineOriginalTotal: i.pricing.unitOriginalPrice * newQty,
          lineFinalTotal:    i.pricing.unitFinalPrice    * newQty,
        },
      };
    });

    const previousCart = cart;

    // Optimistic update — use canonical recalc so totals shape is always consistent
    setCart((prev) => ({
      ...prev,
      items:  updatedItems,
      totals: recalcTotalsFromItems(updatedItems),
    }));

    try {
      await updateCartItem(product._id, newQty);
      // Server action persists qty only; our optimistic totals are already correct
    } catch (err) {
      setError(err.message || "Failed to update quantity");
      setCart(previousCart); // revert on failure
    } finally {
      setUpdating(false);
    }
  }

  // ─── Remove Item ───────────────────────────────────────────────────────────
  async function removeItem() {
    if (!confirm("Remove this item from your cart?")) return;

    setIsRemoving(true);
    setError(null);

    const updatedItems = cart.items.filter((i) => i.product._id !== product._id);
    const previousCart = cart;

    // Optimistic update
    setCart((prev) => ({
      ...prev,
      items:  updatedItems,
      totals: recalcTotalsFromItems(updatedItems),
    }));

    try {
      await removeFromCart(product._id);
    } catch (err) {
      setError(err.message || "Failed to remove item");
      setIsRemoving(false);
      setCart(previousCart); // revert on failure
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex gap-3">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="p-4 flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <Link href={`/product/${product.slug}`} target="_blank">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                width={100}
                height={100}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package size={20} />
              </div>
            )}
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>

          {product.slug && (
            <p className="text-xs text-gray-400 mb-3">SKU: {product.slug}</p>
          )}

          {/* Pricing */}
          <div className="space-y-1 mb-4">
            {/* MRP (struck through) */}
            {pricing.discountPercent > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  ₹{pricing.unitOriginalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-400">
                  {product.sellBy && `per ${product.sellBy}`}
                </span>
              </div>
            )}

            {/* Discount badge */}
            {pricing.discountPercent > 0 && (
              <span className="inline-block text-xs font-semibold text-white bg-green-500 px-2 py-0.5 rounded">
                {pricing.discountPercent}% OFF
              </span>
            )}

            {/* Final unit price */}
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-gray-900">
                ₹{pricing.unitFinalPrice.toLocaleString("en-IN")}
              </span>
              {product.sellBy && (
                <span className="text-xs text-gray-500">per {product.sellBy}</span>
              )}
            </div>
          </div>

          {/* Qty control + remove */}
          <div className="flex items-center gap-3">
            <QuantityControl
              quantity={quantity}
              onChange={changeQuantity}
              disabled={updating || isRemoving}
            />
            <button
              onClick={removeItem}
              disabled={isRemoving || updating}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>

        {/* Line Total */}
        <div className="text-right flex flex-col justify-center min-w-fit">
          <p className="text-xs text-gray-500 mb-1 font-medium">Line Total</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{pricing.lineFinalTotal.toLocaleString("en-IN")}
          </p>
          {pricing.discountPercent > 0 && (
            <>
              <p className="text-xs text-gray-400 line-through mt-0.5">
                ₹{pricing.lineOriginalTotal.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-green-600 font-semibold mt-0.5">
                Save ₹{(pricing.lineOriginalTotal - pricing.lineFinalTotal).toLocaleString("en-IN")}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
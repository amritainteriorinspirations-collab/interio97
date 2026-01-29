"use client";

import { useAccount } from "../../AccountDataProvider";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import QuantityControl from "./QuantityControl";
import { useState } from "react";

export default function CartItem({ item }) {
  const { setCart } = useAccount();
  const [updating, setUpdating] = useState(false);

  const {
    product,
    quantity,
    pricing,
  } = item;

  async function changeQuantity(newQty) {
    setUpdating(true);

    // optimistic UI
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.product._id === product._id
          ? { ...i, quantity: newQty }
          : i
      ),
    }));

    try {
      await updateCartItem(product._id, newQty);
    } catch {
      // revert on error
      setCart((prev) => prev);
    } finally {
      setUpdating(false);
    }
  }

  async function removeItem() {
    setUpdating(true);
    await removeFromCart(product._id);

    setCart((prev) => ({
      ...prev,
      items: prev.items.filter(
        (i) => i.product._id !== product._id
      ),
    }));
  }

  return (
    <div className="bg-white border rounded p-4 flex gap-4">
      {/* Image */}
      <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">
          {product.name}
        </p>

        {/* Price */}
        <div className="text-sm">
          {pricing.discountPercent > 0 && (
            <span className="line-through text-gray-400 mr-2">
              ₹{pricing.unitOriginalPrice}
            </span>
          )}
          <span className="font-semibold">
            ₹{pricing.unitFinalPrice}
          </span>
          <span className="text-xs text-gray-500 ml-1">
            / {product.sellBy}
          </span>

          {pricing.discountPercent > 0 && (
            <span className="ml-2 text-xs text-green-600 font-semibold">
              {pricing.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quantity + Remove */}
        <div className="flex items-center gap-4">
          <QuantityControl
            quantity={quantity}
            stock={product.stock}
            onChange={changeQuantity}
          />

          <button
            disabled={updating}
            onClick={removeItem}
            className="text-xs text-red-600"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-sm font-semibold">
        ₹{pricing.lineFinalTotal}
      </div>
    </div>
  );
}

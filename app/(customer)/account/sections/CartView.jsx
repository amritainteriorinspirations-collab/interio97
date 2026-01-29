"use client";

import { useAccount } from "../AccountDataProvider";
import CartItem from "./cart/CartItem";
import CartSummary from "./cart/CartSummary";

export default function CartView() {
  const { cart, loading } = useAccount();

  if (loading.cart || !cart) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-500">
        Loading cart…
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-600">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Items */}
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <CartItem key={item.product._id} item={item} />
        ))}
      </div>

      {/* Right: Summary */}
      <CartSummary totals={cart.totals} />
    </div>
  );
}

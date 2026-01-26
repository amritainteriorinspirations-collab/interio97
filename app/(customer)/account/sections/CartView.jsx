"use client";

import { useAccount } from "../AccountDataProvider";
import {
  updateCartItem,
  removeFromCart,
} from "@/lib/actions/cart";
import { useRouter } from "next/navigation";

export default function CartView() {
  const { cart, setCart, loading } = useAccount();
  const router = useRouter();

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

  async function updateQty(productId, qty) {
    const updatedCart = await updateCartItem(productId, qty);
    setCart(updatedCart);
  }

  async function removeItem(productId) {
    const updatedCart = await removeFromCart(productId);
    setCart(updatedCart);
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <div
          key={item.product._id}
          className="bg-white border rounded p-4 flex justify-between"
        >
          <div>
            <p className="text-sm font-medium">
              {item.product.name}
            </p>
            <p className="text-xs text-gray-500">
              ₹{item.pricing.finalUnitPrice}
            </p>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQty(
                  item.product._id,
                  Number(e.target.value)
                )
              }
              className="border px-2 py-1 rounded text-sm w-16 mt-2"
            />

            <button
              onClick={() => removeItem(item.product._id)}
              className="block text-xs text-red-600 mt-1"
            >
              Remove
            </button>
          </div>

          <p className="font-medium text-sm">
            ₹{item.pricing.lineTotal}
          </p>
        </div>
      ))}

      <div className="bg-white border rounded p-6 flex justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">
          ₹{cart.subtotal}
        </span>
      </div>

      <button
        onClick={() => router.push("/checkout")}
        className="bg-orange-500 text-white py-2 rounded text-sm font-semibold w-full"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

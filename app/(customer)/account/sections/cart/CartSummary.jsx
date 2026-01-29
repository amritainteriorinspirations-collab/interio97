"use client";

import { useRouter } from "next/navigation";

export default function CartSummary({ totals }) {
  const router = useRouter();

  return (
    <div className="bg-white border rounded p-6 space-y-4 sticky top-24 h-fit">
      <h3 className="text-sm font-semibold">
        Price Details
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Market Price</span>
          <span>₹{totals.totalOriginalPrice}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{totals.totalDiscount}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span>₹{totals.deliveryCharge}</span>
        </div>
      </div>

      <hr />

      <div className="flex justify-between font-semibold">
        <span>Total Amount</span>
        <span>₹{totals.grandTotal}</span>
      </div>

      {totals.totalDiscount > 0 && (
        <p className="text-sm text-green-600">
          You will save ₹{totals.totalDiscount} on this order
        </p>
      )}

      <button
        onClick={() => router.push("/checkout")}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold text-sm"
      >
        Place Order
      </button>
    </div>
  );
}

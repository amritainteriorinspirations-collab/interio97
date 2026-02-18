// app/(customer)/checkout/OrderCheckoutSummary.jsx
"use client";

import { ShoppingCart, Truck, Gift, AlertCircle, X } from "lucide-react";

export default function OrderCheckoutSummary({ cart, placingOrder, onPlaceOrder }) {
  const { items, totals } = cart;

  // Canonical totals shape: { mrp, discount, subtotal, deliveryCharge, grandTotal }
  const mrp            = totals?.mrp            ?? 0;
  const discount       = totals?.discount       ?? 0;
  const subtotal       = totals?.subtotal       ?? 0;
  const deliveryCharge = totals?.deliveryCharge ?? 399;
  const grandTotal     = totals?.grandTotal     ?? 0;

  const savingsPercent = mrp > 0 ? Math.round((discount / mrp) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-200">
          <ShoppingCart size={20} className="text-orange-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Order Summary</h2>
          <p className="text-xs text-orange-700 mt-0.5">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Items List */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-2 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product._id} className="flex justify-between text-sm">
            <span className="text-gray-700 truncate pr-2">
              {item.product.name}{" "}
              <span className="text-gray-500">
                <X size={12} className="inline text-gray-500" /> {item.quantity}
              </span>
            </span>
            <span className="font-semibold text-gray-900 flex-shrink-0">
              ₹{item.pricing.lineFinalTotal.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-3">
        {/* Market Price (MRP) */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Market Price</span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{mrp.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600 font-medium">
              Discount ({savingsPercent}%)
            </span>
            <span className="text-sm font-semibold text-green-600">
              −₹{discount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Subtotal */}
        <div className="flex justify-between items-center pt-1 border-t border-gray-100">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Delivery */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Delivery</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {deliveryCharge === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              `₹${deliveryCharge.toLocaleString("en-IN")}`
            )}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-bold text-gray-900">Grand Total</span>
          <span className="text-2xl font-bold text-orange-600">
            ₹{grandTotal.toLocaleString("en-IN")}
          </span>
        </div>
        {discount > 0 && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Gift size={14} />
            Save ₹{discount.toLocaleString("en-IN")} on this order
          </p>
        )}
      </div>

      {/* Info */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <div className="flex gap-3 text-sm">
          <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="font-semibold text-blue-700">
            Estimated delivery in 3–5 business days
          </p>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="p-6 space-y-3">
        <button
          onClick={onPlaceOrder}
          disabled={placingOrder}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
        >
          {placingOrder ? "Placing Order…" : "Place Order"}
        </button>
        <p className="text-xs text-center text-gray-500">
          By placing your order, you agree to our terms & conditions
        </p>
      </div>

      {/* Trust Badge */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
        </svg>
        Secure checkout with SSL encryption
      </div>
    </div>
  );
}
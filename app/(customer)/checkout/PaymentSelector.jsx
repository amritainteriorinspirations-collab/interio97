"use client";

import { CreditCard, Banknote } from "lucide-react";

export default function PaymentSelector({ value, onChange }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-200">
          <CreditCard size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Payment Method</h2>
          <p className="text-xs text-blue-700 mt-0.5">Choose how to pay</p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="p-6 space-y-3">
        {/* Cash on Delivery */}
        <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
          value === "COD"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-200 hover:border-orange-300 bg-white"
        }`}>
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={value === "COD"}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Banknote size={18} className="text-gray-600" />
                <p className="text-sm font-semibold text-gray-900">
                  Cash on Delivery
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Pay when your order arrives
              </p>
            </div>
          </div>
        </label>

        {/* Online Payment */}
        <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
          value === "PREPAID"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-200 hover:border-orange-300 bg-white"
        }`}>
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="payment"
              value="PREPAID"
              checked={value === "PREPAID"}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={18} className="text-gray-600" />
                <p className="text-sm font-semibold text-gray-900">
                  Online Payment
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Pay securely using Razorpay
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Info Box */}
      <div className="border-t border-gray-200 px-6 py-4 bg-blue-50">
        <p className="text-xs text-blue-700">
          💡 <span className="font-medium">Tip:</span> Cash on Delivery is available for most areas
        </p>
      </div>
    </div>
  );
}
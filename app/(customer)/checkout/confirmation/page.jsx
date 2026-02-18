"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle, Package, ArrowRight, Copy, ShoppingBag, Lock, Zap, Phone } from "lucide-react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Redirect if no order ID
    if (!orderId || !orderNumber) {
      router.push("/products");
    }
  }, [orderId, orderNumber, router]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!orderId || !orderNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-12 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-white animate-bounce" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Order Confirmed!
            </h1>
            <p className="text-green-100 text-sm">
              Your order has been placed successfully
            </p>
          </div>

          {/* Order Details */}
          <div className="px-6 py-8 space-y-6">
            {/* Order Number */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-medium">Order Number</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-bold text-gray-900">
                  {orderNumber}
                </p>
                <button
                  onClick={copyOrderNumber}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Copy size={14} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* What's Next */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag size={18} />
                What's Next?
              </h2>
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-bold text-sm">
                      1
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Confirmation Email
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      You'll receive an email with order details shortly
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                      2
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Order Processing
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      We'll start preparing your order immediately
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                      3
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Delivery
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Expected delivery in 3-5 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">💡 Tip:</span> Save your order number to track your delivery. Access order details from your account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <button
                onClick={() => router.push(`/orders/${orderId}`)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm group"
              >
                View Order Details
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/account?tab=orders")}
                className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Go to My Orders
              </button>

              <button
                onClick={() => router.push("/products")}
                className="w-full text-blue-600 hover:text-blue-700 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Package size={16} />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2"><Lock size={24} className="text-gray-500 mx-auto" /></div>
            <p className="text-xs font-semibold text-gray-900">Secure</p>
            <p className="text-xs text-gray-600 mt-0.5">SSL encrypted</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2"><Zap size={24} className="text-gray-500 mx-auto" /></div>
            <p className="text-xs font-semibold text-gray-900">Fast</p>
            <p className="text-xs text-gray-600 mt-0.5">Quick processing</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2"><Phone size={24} className="text-gray-500 mx-auto" /></div>
            <p className="text-xs font-semibold text-gray-900">Support</p>
            <p className="text-xs text-gray-600 mt-0.5">24/7 available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
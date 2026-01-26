"use client";

import { useAccount } from "../AccountDataProvider";
import { useState } from "react";

export default function OrdersView() {
  const {
    orders,
    loading,
    loadOrderDetail,
  } = useAccount();

  const [expandedId, setExpandedId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  if (loading.orders || !orders) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-500">
        Loading orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-600">
        You haven’t placed any orders yet.
      </div>
    );
  }

  async function toggleOrder(orderId) {
    if (expandedId === orderId) {
      setExpandedId(null);
      setOrderDetail(null);
      return;
    }

    setExpandedId(orderId);
    setDetailLoading(true);

    try {
      const detail = await loadOrderDetail(orderId);
      setOrderDetail(detail);
    } catch (err) {
      alert(err.message);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border rounded"
        >
          {/* Order Summary */}
          <button
            onClick={() => toggleOrder(order._id)}
            className="w-full text-left p-4 flex flex-col sm:flex-row sm:justify-between gap-2"
          >
            <div>
              <p className="text-sm font-medium">
                Order #{order.orderNumber}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3 items-center text-sm">
              <span className="font-semibold">
                ₹{order.totals.grandTotal}
              </span>

              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  order.orderStatus === "payment_failed"
                    ? "bg-red-100 text-red-700"
                    : order.orderStatus === "processing"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.orderStatus.replace("_", " ")}
              </span>

              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : order.paymentStatus === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus.replace("_", " ")}
              </span>
            </div>
          </button>

          {/* Order Detail */}
          {expandedId === order._id && (
            <div className="border-t p-4 space-y-4">
              {detailLoading ? (
                <p className="text-sm text-gray-500">
                  Loading order details…
                </p>
              ) : (
                orderDetail && (
                  <>
                    {/* Items */}
                    <div className="space-y-2">
                      {orderDetail.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.productSnapshot.name} ×{" "}
                            {item.quantity}
                          </span>
                          <span>
                            ₹{item.pricingSnapshot.lineTotal}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Address Snapshot */}
                    <div className="border-t pt-3 text-sm">
                      <p className="font-medium mb-1">
                        Shipping Address
                      </p>
                      <p>{orderDetail.addressSnapshot.name}</p>
                      <p className="text-gray-600">
                        {orderDetail.addressSnapshot.addressLine1},{" "}
                        {orderDetail.addressSnapshot.city},{" "}
                        {orderDetail.addressSnapshot.state} –{" "}
                        {orderDetail.addressSnapshot.pincode}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-3 flex justify-between font-semibold text-sm">
                      <span>Total</span>
                      <span>
                        ₹{orderDetail.totals.grandTotal}
                      </span>
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

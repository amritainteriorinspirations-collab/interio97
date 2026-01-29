"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      setOrder(data.order);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-sm text-gray-500">
        Loading order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-sm text-red-600">
        Order not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border rounded p-6">
        <p className="text-sm text-gray-500">
          Order #{order.orderNumber}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleString()}
        </p>

        <div className="flex gap-3 mt-3">
          <span className="text-sm font-medium">
            Status: {order.orderStatus.replace("_", " ")}
          </span>
          <span className="text-sm font-medium">
            Payment: {order.paymentStatus.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border rounded p-6 space-y-4">
        <h2 className="font-semibold">Items</h2>

        {order.items.map((item) => {
          const p = item.pricingSnapshot;
          const lineFinal =
            p.lineFinalTotal ?? p.lineTotal ?? 0;

          return (
            <div
              key={item.productId}
              className="flex justify-between text-sm"
            >
              <div>
                <p>
                  {item.productSnapshot.name} ×{" "}
                  {item.quantity}
                </p>

                {p.lineOriginalTotal &&
                  p.lineOriginalTotal > lineFinal && (
                    <p className="text-xs text-gray-400 line-through">
                      ₹{p.lineOriginalTotal}
                    </p>
                  )}
              </div>

              <span className="font-medium">
                ₹{lineFinal}
              </span>
            </div>
          );
        })}
      </div>

      {/* Address */}
      <div className="bg-white border rounded p-6">
        <h2 className="font-semibold mb-2">
          Shipping Address
        </h2>
        <p>{order.addressSnapshot.name}</p>
        <p className="text-sm text-gray-600">
          {order.addressSnapshot.addressLine1},{" "}
          {order.addressSnapshot.city},{" "}
          {order.addressSnapshot.state} –{" "}
          {order.addressSnapshot.pincode}
        </p>
      </div>

      {/* Payment Summary */}
      <div className="bg-white border rounded p-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Total Market Price</span>
          <span>₹{order.totals.subtotal}</span>
        </div>

        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-₹{order.totals.discount}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg border-t pt-2">
          <span>Total Paid</span>
          <span>₹{order.totals.grandTotal}</span>
        </div>
      </div>
    </div>
  );
}

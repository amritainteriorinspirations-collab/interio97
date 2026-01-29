"use client";

import { useAccount } from "../AccountDataProvider";
import { useRouter } from "next/navigation";

function StatusBadge({ status, type }) {
  const map = {
    order: {
      processing: "bg-blue-100 text-blue-700",
      payment_failed: "bg-red-100 text-red-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-gray-100 text-gray-700",
      created: "bg-gray-100 text-gray-700",
      payment_pending: "bg-yellow-100 text-yellow-700",
    },
    payment: {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      not_required: "bg-gray-100 text-gray-700",
    },
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded ${
        map[type][status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function OrdersView() {
  const { orders, loading } = useAccount();
  const router = useRouter();

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

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          {/* Left */}
          <div>
            <p className="text-sm font-medium">
              Order #{order.orderNumber}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Middle */}
          <div className="flex gap-2">
            <StatusBadge
              type="order"
              status={order.orderStatus}
            />
            <StatusBadge
              type="payment"
              status={order.paymentStatus}
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm">
              ₹{order.totals.grandTotal}
            </span>

            <button
              onClick={() =>
                router.push(`/order/${order._id}`)
              }
              className="text-sm text-orange-600 hover:underline"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

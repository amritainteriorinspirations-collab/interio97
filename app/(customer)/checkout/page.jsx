"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/checkout";

import AddressSelector from "./AddressSelector";
import PaymentSelector from "./PaymentSelector";
import OrderSummary from "./OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    async function load() {
      const [cartRes, addrRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/addresses"),
      ]);

      const cartData = await cartRes.json();
      const addrData = await addrRes.json();

      setCart(cartData.cart);
      setAddresses(addrData.addresses || []);

      const defaultAddr = addrData.addresses?.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr._id);

      setLoading(false);
    }

    load();
  }, []);

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      alert("Please select an address");
      return;
    }

    try {
      setPlacingOrder(true);

      const result = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
      });

      if (paymentMethod === "COD") {
        router.push("/account?tab=orders");
      } else {
        router.push(`/pay/${result.orderId}`);
      }
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading || !cart) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500">
        Loading checkout…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        <AddressSelector
          addresses={addresses}
          selected={selectedAddressId}
          onSelect={setSelectedAddressId}
        />

        <PaymentSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>

      {/* RIGHT */}
      <OrderSummary
        cart={cart}
        placingOrder={placingOrder}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}

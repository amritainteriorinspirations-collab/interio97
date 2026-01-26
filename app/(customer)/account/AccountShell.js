"use client";

import { useEffect, useState } from "react";
import { useAccount } from "./AccountDataProvider";

import ProfileView from "./sections/ProfileView.jsx";
import AddressView from "./sections/AddressView";
import CartView from "./sections/CartView";
import OrdersView from "./sections/OrdersView";

const TABS = ["profile", "addresses", "cart", "orders"];

export default function AccountShell() {
  const [activeTab, setActiveTab] = useState("profile");
  const account = useAccount();

  // load data only when tab is opened (ONCE)
  useEffect(() => {
    if (activeTab === "profile") account.loadUser();
    if (activeTab === "addresses") account.loadAddresses();
    if (activeTab === "cart") account.loadCart();
    if (activeTab === "orders") account.loadOrders();
  }, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto px-3 py-4">
      {/* Sticky Tabs */}
      <div className="sticky top-0 bg-white z-20 border-b mb-4">
        <div className="flex gap-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-sm font-medium capitalize border-b-2 ${
                activeTab === tab
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "profile" && <ProfileView />}
        {activeTab === "addresses" && <AddressView />}
        {activeTab === "cart" && <CartView />}
        {activeTab === "orders" && <OrdersView />}
      </div>
    </div>
  );
}

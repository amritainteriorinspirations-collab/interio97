// components/Header.jsx
// FIX: Removed `user` prop. Now reads from useAuth() so the header
// updates reactively after login/logout without a full page reload.
// This fixes the "profile section doesn't update after sign-in" bug in production.
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, ShoppingCart, User2 } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import PincodeChecker from "./PincodeChecker";

export default function Header() {
  // Auth state from context — updates whenever user logs in or out
  const { user, loading } = useAuth();

  const router = useRouter();
  const [searchQuery,    setSearchQuery]    = useState("");
  const [pincode,        setPincode]        = useState("");
  const [showPinPopover, setShowPinPopover] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white w-full fixed top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto w-full">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="Amrita logo" width={38} height={38} className="object-contain" />
          <div className="flex flex-col items-start text-orange-700 leading-tight">
            <span className="text-base font-bold tracking-widest">Amrita</span>
            <span className="text-[9px] tracking-wide text-orange-500">Interior & Design</span>
          </div>
        </Link>

        {/* ── Delivery location ── */}
        <div className="relative flex-shrink-0 hidden sm:block">
          <button
            onClick={() => setShowPinPopover((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors"
          >
            <MapPin className="w-4 h-4 text-orange-500" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] text-gray-500">Deliver to</span>
              <span className="text-xs font-semibold text-gray-800 font-mono">
                {pincode || "Pincode"}
              </span>
            </div>
          </button>

          {showPinPopover && (
            <PincodeChecker
              pincode={pincode}
              onPincodeChange={setPincode}
              onClose={() => setShowPinPopover(false)}
            />
          )}
        </div>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl mx-auto">
          <div className="flex w-full rounded-lg border border-gray-200 overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-gray-50 focus-within:bg-white">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories…"
              className="flex-1 pl-4 pr-2 py-2.5 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none min-w-0"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 text-sm font-medium transition-colors flex-shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Profile — skeleton while auth loads to prevent layout jump */}
          {loading ? (
            <div className="w-24 h-9 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <Link
              href={user ? "/account" : "/login"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
              title={user ? "My Account" : "Login"}
            >
              <div className="w-7 h-7 rounded-md bg-orange-500 group-hover:bg-orange-600 flex items-center justify-center transition-colors flex-shrink-0">
                <User2 className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="hidden md:flex flex-col leading-tight">
                <span className="text-[10px] text-gray-500">
                  {user ? "Hello," : "Sign in"}
                </span>
                <span className="text-xs font-semibold text-gray-800 max-w-[80px] truncate">
                  {user ? (user.name?.split(" ")[0] || "Account") : "Login"}
                </span>
              </div>
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/account?tab=cart"
            className="relative p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
          </Link>
        </div>

      </div>
    </header>
  );
}
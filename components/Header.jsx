"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, ShoppingCart, User2 } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import PincodeChecker from "./PincodeChecker";

export default function Header({ config = {} }) {
  const {
    companyName = "Interio97",
    tagline = "",
    logoUrl = "/logo.svg", // fallback logo
  } = config;

  const { user, loading } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [pincode, setPincode] = useState("");
  const [showPinPopover, setShowPinPopover] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (query.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="bg-white w-full fixed top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-4">

        {/* ── Row 1 ── */}
        <div className="flex items-center gap-3 py-3">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src={logoUrl || './logo.png'}
              alt={companyName}
              width={38}
              height={38}
              priority
              className="object-contain"
            />
            <div className="flex flex-col items-start leading-tight text-orange-700">
              <span className="text-[16px] font-bold tracking-wide">
                {companyName}
              </span>
              {tagline && (
                <span className="text-[9px] tracking-wide text-orange-500">
                  {tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Delivery Location (desktop only) */}
          <div className="relative hidden sm:block flex-shrink-0">
            <button
              onClick={() => setShowPinPopover((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 transition"
            >
              <MapPin className="w-4 h-4 text-orange-500" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] text-gray-500">
                  Deliver to
                </span>
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

          {/* Spacer (mobile) */}
          <div className="flex-1 sm:hidden" />

          {/* Search (desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-2xl mx-auto"
          >
            <div className="flex w-full rounded-lg border border-gray-200 overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 bg-gray-50 focus-within:bg-white transition">

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories…"
                className="flex-1 pl-4 pr-2 py-2.5 text-sm bg-transparent focus:outline-none min-w-0"
              />

              <button
                type="submit"
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 text-sm font-medium transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Profile */}
            {loading ? (
              <div className="w-9 h-9 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <Link
                href={user ? "/account" : "/login"}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition group"
                title={user ? "My Account" : "Login"}
              >
                <div className="w-7 h-7 rounded-md bg-orange-500 group-hover:bg-orange-600 flex items-center justify-center">
                  <User2 className="w-3.5 h-3.5 text-white" />
                </div>

                <div className="hidden md:flex flex-col leading-tight">
                  <span className="text-[10px] text-gray-500">
                    {user ? "Hello," : "Sign in"}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 truncate max-w-[80px]">
                    {user
                      ? (user.name?.split(" ")[0] || "Account")
                      : "Login"}
                  </span>
                </div>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/account?tab=cart"
              className="p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
            </Link>

          </div>
        </div>

        {/* ── Row 2: Mobile Search ── */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="flex w-full rounded-lg border border-gray-200 overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 bg-gray-50 focus-within:bg-white transition">

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 pl-4 pr-2 py-2.5 text-sm bg-transparent focus:outline-none"
              />

              <button
                type="submit"
                className="bg-orange-500 text-white px-4"
              >
                <Search className="w-4 h-4" />
              </button>

            </div>
          </form>
        </div>

      </div>
    </header>
  );
}
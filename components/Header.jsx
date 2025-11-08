"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, ShoppingCart, User, X, Check } from "lucide-react";
import CreateAndProfile from "./CreateAndProfile";

export default function Header({ user, open, setOpen, toggleRef }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPinPopover, setShowPinPopover] = useState(false);
  const [pincode, setPincode] = useState("110086");
  const [tempPincode, setTempPincode] = useState("110086");
  const router = useRouter();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (tempPincode.length === 6) {
      setPincode(tempPincode);
      setShowPinPopover(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white flex w-full fixed z-50 shadow-sm">
      {/* Hamburger icon */}
      {/* <div className="flex items-center" ref={toggleRef}>
        <HamburgerIcon open={open} setOpen={setOpen} />
      </div> */}

      {/* Navigation bar */}
      <div className="flex flex-grow items-center justify-between px-4 py-3 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <span className="flex items-center gap-2 font-bold text-lg tracking-wider text-orange-600">
            <img src="/logo.png" alt="logo" width={40} height={40} className="object-contain" />
            <div className="flex flex-col items-start text-orange-700">
              <span className="text-xl font-bold tracking-widest leading-tight">Amrita</span>
              <span className="text-[9px] leading-tight tracking-wide">Interior & Design</span>
            </div>
          </span>
        </Link>

        {/* Delivery Location Selector */}
        <div className="relative flex-shrink-0 mx-3">
          <button
            onClick={() => setShowPinPopover(!showPinPopover)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors group"
          >
            <MapPin className="w-4 h-4 text-orange-600" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-600">Deliver to</span>
              <span className="text-sm font-semibold text-gray-900">{pincode}</span>
            </div>
          </button>

          {/* Pincode Popover */}
          {showPinPopover && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setShowPinPopover(false)}
              />
              
              {/* Popover */}
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    Choose your location
                  </h3>
                  <button
                    onClick={() => setShowPinPopover(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-gray-600 mb-3">
                  Enter your pincode to check delivery availability
                </p>

                <form onSubmit={handlePincodeSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={tempPincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setTempPincode(value);
                      }}
                      placeholder="Enter 6-digit pincode"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                      maxLength={6}
                    />
                    {tempPincode.length === 6 && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={tempPincode.length !== 6}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-2 rounded-lg font-semibold text-sm transition-colors disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </form>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Current pincode: <span className="font-semibold text-gray-900">{pincode}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all text-sm placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* User Icon */}
          <CreateAndProfile user={user}/>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
            {/* Cart Badge - Uncomment when needed */}
            {/* <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              3
            </span> */}
          </Link>
        </div>
      </div>
    </header>
  );
}
// components/customer/ProductPageClient.js
"use client";

import { useState } from "react";
import { Share2, Phone, MessageCircle, Check, Copy } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetails from "./ProductDetails";
import TrustBadges from "./TrustBadges";
import CartButton from "./CartButton";
import { useAuth } from "@/app/providers/AuthProvider";

export default function ProductPageClient({
  product,
  variants,
  colorVariants,
  patternVariants,
}) {
  const [showCopied,       setShowCopied]       = useState(false);
  const [showNumberCopied, setShowNumberCopied] = useState(false);

  const { userRole } = useAuth();

  const phoneNumber  = "+916299811965";
  const isEnterprise = userRole === "enterprise";

  // ── Price resolution ────────────────────────────────────────────────────────
  const original   = isEnterprise ? product.enterprisePrice         : product.retailPrice;
  const discounted = isEnterprise ? product.enterpriseDiscountPrice  : product.retailDiscountPrice;
  const perSqFt    = isEnterprise ? product.perSqFtPriceEnterprise   : product.perSqFtPriceRetail;

  const hasDiscount = discounted && discounted < original;

  let primaryPrice;
  let secondaryPrice = null;

  if (product.showPerSqFtPrice) {
    primaryPrice = perSqFt;
    secondaryPrice = {
      discounted: discounted || original,
      original:   hasDiscount ? original : null,
      discountPercent: hasDiscount
        ? Math.round(((original - discounted) / original) * 100) : 0,
      savings: hasDiscount ? original - discounted : 0,
    };
  } else {
    primaryPrice = discounted || original;
    secondaryPrice = hasDiscount
      ? {
          original,
          discountPercent: Math.round(((original - discounted) / original) * 100),
          savings: original - discounted,
        }
      : null;
  }

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) { console.error("Failed to copy:", err); }
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setShowNumberCopied(true);
      setTimeout(() => setShowNumberCopied(false), 2000);
    } catch (err) { console.error("Failed to copy:", err); }
  };

  const handleWhatsApp = () => {
    const msg = `Hi, I'm interested in ${product.name}. Link: ${window.location.href}`;
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCall = () => { window.location.href = `tel:${phoneNumber}`; };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-1 sm:px-4 py-3 sm:py-4 ">

      {/* ── PRODUCT SECTION ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 sm:gap-6 mb-4 ">

        {/* LEFT: Image Gallery */}
        <div className="max-w-md w-full mx-auto sm:mx-0 ">
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col gap-3">

          {/* Brand & Share — slightly larger text for readability */}
          <div className="flex items-center justify-between">
            {product.brand && (
              <p className="text-gray-400 font-semibold text-[11px] uppercase tracking-widest">
                {product.brand}
              </p>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-gray-500 hover:text-orange-500
                         transition-colors text-[11px] font-medium ml-auto"
            >
              {showCopied
                ? <><Check className="w-3 h-3" /><span>Copied!</span></>
                : <><Share2 className="w-3 h-3" /><span>Share</span></>
              }
            </button>
          </div>

          {/* Product Name */}
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* ── PRICE BOX ── */}
          <div className="bg-orange-50 rounded-sm p-3 border border-orange-200">
            <div className="flex items-start justify-between gap-3">

              {/* Primary price */}
              <div>
                <span className="text-xl font-bold text-gray-900">
                  ₹{primaryPrice}
                  {product.showPerSqFtPrice && (
                    <span className="text-sm font-medium text-gray-600"> / SqFt</span>
                  )}
                </span>
                {secondaryPrice?.savings > 0 && (
                  <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                    Save ₹{secondaryPrice.savings}
                  </p>
                )}
              </div>

              {/* Secondary (original / unit) */}
              {secondaryPrice && (
                <div className="text-right">
                  {product.showPerSqFtPrice && (
                    <>
                      <span className="text-sm font-medium text-gray-700 block">
                        ₹{secondaryPrice.discounted} / {product.sellBy}
                      </span>
                      {secondaryPrice.original && (
                        <span className="text-xs text-gray-400 line-through block">
                          ₹{secondaryPrice.original} / {product.sellBy}
                        </span>
                      )}
                    </>
                  )}
                  {!product.showPerSqFtPrice && secondaryPrice.original && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{secondaryPrice.original}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {secondaryPrice?.discountPercent > 0 && (
                <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  {secondaryPrice.discountPercent}% OFF
                </span>
              )}
              {isEnterprise && (
                <span className="inline-block bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm">
                  Enterprise
                </span>
              )}
              <p className="text-[10px] text-gray-500">Incl. all taxes</p>
            </div>
          </div>

          {/* Color Variants */}
          {colorVariants?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Color</p>
              <div className="flex gap-2 flex-wrap">
                {colorVariants.map((c) => (
                  <a key={c._id} href={`/product/${c.slug}`} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 border border-gray-200 group-hover:border-orange-400 rounded-sm overflow-hidden transition-colors">
                      <img src={c.images?.[0]} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[9px] text-center text-gray-500 max-w-[40px] line-clamp-1">
                      {c.color || c.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Variants */}
          {patternVariants?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pattern</p>
              <div className="flex gap-2 flex-wrap">
                {patternVariants.map((p) => (
                  <a key={p._id} href={`/product/${p.slug}`} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 border border-gray-200 group-hover:border-orange-400 rounded-sm overflow-hidden transition-colors">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[9px] text-center text-gray-500 max-w-[40px] line-clamp-1">
                      {p.pattern?.[0] || p.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Featured badge */}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200
                             text-orange-700 text-[10px] font-semibold px-2 py-1 rounded-sm w-fit">
              ⭐ Featured
            </span>
          )}

          {/* ── CART BUTTON (50/50) ── */}
          <CartButton
            productId={product._id.toString()}
            stock={product.stock}
          />

          {/* Contact Buttons */}
          <div className="grid grid-cols-12 gap-1.5">
            <button
              onClick={handleWhatsApp}
              className="col-span-5 flex items-center justify-center gap-1.5
                         bg-green-600 hover:bg-green-700 text-white
                         px-2 py-2.5 rounded-sm font-semibold transition-colors text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={handleCall}
              className="col-span-5 flex items-center justify-center gap-1.5
                         bg-blue-600 hover:bg-blue-700 text-white
                         px-2 py-2.5 rounded-sm font-semibold transition-colors text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </button>
            <button
              onClick={handleCopyNumber}
              title="Copy phone number"
              className="col-span-2 flex items-center justify-center
                         bg-gray-600 hover:bg-gray-700 text-white
                         py-2.5 rounded-sm transition-colors"
            >
              {showNumberCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── DETAILS SECTION ── */}
      <ProductDetails product={product} />

      {/* ── TRUST BADGES ── */}
      <TrustBadges />

    </div>
  );
}
"use client";

import { useState } from "react";
import {
  Share2,
  Phone,
  MessageCircle,
  Check,
  Copy,
  ShoppingCart,
} from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import ProductVariants from "./ProductVariants";

export default function ProductPageClient({
  product,
  variants,
  colorVariants,
  patternVariants,
  userRole,
}) {
  const [showCopied, setShowCopied] = useState(false);
  const [showNumberCopied, setShowNumberCopied] = useState(false);

  const phoneNumber = "+916299811965";
  const isEnterprise = userRole === "enterprise";

    console.log(product)


  // -----------------------------
  // ✅ CLEAN PRICE LOGIC (final)
  // -----------------------------

  // Pick enterprise or retail fields
  const discounted = isEnterprise
    ? product.enterpriseDiscountPrice
    : product.retailDiscountPrice;

  const original = isEnterprise ? product.enterprisePrice : product.retailPrice;

  const perSqFt = isEnterprise
    ? product.perSqFtPriceEnterprise
    : product.perSqFtPriceRetail;

  // Check discount
  const hasDiscount = discounted && discounted < original;

  // Final structured values
  let primaryPrice;
  let secondaryPrice = null;

  // CASE A — show price per SqFt
  if (product.showPerSqFtPrice) {
    primaryPrice = perSqFt;

    secondaryPrice = {
      discounted: discounted || original,
      original: hasDiscount ? original : null,
      discountPercent: hasDiscount
        ? Math.round(((original - discounted) / original) * 100)
        : 0,
      savings: hasDiscount ? original - discounted : 0,
    };
  }
  // CASE B — normal price
  else {
    primaryPrice = discounted || original;

    secondaryPrice = hasDiscount
      ? {
          original,
          discountPercent: Math.round(
            ((original - discounted) / original) * 100
          ),
          savings: original - discounted,
        }
      : null;
  }

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setShowNumberCopied(true);
      setTimeout(() => setShowNumberCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in ${product.name}. Link: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Left: Image Gallery - Smaller */}
        <div className="max-w-md mx-auto w-full">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Right: Product Details */}
        <div className="space-y-3">
          {/* Brand & Share */}
          <div className="flex items-center justify-between">
            {product.brand && (
              <p className="text-neutral-500 font-semibold text-xs uppercase tracking-wide">
                {product.brand}
              </p>
            )}
            <button
              onClick={handleShare}
              className="relative flex items-center gap-1.5 text-gray-600 hover:text-orange-600 transition-colors text-xs font-medium"
            >
              {showCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Product Name */}
          <h1 className="text-xl md:text-xl font-semibold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* PRICE BOX */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            {/* MAIN ROW */}
            <div className="flex items-center justify-between">
              {/* LEFT SIDE — PRIMARY PRICE */}
              <div>
                {product.showPerSqFtPrice ? (
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{primaryPrice} / SqFt
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{primaryPrice} / {product.sellBy}
                  </span>
                )}

                {/* SAVINGS IF DISCOUNT EXISTS */}
                {secondaryPrice?.savings > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    You save ₹{secondaryPrice.savings}
                  </p>
                )}
              </div>

              {/* RIGHT SIDE — DISCOUNTED + ORIGINAL */}
              <div className="text-right">
                {/* Discounted per sellBy (only in perSqFt mode) */}
                {product.showPerSqFtPrice && (
                  <>
                    <span className="text-sm text-gray-900 font-medium block">
                      ₹{secondaryPrice.discounted} / {product.sellBy}
                    </span>

                    {/* Original if discount exists */}
                    {secondaryPrice.original && (
                      <span className="text-xs text-gray-400 line-through block">
                        ₹{secondaryPrice.original} / {product.sellBy}
                      </span>
                    )}
                  </>
                )}

                {/* Normal mode original price */}
                {!product.showPerSqFtPrice && secondaryPrice?.original && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{secondaryPrice.original} / {product.sellBy}
                  </span>
                )}
              </div>
            </div>

            {/* % OFF BELOW */}
            {secondaryPrice?.discountPercent > 0 && (
              <p className="text-xs text-green-600 font-semibold mt-1">
                {secondaryPrice.discountPercent}% OFF
              </p>
            )}

            {isEnterprise && (
              <p className="text-xs text-orange-600 mt-1 font-medium">
                ✓ Enterprise Price Applied
              </p>
            )}

            <p className="text-xs text-gray-600 mt-1">Inclusive of all taxes</p>
          </div>

          {colorVariants?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-600 mb-1">
                Color Variants
              </p>

              <div className="flex gap-2">
                {colorVariants.map((c) => (
                  <a
                    key={c._id}
                    href={`/product/${c.slug}`}
                    className="w-12 h-12 border rounded overflow-hidden hover:shadow transition-all"
                  >
                    <img
                      src={c.images?.[0]}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {patternVariants?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-600 mb-1">
                Pattern Variants
              </p>

              <div className="flex gap-2">
                {patternVariants.map((p) => (
                  <a
                    key={p._id}
                    href={`/product/${p.slug}`}
                    className="w-12 h-12 border rounded overflow-hidden hover:shadow transition-all"
                  >
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>

          {/* Order Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-lg font-semibold transition-colors text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-semibold transition-colors text-xs"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button
              onClick={handleCopyNumber}
              className="relative flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white p-2.5 rounded-lg transition-colors"
              title="Copy Number"
            >
              {showNumberCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Product Attributes */}
          <div className="grid grid-cols-2 gap-2 bg-white rounded-lg p-3 border border-gray-200">
            {product.color && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Color</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.color}
                </p>
              </div>
            )}
            {product.size && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Size</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.size}
                </p>
              </div>
            )}
            {product.thickness && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Thickness</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.thickness}mm
                </p>
              </div>
            )}
            {product.material?.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Material</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.material.join(", ")}
                </p>
              </div>
            )}

            {product.pattern?.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Pattern</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.pattern.join(", ")}
                </p>
              </div>
            )}

            {product.finish?.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Finish</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.finish.join(", ")}
                </p>
              </div>
            )}

            {product.coverageArea && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Coverage Area</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.coverageArea}
                </p>
              </div>
            )}

            {product.application?.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Application</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.application.join(", ")}
                </p>
              </div>
            )}

            {product.stock !== undefined && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Stock</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.stock > 0
                    ? `${product.stock} Available`
                    : "Out of Stock"}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                Product Description
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5">
              <p className="text-orange-700 font-medium flex items-center gap-2 text-xs">
                <span>⭐</span>
                Featured Product
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Variants Section */}
      {variants && variants.length > 0 && (
        <div className="mt-6">
          <ProductVariants variants={variants} currentSlug={product.slug} />
        </div>
      )}
    </div>
  );
}

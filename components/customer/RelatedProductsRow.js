// components/customer/RelatedProductsRow.jsx
"use client";

import ScrollRow      from "@/components/ui/ScrollRow";
import ProductCardGrid from "@/components/customer/ProductCardGrid";
import { useAuth }    from "@/app/providers/AuthProvider";

export default function RelatedProductsRow({ title, products = [] }) {
  const { userRole } = useAuth();

  if (!products.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 px-1">
        {title}
      </h3>

      {/* Reuse the same ScrollRow primitive from the homepage */}
      <ScrollRow scrollAmount={280}>
        {products.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-[48%] sm:w-[38%] md:w-[26%] lg:w-[20%]"
          >
            <ProductCardGrid product={product} userRole={userRole} />
          </div>
        ))}
      </ScrollRow>

    </section>
  );
}
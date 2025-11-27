// components/customer/RelatedProductsRow.jsx

import Link from "next/link";
import ProductCardGrid from "@/components/customer/ProductCardGrid"; // adjust path if your card lives elsewhere

export default function RelatedProductsRow({ title, products = [], userRole }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-8">
      {/* Title Row */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {title}
        </h3>

        {/* Optional: view more link (disabled for now, can be added later) */}
        {/* <Link href="/" className="text-sm text-gray-600 hover:underline">View all</Link> */}
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-hide -mx-1 py-1">
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className=""
            >
              <ProductCardGrid product={product} userRole={userRole} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

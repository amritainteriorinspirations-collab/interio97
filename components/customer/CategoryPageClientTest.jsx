"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import ProductCardGrid from "./ProductCardGrid";

export default function CategoryPageClientTest({
  products,
  initialUserRole = "user",
  headerContent,
}) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);

  // NEW: client-side userRole state; starts with initialUserRole then replaced by real one if available
  const [userRole, setUserRole] = useState(initialUserRole);

  // Fetch user profile client-side after mount to personalize pricing & header
  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include", // ensure cookies are sent if needed
          cache: "no-cache",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json?.user?.role) {
          setUserRole(json.user.role);
        }
      } catch (err) {
        // silent fail: keep default role "user"
        console.debug("Could not fetch user profile (client)", err);
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFilterChange = (filters, sortBy) => {
    let result = [...products];

    const getPrice = (p) =>
      userRole === "enterprise"
        ? p.enterpriseDiscountPrice || p.enterprisePrice
        : p.retailDiscountPrice || p.retailPrice;

    // Price
    result = result.filter((p) => {
      const price = getPrice(p);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    if (filters.colors.length)
      result = result.filter((p) => filters.colors.includes(p.color));
    if (filters.sizes.length)
      result = result.filter((p) => filters.sizes.includes(p.size));
    if (filters.thicknesses.length)
      result = result.filter((p) => filters.thicknesses.includes(p.thickness));
    if (filters.brands.length)
      result = result.filter((p) => filters.brands.includes(p.brand));

    if (filters.inStockOnly) result = result.filter((p) => p.stock > 0);

    if (filters.materials?.length)
      result = result.filter((p) =>
        p.material?.some((m) => filters.materials.includes(m))
      );

    if (filters.patterns?.length)
      result = result.filter((p) =>
        p.pattern?.some((m) => filters.patterns.includes(m))
      );

    if (filters.finishes?.length)
      result = result.filter((p) =>
        p.finish?.some((f) => filters.finishes.includes(f))
      );

    // FIXED: application filtering uses slug
    if (filters.applications?.length)
      result = result.filter((p) =>
        p.application?.some((a) => filters.applications.includes(a.slug))
      );

    // Sorting
    result.sort((a, b) => {
      const priceA = getPrice(a);
      const priceB = getPrice(b);
      switch (sortBy) {
        case "priceLowHigh":
          return priceA - priceB;
        case "priceHighLow":
          return priceB - priceA;
        case "nameAZ":
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredProducts(result);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
      {/* LEFT SIDEBAR */}
      <aside className="sm:col-span-4 md:col-span-3 col-span-12">
        {/* Mobile Toggle Button */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 rounded-md
             px-4 py-3 text-sm font-semibold text-gray-700 hover:border-orange-300  transition-all duration-200 shadow-sm"
          >
            {showFilters ? (
              <>
                <X className="w-4 h-4" /> Hide Filters
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-4 h-4" /> Filters (
                {filteredProducts.length})
              </>
            )}
          </button>
        </div>

        {/* Sidebar content */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } sm:block sm:sticky sm:top-24`}
        >
          <FilterSidebar
            products={products}
            onFilterChange={handleFilterChange}
            userRole={userRole}
          />
        </div>
      </aside>

      {/* RIGHT SIDE (HEADER + PRODUCT LIST) */}
      <main className="sm:col-span-8 md:col-span-9 col-span-12">
        {/* Injected Category Header */}
        {headerContent}

        {/* Client-side enterprise label (rendered after we know userRole) */}
        {userRole === "enterprise" && (
          <div className="mb-3">
            <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-sm font-semibold">
              Enterprise Pricing Active
            </span>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 mt-2">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {products.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-md border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {filteredProducts.map((product, index) => (
              <ProductCardGrid
                key={product.id || index}
                product={product}
                userRole={userRole}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

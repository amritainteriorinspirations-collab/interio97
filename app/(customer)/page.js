// app/(customer)/page.js
export const revalidate = 1800; // 30-minute ISR

import { Suspense } from "react";

import HeroSection               from "@/components/HomePage/HeroSection";
import PopularCategoriesSection  from "@/components/HomePage/PopularCategoriesSection";
import ProductByApplicationSection from "@/components/HomePage/ProductByApplicationSection";
import GetInspiredCarousel       from "@/components/customer/GetInspiredCarousel";
import TrendingCollections       from "@/components/customer/TrendingCollections";
import PopularProducts           from "@/components/customer/PopularProducts";

import { getTrendingCategories }    from "@/lib/fetchers/serverCategories";
import { getInspiredCarousel }      from "@/lib/fetchers/inspiredCarousel";
import { getProductsByApplication } from "@/lib/fetchers/productsByApplication";
import { getPopularProducts }       from "@/lib/fetchers/serverProducts";

export default async function HomePage() {
  // All data fetches run in parallel
  const [
    { applications, map },
    carousel,
    trendingCategories,
    popularProducts,
  ] = await Promise.all([
    getProductsByApplication(),
    getInspiredCarousel(),
    getTrendingCategories(),
    getPopularProducts(),
  ]);

  return (
    <div className="bg-white space-y-4">

      {/* Hero — flush, no padding (fills edge-to-edge) */}
      <div className="-mt-8 -mx-3">
        <HeroSection />
      </div>

      {/* Popular Categories */}
      <Suspense fallback={<SectionSkeleton />}>
        <PopularCategoriesSection />
      </Suspense>

      {/* Products by Application */}
      <Suspense fallback={<SectionSkeleton />}>
        <ProductByApplicationSection applications={applications} map={map} />
      </Suspense>

      {/* Inspiration Carousel */}
      {carousel?.isActive && carousel.slides?.length > 0 && (
        <Suspense fallback={<SectionSkeleton />}>
          <GetInspiredCarousel
            slides={carousel.slides}
            autoplayMs={carousel.autoplayMs}
            title={carousel.title}
          />
        </Suspense>
      )}

      {/* Trending Collections */}
      {trendingCategories.length > 0 && (
        <Suspense fallback={<SectionSkeleton />}>
          <TrendingCollections categories={trendingCategories} />
        </Suspense>
      )}

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <Suspense fallback={<SectionSkeleton />}>
          <PopularProducts products={popularProducts} />
        </Suspense>
      )}

    </div>
  );
}

// ── Shared loading skeleton ──────────────────────────────────────────────────
// Used by every Suspense boundary above.
// Matches the visual weight of a typical section so layout doesn't jump.
function SectionSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Heading placeholder */}
      <div className="flex flex-col items-center gap-2 mb-10">
        <div className="h-7 w-64 bg-gray-200 rounded-md" />
        <div className="h-4 w-40 bg-gray-100 rounded-md" />
      </div>
      {/* Card grid placeholder */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
import GetInspiredCarousel from "@/components/customer/GetInspiredCarousel";
import PopularProducts from "@/components/customer/PopularProducts";
import TrendingCollections from "@/components/customer/TrendingCollections";
import PopularCategoriesSection from "@/components/HomePage/PopularCategoriesSection";
import ProductByApplicationSection from "@/components/HomePage/ProductByApplicationSection";

import {
  getAllCategories,
  getTrendingCategories,
} from "@/lib/fetchers/serverCategories";

import { getInspiredCarousel } from "@/lib/fetchers/inspiredCarousel";
import { getProductsByApplication } from "@/lib/fetchers/productsByApplication";
import { getPopularProducts } from "@/lib/fetchers/serverProducts";
import HeroSection from "@/components/HomePage/HeroSection";

export default async function HomePage() {
  const categories = await getAllCategories();
  const { applications, map } = await getProductsByApplication();
  const carousel = await getInspiredCarousel();
  const trendingCategories = await getTrendingCategories();
  const popularProducts = await getPopularProducts();

  return (
    <div className="bg-white ">
      {/* --------- Hero Section --------- */}
      <div className="-mt-8 -mx-3 ">
      <HeroSection />
      </div>

      {/* --------- Popular Categories --------- */}
      <div className="pt-8 pb-10">
        <PopularCategoriesSection categories={categories} />
      </div>

      {/* --------- Products by Application --------- */}
      <div className="pt-4 pb-16">
        <ProductByApplicationSection applications={applications} map={map} />
      </div>

      {/* --------- Inspiration Carousel --------- */}
      {carousel?.isActive && carousel.slides?.length > 0 && (
        <div className="pt-4 pb-16">
          <GetInspiredCarousel
            slides={carousel.slides}
            autoplayMs={carousel.autoplayMs}
            title={carousel.title}
          />
        </div>
      )}

      {/* --------- Trending Collections --------- */}
      {trendingCategories.length > 0 && (
        <div className="pt-4 pb-16">
          <TrendingCollections categories={trendingCategories} />
        </div>
      )}

      {/* --------- Popular Products --------- */}
      {popularProducts.length > 0 && (
        <div className="pt-4 pb-16">
          <PopularProducts products={popularProducts} />
        </div>
      )}

    </div>
  );
}

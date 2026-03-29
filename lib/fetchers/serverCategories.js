// lib/fetchers/serverCategories.js
//
// ── CRITICAL FIX ─────────────────────────────────────────────────────────
// The previous PRODUCT_CARD_FIELDS .select() was too narrow.
// It only selected pricing + display fields — but FilterSidebar needs:
//   color, size, thickness, brand, stock (for filter options + availability)
//   material[], pattern[], finish[], application[] (for filter accordions)
//
// Without these fields, every filter accordion on category/search pages
// would be empty — users couldn't filter by material, pattern, finish etc.
//
// Added all filter-required fields to the select string.
// Still excludes: description, variantGroupId, coverageArea, timestamps
// — fields neither the card display NOR the filter sidebar ever uses.
// ─────────────────────────────────────────────────────────────────────────

import DbConnect from "@/lib/Db/DbConnect";
import Category  from "@/models/category";
import Product   from "@/models/product";

// Fields required by ProductCardGrid (display + pricing)
// AND FilterSidebar (filter options + availability)
const PRODUCT_LIST_FIELDS =
  // Display + pricing (ProductCardGrid)
  "name slug images brand isFeatured " +
  "retailPrice retailDiscountPrice " +
  "enterprisePrice enterpriseDiscountPrice " +
  "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise " +
  // Filter sidebar fields (FilterSidebar useMemo calculations)
  "color size thickness stock " +
  "material pattern finish " +
  "application category";
  // Excluded (not needed by card or filters):
  // description, variantGroupId, colorVariant, patternVariant,
  // coverageArea, tags, sku, createdAt, updatedAt

export async function getAllCategories() {
  await DbConnect();
  try {
    const data = await Category.find()
      .select("name slug image description isTrending trendingTagline")
      .lean();
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  await DbConnect();
  try {
    // Special case: /category/all
    if (slug === "all") {
      const products = await Product.find()
        .select(PRODUCT_LIST_FIELDS)
        .populate("application", "name slug")
        .lean();
      return {
        category: {
          _id: "all",
          name: "All Products",
          slug: "all",
          image: null,
          description: "Browse all products across all categories.",
        },
        products: JSON.parse(JSON.stringify(products)),
      };
    }

    const category = await Category.findOne({ slug }).lean();
    if (!category) return null;

    const products = await Product.find({ category: category._id })
      .select(PRODUCT_LIST_FIELDS)
      .populate("application", "name slug") // FilterSidebar needs app slug for filter
      .lean();

    return JSON.parse(JSON.stringify({ category, products }));
  } catch (err) {
    console.error("Error fetching category:", err);
    return null;
  }
}

export async function getTrendingCategories(limit = 10) {
  await DbConnect();
  try {
    const data = await Category.find({ isTrending: true })
      .select("name slug image trendingTagline")
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.error("Error fetching trending categories:", err);
    return [];
  }
}

export async function getOnlyCategoryBySlug(slug) {
  await DbConnect();
  try {
    const category = await Category.findOne({ slug }).lean();
    if (!category) return null;
    return JSON.parse(JSON.stringify(category));
  } catch (err) {
    console.error("Error fetching admin category:", err);
    return null;
  }
}
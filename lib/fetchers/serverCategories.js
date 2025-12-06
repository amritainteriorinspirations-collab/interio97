import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";
import Product from "@/models/product";

/**
 * PURE SERVER-SIDE FETCHER
 * Get all categories (SSR only)
 */
export async function getAllCategories() {
  await DbConnect();

  try {
    const data = await Category.find()
      .select("name slug image description isTrending trendingTagline")
      .lean();

    const categories = JSON.parse(JSON.stringify(data));

    return categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

/**
 * PURE SERVER-SIDE FETCHER
 * Get single category with its products
 */
export async function getCategoryBySlug(slug) {
  await DbConnect();

  try {
    const category = await Category.findOne({ slug }).lean();
    if (!category) return null;

    const products = await Product.find({ category: category._id })
      .lean();

    const res = JSON.parse(JSON.stringify({ category, products }));
    return res;
  } catch (err) {
    console.error("Error fetching category:", err);
    return null;
  }
}

/**
 * PURE SERVER-SIDE FETCHER
 * Trending categories
 */
export async function getTrendingCategories(limit = 10) {
  await DbConnect();

  try {
    const data = await Category.find({ isTrending: true })
      .select("name slug image trendingTagline")
      .limit(limit)
      .lean();
      
    const categories = JSON.parse(JSON.stringify(data));
    return categories;
  } catch (err) {
    console.error("Error fetching trending categories:", err);
    return [];
  }
}


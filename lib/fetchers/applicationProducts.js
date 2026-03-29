// lib/fetchers/applicationProducts.js — renamed from applications.js
// (check your import paths if the filename differs in your project)

import DbConnect    from "@/lib/Db/DbConnect";
import Application  from "@/models/application";
import Product      from "@/models/product";

// Fields needed by ProductCardGrid — same constant as serverCategories.js
// Keeps DB transfer minimal: drops description, variantRefs, timestamps etc.
const PRODUCT_CARD_FIELDS =
  "name slug images brand isFeatured " +
  "retailPrice retailDiscountPrice " +
  "enterprisePrice enterpriseDiscountPrice " +
  "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise";

export async function getApplicationBySlug(slug) {
  await DbConnect();

  const application = await Application.findOne({ slug }).lean();
  if (!application) return null;

  const products = await Product.find({ application: application._id })
    .select(PRODUCT_CARD_FIELDS)          // ← ADDED: was fetching all fields
    .populate("application", "name slug") // still populate for filter sidebar
    .lean();

  return JSON.parse(JSON.stringify({ application, products }));
}

export async function getAllApplications() {
  await DbConnect();
  try {
    const apps = await Application.find({}, "slug name").lean();
    return JSON.parse(JSON.stringify(apps));
  } catch {
    return [];
  }
}
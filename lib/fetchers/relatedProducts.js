// lib/fetchers/relatedProducts.js
import mongoose from "mongoose";
import DbConnect from "@/lib/Db/DbConnect"; // adjust if your helper name/path differs
import Product from "@/models/product";

/** Normalize various id shapes into a mongoose ObjectId instance.
 * Accepts:
 *  - string (hex) -> returns new ObjectId(string)
 *  - plain object with _id (populated doc) -> extracts _id, convert if needed
 *  - already a mongoose ObjectId -> returns as-is
 */
function normalizeToObjectId(val) {
  if (val == null) return null;

  // If it's a populated doc: { _id: "...", ... }
  if (typeof val === "object" && val._id) {
    val = val._id;
  }

  // If it's now a string, convert to ObjectId using `new`
  if (typeof val === "string") {
    return new mongoose.Types.ObjectId(val);
  }

  // If it's already an ObjectId (mongoose/bson) return it
  if (val instanceof mongoose.Types.ObjectId) {
    return val;
  }

  // If it's a plain object that looks like { "$oid": "..." } (some serializers)
  if (typeof val === "object" && val.$oid) {
    return new mongoose.Types.ObjectId(val.$oid);
  }

  throw new Error("Invalid id value for ObjectId conversion: " + JSON.stringify(val));
}

/**
 * Get products that share colorVariant OR patternVariant with the given product
 */
export async function getRelatedByCollection({
  productId,
  colorVariantIds = [],
  patternVariantIds = [],
  limit = 8,
} = {}) {
  if (!productId) throw new Error("productId is required");

  // Normalize productId first
  const normalizedProductId =
    typeof productId === "string"
      ? new mongoose.Types.ObjectId(productId)
      : productId instanceof mongoose.Types.ObjectId
      ? productId
      : typeof productId === "object" && productId._id
      ? new mongoose.Types.ObjectId(productId._id)
      : (() => { throw new Error("Invalid productId passed to getRelatedByCollection"); })();

  // Nothing to search
  if (
    (!Array.isArray(colorVariantIds) || colorVariantIds.length === 0) &&
    (!Array.isArray(patternVariantIds) || patternVariantIds.length === 0)
  ) {
    return [];
  }

  await DbConnect();

  const orClauses = [];

  if (Array.isArray(colorVariantIds) && colorVariantIds.length) {
    const ids = colorVariantIds
      .map((id) => normalizeToObjectId(id))
      .filter(Boolean);
    if (ids.length) orClauses.push({ colorVariant: { $in: ids } });
  }

  if (Array.isArray(patternVariantIds) && patternVariantIds.length) {
    const ids = patternVariantIds
      .map((id) => normalizeToObjectId(id))
      .filter(Boolean);
    if (ids.length) orClauses.push({ patternVariant: { $in: ids } });
  }

  if (orClauses.length === 0) return [];

  const products = await Product.find({
    $and: [{ _id: { $ne: normalizedProductId } }, { $or: orClauses }],
  })
    .limit(limit)
    .select(
      "_id name slug images retailPrice retailDiscountPrice enterprisePrice enterpriseDiscountPrice isFeatured"
    )
    .lean();

  return products || [];
}

/**
 * Get products by category
 */
export async function getRelatedByCategory({ categoryId, productId, limit = 12 } = {}) {
  if (!categoryId) return [];

  await DbConnect();

  const normalizedProductId =
    productId && typeof productId === "string"
      ? new mongoose.Types.ObjectId(productId)
      : productId instanceof mongoose.Types.ObjectId
      ? productId
      : productId && productId._id
      ? new mongoose.Types.ObjectId(productId._id)
      : null;

  const query = {
    category: new mongoose.Types.ObjectId(categoryId),
  };
  if (normalizedProductId) query._id = { $ne: normalizedProductId };

  const products = await Product.find(query)
    .limit(limit)
    .select(
      "_id name slug images retailPrice retailDiscountPrice enterprisePrice enterpriseDiscountPrice isFeatured"
    )
    .lean();

  return products || [];
}

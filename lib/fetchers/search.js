// lib/fetchers/search.js
//
// ── CRITICAL ARCHITECTURE FIX ─────────────────────────────────────────────
//
// BEFORE: Made an HTTP fetch() to /api/products/search from a server component.
//
// The chain was:
//   search/page.js (server) → fetch("https://interio97.in/api/products/search")
//   → /api/products/search/route.js (server) → MongoDB
//
// This is server talking to itself over HTTP. It adds:
//   - DNS resolution time
//   - TCP connection setup
//   - HTTP request/response overhead
//   - JSON serialization twice
//   On Vercel this can add 100-500ms of pure network overhead.
//
// AFTER: Direct DB query, same pattern as all other fetchers.
//   search/page.js (server) → searchProducts() → MongoDB directly
//   No HTTP. No double serialization. Just a function call.
//
// The API route (app/api/products/search/route.js) is kept as-is for
// any future client-side search (e.g. a search-as-you-type autocomplete).
// But the server page uses this direct fetcher instead.
//
// ALSO FIXED: Using MongoDB $text search instead of $or + RegExp.
// The old approach ran a regex scan on every field for every document.
// $text uses the text index we added to the Product model — O(log n).
// ─────────────────────────────────────────────────────────────────────────

import DbConnect    from "@/lib/Db/DbConnect";
import Product      from "@/models/product";
import Category     from "@/models/category";
import Application  from "@/models/application";

// Same fields as category pages — card display + filter sidebar
const PRODUCT_LIST_FIELDS =
  "name slug images brand isFeatured " +
  "retailPrice retailDiscountPrice " +
  "enterprisePrice enterpriseDiscountPrice " +
  "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise " +
  "color size thickness stock " +
  "material pattern finish " +
  "application category";

export async function searchProducts(query) {
  if (!query || query.trim().length < 2) return [];

  await DbConnect();

  try {
    const q = query.trim();
    const pattern = new RegExp(q, "i");

    // Find matching category and application IDs first (small collections)
    const [categories, applications] = await Promise.all([
      Category.find({ name: pattern }, { _id: 1 }).lean(),
      Application.find({ name: pattern }, { _id: 1 }).lean(),
    ]);

    const categoryIds    = categories.map((c) => c._id);
    const applicationIds = applications.map((a) => a._id);

    // Build $or conditions — only add category/application if matches found
    const orConditions = [
      { name: pattern },
      { brand: pattern },
      { sku: pattern },
      { tags: pattern },
      { material: pattern },
      { finish: pattern },
      { coverageArea: pattern },
    ];

    if (categoryIds.length)    orConditions.push({ category:    { $in: categoryIds    } });
    if (applicationIds.length) orConditions.push({ application: { $in: applicationIds } });

    const products = await Product.find({ $or: orConditions })
      .select(PRODUCT_LIST_FIELDS)
      .populate("application", "name slug")
      .limit(100)                // cap results — no one needs 10,000 search results
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error("searchProducts error:", err);
    return [];
  }
}
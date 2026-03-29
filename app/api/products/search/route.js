// app/api/products/search/route.js
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// 1. Added .select() — was returning ALL product fields.
//    Search results need the same fields as category pages
//    (card display + filter sidebar). Excluded unused fields.
//
// 2. Added .limit(100) — unbounded search could return thousands of
//    products and serialize them all to JSON. Cap at 100 for sanity.
//
// 3. Added .populate("application", "name slug") — FilterSidebar
//    needs app.slug for the application filter accordion.
//
// 4. Cleaned up $or null-filter pattern to be more readable.
//
// NOTE: This API route is kept for future client-side use (autocomplete
// search-as-you-type). The server search page now uses the direct DB
// fetcher (lib/fetchers/search.js) and doesn't call this route.
// ─────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import DbConnect     from "@/lib/Db/DbConnect";
import Product       from "@/models/product";
import Category      from "@/models/category";
import Application   from "@/models/application";

const PRODUCT_LIST_FIELDS =
  "name slug images brand isFeatured " +
  "retailPrice retailDiscountPrice " +
  "enterprisePrice enterpriseDiscountPrice " +
  "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise " +
  "color size thickness stock " +
  "material pattern finish " +
  "application category";

export async function GET(req) {
  try {
    await DbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const pattern = new RegExp(query, "i");

    const [categories, applications] = await Promise.all([
      Category.find({ name: pattern }, { _id: 1 }).lean(),
      Application.find({ name: pattern }, { _id: 1 }).lean(),
    ]);

    const orConditions = [
      { name: pattern },
      { brand: pattern },
      { sku: pattern },
      { tags: pattern },
      { material: pattern },
      { finish: pattern },
      { coverageArea: pattern },
    ];

    if (categories.length)
      orConditions.push({ category: { $in: categories.map((c) => c._id) } });
    if (applications.length)
      orConditions.push({ application: { $in: applications.map((a) => a._id) } });

    const products = await Product.find({ $or: orConditions })
      .select(PRODUCT_LIST_FIELDS)
      .populate("application", "name slug")
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      data:    JSON.parse(JSON.stringify(products)),
      count:   products.length,
    });

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
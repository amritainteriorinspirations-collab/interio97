// app/api/products/search/route.js

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import Category from "@/models/category";
import Application from "@/models/application";

export async function GET(req) {
  try {
    await DbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const pattern = new RegExp(query.trim(), "i");

    // 1️⃣ Match Categories
    const categories = await Category.find({ name: pattern }, { _id: 1 });

    // 2️⃣ Match Applications
    const applications = await Application.find({ name: pattern }, { _id: 1 });

    const categoryIds = categories.map((c) => c._id);
    const applicationIds = applications.map((a) => a._id);

    const products = await Product.find({
      $or: [
        { name: pattern },
        { description: pattern },
        { brand: pattern },
        { sku: pattern },
        { tags: pattern },

        { material: pattern },
        { pattern: pattern },
        { finish: pattern },
        { coverageArea: pattern },

        // Category search
        categoryIds.length > 0
          ? { category: { $in: categoryIds } }
          : null,

        // Application search
        applicationIds.length > 0
          ? { application: { $in: applicationIds } }
          : null,
      ].filter(Boolean),
    })
      .populate("category")
      .populate("application");

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

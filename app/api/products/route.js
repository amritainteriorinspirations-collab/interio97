//  app/api/products/route.js

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import Category from "@/models/category";
import Application from "@/models/application";

export async function POST(req) {
  try {
    await DbConnect();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await DbConnect();
    const { searchParams } = new URL(req.url);
    
    const query = {};

    // CATEGORY — match via slug → ObjectId
    if (searchParams.get("category")) {
      const cat = await Category.findOne({ slug: searchParams.get("category") });
      if (cat) query.category = cat._id;
      else return NextResponse.json({ success: true, data: [] });
    }

    // APPLICATION — match via slug → ObjectId
    if (searchParams.get("application")) {
      const app = await Application.findOne({ slug: searchParams.get("application") });
      if (app) query.application = app._id;
      else return NextResponse.json({ success: true, data: [] });
    }

    // Existing attribute filters
    if (searchParams.get("color")) query.color = searchParams.get("color");
    if (searchParams.get("size")) query.size = searchParams.get("size");
    if (searchParams.get("thickness")) query.thickness = searchParams.get("thickness");

    if (searchParams.get("material")) query.material = searchParams.get("material");
    if (searchParams.get("pattern")) query.pattern = searchParams.get("pattern");
    if (searchParams.get("finish")) query.finish = searchParams.get("finish");

    // Optional price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate("category")
      .populate("application")
      .populate("colorVariant")
      .populate("patternVariant"); // important

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

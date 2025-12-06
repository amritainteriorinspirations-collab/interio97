// app/api/inspired-carousel/route.js
import DbConnect from "@/lib/Db/DbConnect";
import InspiredCarousel from "@/models/inspiredCarousel";
import { NextResponse } from "next/server";

export async function GET() {
  await DbConnect();
  const doc = await InspiredCarousel.findOne().lean();
  return NextResponse.json(doc || null);
}

export async function PUT(req) {
  await DbConnect();
  const body = await req.json();

  // body: { title, slides: [{url, caption}], isActive, autoplayMs }
  if (!body || !Array.isArray(body.slides)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // upsert: update existing or create new
  const updated = await InspiredCarousel.findOneAndUpdate(
    {},
    {
      title: body.title || "Get Inspired By Design",
      slides: body.slides,
      isActive: !!body.isActive,
      autoplayMs: body.autoplayMs || 4000,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return NextResponse.json(updated);
}

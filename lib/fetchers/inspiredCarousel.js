// lib/fetchers/inspiredCarousel.js
import DbConnect from "@/lib/Db/DbConnect";
import InspiredCarousel from "@/models/inspiredCarousel";

export async function getInspiredCarousel() {
  await DbConnect();

  // We will treat a single document as source-of-truth — return the latest (or create empty).
  let doc = await InspiredCarousel.findOne().lean();
  if (!doc) {
    // Return a minimal default shape so frontend doesn't crash
    return {
      title: "Get Inspired By Design",
      slides: [],
      isActive: false,
      autoplayMs: 4000,
    };
  }
  return JSON.parse(JSON.stringify(doc));
}

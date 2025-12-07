// lib/serversideFetchers.js/patternVariants.js

import DbConnect from "@/lib/Db/DbConnect";
import PatternVariant from "@/models/patternVariant";

/**
 * Get all pattern variants
 */
export async function getAllPatternVariantsServer() {
  await DbConnect();

  try {
    const docs = await PatternVariant.find().lean();
    return JSON.parse(JSON.stringify(docs));
  } catch (err) {
    console.error("Error fetching pattern variants:", err);
    return [];
  }
}

/**
 * Get one pattern variant by ID
 */
export async function getPatternVariantByIdServer(id) {
  await DbConnect();

  try {
    const doc = await PatternVariant.findById(id).lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  } catch (err) {
    console.error("Error fetching pattern variant:", err);
    return null;
  }
}

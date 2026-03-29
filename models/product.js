// models/product.js — final version with all indexes + text search index
//
// ── TEXT INDEX FOR SEARCH ─────────────────────────────────────────────────
// The search route was doing RegExp scans across 8+ fields for every query.
// A MongoDB text index pre-builds a search structure across all indexed fields.
// Query goes from O(n * fields) full scans → O(log n) index lookup.
//
// $text search also supports:
//   - Stemming ("flooring" matches "floor", "floors")
//   - Stop words ("the", "a", "in" are ignored automatically)
//   - Word-boundary matching (not substring — avoids false positives)
//
// weights: higher weight = this field matters more in relevance scoring.
// name=10 means a name match ranks higher than a tag match (weight=2).
// ─────────────────────────────────────────────────────────────────────────

import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name:  { type: String, required: true },
    slug:  { type: String, unique: true, required: true },
    sku:   { type: String, unique: true },

    category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],

    description: String,
    brand:       String,
    images:      [String],

    retailPrice:             { type: Number, required: true },
    retailDiscountPrice:     Number,
    enterprisePrice:         { type: Number, required: true },
    enterpriseDiscountPrice: Number,
    stock:                   { type: Number, default: 0 },

    color:     String,
    thickness: Number,
    size:      String,

    variantGroupId: { type: String, index: true },

    colorVariant: {
      type: Schema.Types.ObjectId, ref: "ColorVariant",
      default: null, index: true,
    },
    patternVariant: {
      type: Schema.Types.ObjectId, ref: "PatternVariant",
      default: null, index: true,
    },

    tags:       [String],
    isFeatured: { type: Boolean, default: false },
    isPopular:  { type: Boolean, default: false, index: true },

    sellBy: { type: String, enum: ["piece", "box", "roll"], default: "piece" },

    showPerSqFtPrice:       { type: Boolean, default: false },
    perSqFtPriceRetail:     { type: Number, default: null },
    perSqFtPriceEnterprise: { type: Number, default: null },

    material:    [String],
    pattern:     [String],
    finish:      [String],

    application: [{ type: Schema.Types.ObjectId, ref: "Application", index: true }],

    coverageArea: String,
  },
  { timestamps: true }
);

// ── Query indexes ─────────────────────────────────────────────────────────
ProductSchema.index({ category:    1 });  // getCategoryBySlug()
ProductSchema.index({ application: 1 });  // getApplicationBySlug()
ProductSchema.index({ colorVariant: 1, patternVariant: 1 }); // related products

// ── Full-text search index ────────────────────────────────────────────────
// Powers searchProducts() — replaces slow RegExp full-collection scans.
// weights control relevance ranking: name match > brand > tags > description
//
// TO CREATE IN ATLAS (do this once after deploy):
//   Collection: products
//   Index type: text
//   Fields: name(10), brand(8), tags(5), sku(5), description(3), material(3), finish(3)
//
// OR let Mongoose create it automatically on next server start
// (may be slow on large collections — prefer Atlas UI for production)
ProductSchema.index(
  {
    name:        "text",
    brand:       "text",
    tags:        "text",
    sku:         "text",
    description: "text",
    material:    "text",
    finish:      "text",
  },
  {
    weights: {
      name:        10,
      brand:       8,
      sku:         5,
      tags:        5,
      material:    3,
      finish:      3,
      description: 2,
    },
    name: "product_text_search", // named index for easy management in Atlas
  }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
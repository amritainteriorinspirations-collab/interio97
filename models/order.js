// models/order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productSnapshot: {
      name:     String,
      sku:      String,
      image:    String,
      category: [mongoose.Schema.Types.ObjectId],
    },

    quantity: { type: Number, required: true, min: 1 },

    sellBy: {
      type: String,
      enum: ["piece", "box", "roll"],
      required: true,
    },

    // Mirrors the per-item pricing shape from cartPricing.js
    pricingSnapshot: {
      unitOriginalPrice: { type: Number, required: true }, // MRP per unit
      unitFinalPrice:    { type: Number, required: true }, // after-discount per unit
      discountPerUnit:   { type: Number, required: true }, // rupees saved per unit
      discountPercent:   { type: Number, required: true }, // % off (0 if none)
      lineOriginalTotal: { type: Number, required: true }, // unitOriginalPrice × qty
      lineFinalTotal:    { type: Number, required: true }, // unitFinalPrice × qty
    },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    name:         String,
    phone:        String,
    addressLine1: String,
    addressLine2: String,
    city:         String,
    state:        String,
    pincode:      String,
    country:      String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    roleSnapshot: {
      type: String,
      enum: ["user", "enterprise", "admin"],
      required: true,
    },

    orderNumber: { type: String, unique: true, index: true },

    items: { type: [orderItemSchema], required: true },

    addressSnapshot: { type: addressSnapshotSchema, required: true },

    // Canonical totals shape — mirrors cartPricing.js buildTotals()
    totals: {
      mrp:            Number, // market price total before discounts
      discount:       Number, // total rupees saved  (mrp - subtotal)
      subtotal:       Number, // items total after discounts, before delivery
      deliveryCharge: Number, // fixed ₹399
      grandTotal:     Number, // subtotal + deliveryCharge
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "PREPAID"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "not_required"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "created",
        "payment_pending",
        "processing",
        "shipped",
        "delivered",
        "payment_failed",
        "cancelled",
      ],
      default: "created",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
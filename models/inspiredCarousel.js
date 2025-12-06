// models/inspiredCarousel.js
import mongoose, { Schema } from "mongoose";

const InspiredCarouselSchema = new Schema(
  {
    title: { type: String, default: "Get Inspired By Design" },

    // array of slides; each slide can have url, caption (optional)
    slides: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: "" },
      },
    ],

    // whether to show on homepage
    isActive: { type: Boolean, default: true },

    // autoplay interval in ms
    autoplayMs: { type: Number, default: 4000 },
  },
  { timestamps: true }
);

export default mongoose.models.InspiredCarousel ||
  mongoose.model("InspiredCarousel", InspiredCarouselSchema);

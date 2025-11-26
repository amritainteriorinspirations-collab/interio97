// models/application.js
import mongoose, { Schema } from "mongoose";

const ApplicationSchema = new Schema(
  {
    // e.g. "Kitchen", "Bedroom", "Outdoor"
    name: { type: String, required: true, unique: true },

    // for URL use - auto generated in controller if needed
    slug: { type: String, required: true, unique: true },

    // Image URL (UI can show a small visual icon or banner)
    image: { type: String, default: null },

    // Short description - optional
    desc: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

// app/api/upload/route.js
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    // ✅ Accept optional folder param — defaults to "uploads"
    const folder = formData.get("folder") || "uploads";

    // ✅ Validate: file exists
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // ✅ Validate: file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WebP, and GIF are allowed" },
        { status: 400 }
      );
    }

    // ✅ Validate: file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File must be under 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, folder);

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
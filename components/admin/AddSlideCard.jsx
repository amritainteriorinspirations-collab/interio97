// components/admin/AddSlideCard.jsx
"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import ImageUploadDropzone from "./ImageUploadDropzone";

export default function AddSlideCard({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) {
      alert("Please upload an image first.");
      return;
    }

    setAdding(true);
    try {
      const res = onAdd({ url: url.trim(), caption: caption.trim() });
      if (res && typeof res.then === "function") await res;
      // Reset
      setUrl("");
      setCaption("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Add failed.");
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setUrl("");
    setCaption("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-150 flex flex-col items-center justify-center text-gray-500 p-4 text-sm min-h-[180px]"
      >
        <Plus className="w-5 h-5 mb-2" />
        Add Slide
      </button>
    );
  }

  return (
    <div className="border rounded-md bg-white shadow-sm p-3 space-y-2 col-span-2 sm:col-span-1">
      {/* ✅ Dropzone instead of URL input */}
      <ImageUploadDropzone
        value={url}
        onChange={setUrl}
        folder="carousel"
      />

      {/* Caption */}
      <input
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border rounded px-2 py-1 text-xs"
      />

      <div className="flex items-center justify-between">
        <button
          onClick={handleAdd}
          disabled={adding || !url}
          className="px-3 py-1 bg-orange-500 text-white rounded-sm flex items-center gap-1 text-xs disabled:opacity-50"
        >
          <Check className="w-3 h-3" />
          {adding ? "Saving..." : "Add Slide"}
        </button>

        <button
          onClick={handleCancel}
          className="px-3 py-1 bg-gray-100 rounded-sm text-xs flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Cancel
        </button>
      </div>
    </div>
  );
}
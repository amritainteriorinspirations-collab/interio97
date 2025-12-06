// components/admin/AddSlideCard.jsx
"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";

export default function AddSlideCard({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) {
      alert("Please paste an image URL.");
      return;
    }

    setAdding(true);
    try {
      const res = onAdd({ url: url.trim(), caption: caption.trim() });
      if (res && typeof res.then === "function") await res;

      // Reset + close UI
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

  // UI when closed (compact add button card)
  if (!open) {
    return (
      <button
  onClick={() => setOpen(true)}
  className="border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-150 flex flex-col items-center justify-center text-gray-500 p-4 text-sm"
>

        <Plus className="w-5 h-5 mb-2" />
        Add Slide
      </button>
    );
  }

  // UI when open (compact input fields)
  return (
    <div className="border rounded-md bg-white shadow-sm p-3 text-xs space-y-2">
      <input
        placeholder="Image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border rounded px-2 py-1 text-xs"
      />

      <input
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border rounded px-2 py-1 text-xs"
      />

      <div className="flex items-center justify-between mt-1">
        <button
          onClick={handleAdd}
          disabled={adding}
          className="px-3 py-1 bg-orange-500 text-white rounded-sm flex items-center gap-1 text-xs"
        >
          <Check className="w-3 h-3" />
          {adding ? "..." : "Add"}
        </button>

        <button
          onClick={() => {
            setOpen(false);
            setUrl("");
            setCaption("");
          }}
          className="px-3 py-1 bg-gray-100 rounded-sm text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// components/admin/SlideCard.jsx
"use client";

import { useState } from "react";
import { Trash2, Edit2, Check } from "lucide-react";
import ImageUploadDropzone from "./ImageUploadDropzone";

export default function SlideCard({ slide, index, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(slide?.url || "");
  const [caption, setCaption] = useState(slide?.caption || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!url.trim()) {
      alert("Image required.");
      return;
    }
    setSaving(true);
    try {
      const res = onUpdate({ url: url.trim(), caption: caption.trim() });
      if (res && typeof res.then === "function") await res;
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setUrl(slide?.url || "");
    setCaption(slide?.caption || "");
  };

  return (
    <div className="border border-gray-300 rounded bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-150">
      {/* Preview — unchanged */}
      <div className="h-32 bg-gray-100 overflow-hidden flex items-center justify-center">
        {slide?.url ? (
          <img
            src={slide.url}
            alt={caption || `slide-${index}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-xs text-gray-400">No Image</div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 text-xs">
        {editing ? (
          <>
            {/* ✅ Dropzone instead of URL input */}
            <ImageUploadDropzone
              value={url}
              onChange={setUrl}
              folder="carousel"
            />

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="w-full border rounded px-2 py-1 mt-2 mb-2 text-xs"
            />

            <div className="flex items-center justify-between mt-1">
              <button
                onClick={save}
                disabled={saving || !url}
                className="px-2 py-1 bg-green-500 text-white rounded-sm flex items-center gap-1 text-xs disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                {saving ? "..." : "Save"}
              </button>

              <button
                onClick={handleCancel}
                className="px-2 py-1 bg-gray-100 rounded-sm text-xs"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!confirm("Remove this slide?")) return;
                  onRemove();
                }}
                className="p-1 bg-red-50 rounded-sm text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </>
        ) : (
          // Non-editing view — completely unchanged
          <>
            <p className="font-medium text-gray-800 min-h-[1.5rem]">
              {slide?.caption || (
                <span className="text-gray-400 italic">No caption</span>
              )}
            </p>

            <p className="text-[10px] text-gray-500 truncate">{slide?.url}</p>

            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => setEditing(true)}
                className="px-2 py-1 bg-gray-100 rounded-sm flex items-center gap-1 text-xs"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>

              <button
                onClick={() => {
                  if (!confirm("Remove this slide?")) return;
                  onRemove();
                }}
                className="py-1 px-2 bg-red-50 rounded-sm flex items-center gap-1 text-red-600 text-xs"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
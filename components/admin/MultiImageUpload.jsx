// components/admin/MultiImageUpload.jsx
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader, X } from "lucide-react";

const MAX_SLOTS = 5;

// ─── Single Slot ────────────────────────────────────────────
function ImageSlot({ url, uploading, error, onDrop, onRemove, index }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    disabled: !!url || uploading, // lock slot when image exists
    onDrop,
  });

  // ── Filled: show image + remove button
  if (url) {
    return (
      <div className="relative w-full aspect-square rounded-lg border border-gray-200 overflow-hidden group">
        <img
          src={url}
          alt={`Product image ${index + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove image"
        >
          <X className="w-3.5 h-3.5 text-red-500" />
        </button>
        <span className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
          {index === 0 ? "Main" : `#${index + 1}`}
        </span>
      </div>
    );
  }

  // ── Uploading spinner
  if (uploading) {
    return (
      <div className="w-full aspect-square rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 flex flex-col items-center justify-center gap-1">
        <Loader className="w-5 h-5 animate-spin text-orange-500" />
        <p className="text-[11px] text-gray-500">Uploading...</p>
      </div>
    );
  }

  // ── Empty: dropzone
  return (
    <div
      {...getRootProps()}
      className={`w-full aspect-square rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${
        isDragActive
          ? "border-orange-500 bg-orange-50"
          : "border-gray-300 hover:border-gray-400 bg-gray-50"
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-5 h-5 text-gray-400" />
      <p className="text-[11px] text-gray-400 text-center px-1">
        {isDragActive ? "Drop here" : index === 0 ? "Main image" : "Add image"}
      </p>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function MultiImageUpload({ values = [], onChange }) {
  // Pad to MAX_SLOTS so we always show 5 slots
  const slots = Array.from(
    { length: MAX_SLOTS },
    (_, i) => values[i] || null
  );

  const handleDrop = useCallback(
    (slotIndex) => async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        alert(rejectedFiles[0].errors[0]?.message || "Invalid file");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      // Mark slot as uploading by setting a sentinel value
      const uploading = [...values];
      uploading[slotIndex] = "__uploading__";
      onChange(uploading.filter(Boolean));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Upload failed");
        }

        // Replace sentinel with real URL
        const updated = [...values];
        updated[slotIndex] = data.url;
        onChange(updated.filter(Boolean));
      } catch (err) {
        // Remove sentinel on error
        const reverted = [...values];
        reverted[slotIndex] = null;
        onChange(reverted.filter(Boolean));
        alert(err.message);
      }
    },
    [values, onChange]
  );

  const handleRemove = useCallback(
    (slotIndex) => () => {
      const updated = [...values];
      updated.splice(slotIndex, 1); // remove from array
      onChange(updated.filter(Boolean));
    },
    [values, onChange]
  );

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {slots.map((url, i) => (
          <ImageSlot
            key={i}
            index={i}
            url={url === "__uploading__" ? null : url}
            uploading={url === "__uploading__"}
            onDrop={handleDrop(i)}
            onRemove={handleRemove(i)}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Up to {MAX_SLOTS} images · JPG, PNG, WebP · Max 5MB each · First image
        is shown as main
      </p>
    </div>
  );
}
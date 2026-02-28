// components/admin/ImageUploadDropzone.jsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader, X } from "lucide-react";

export default function ImageUploadDropzone({ value, onChange }) {
  // ✅ Sync with parent value (important for edit mode)
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      setError("");

      // ✅ Show dropzone rejection errors (size/type) to user
      if (rejectedFiles.length > 0) {
        const reason = rejectedFiles[0].errors[0]?.message || "Invalid file";
        setError(reason);
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      // ✅ Create local preview + cleanup memory on unmount
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "categories");
      setUploading(true);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Upload failed");
        }

        // ✅ Replace blob URL with CDN URL, free memory
        URL.revokeObjectURL(objectUrl);
        setPreview(data.url);
        onChange(data.url);
      } catch (err) {
        // ✅ Show error inline, not alert()
        setError(err.message);
        setPreview(value || ""); // Revert to previous image on error
        URL.revokeObjectURL(objectUrl);
      } finally {
        setUploading(false);
      }
    },
    [onChange, value]
  );

  const handleRemove = (e) => {
    e.stopPropagation(); // Don't open file picker
    setPreview("");
    onChange("");
    setError("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-6 h-6 animate-spin text-orange-500" />
            <p className="text-sm text-gray-500">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <UploadCloud className="w-6 h-6" />
            <p className="text-sm">
              {isDragActive
                ? "Drop image here"
                : "Drag & drop image here, or click to select"}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP up to 5MB</p>
          </div>
        )}
      </div>

      {/* ✅ Inline error message */}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      {/* ✅ Image preview with remove button */}
      {preview && !uploading && (
        <div className="relative mt-4 w-full h-48">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
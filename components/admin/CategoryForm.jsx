// components/admin/CategoryForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/lib/fetchers/categories";
import { Save, X, Image as ImageIcon, Loader } from "lucide-react";
import Toast from "./Toast";
import ImageUploadDropzone from "./ImageUploadDropzone";

// Input Field Component
const InputField = ({
  label,
  required,
  helperText,
  error,
  type = "text",
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      {...props}
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      }`}
    />
    {error ? (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    ) : (
      helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>
    )}
  </div>
);

// Textarea Component
const TextareaField = ({ label, helperText, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <textarea
      {...props}
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors resize-none ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      }`}
    />
    {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
);

export default function CategoryForm({ category = null }) {
  const router = useRouter();
  const isEdit = !!category;

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || "",

    // ⭐ NEW FIELDS
    isTrending: category?.isTrending || false,
    trendingTagline: category?.trendingTagline || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Auto-generate slug from name if creating new category
    if (name === "name" && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await updateCategory(category.slug, formData);
        setToast({
          message: "Category updated successfully!",
          type: "success",
        });
      } else {
        await createCategory(formData);
        setToast({
          message: "Category created successfully!",
          type: "success",
        });
      }

      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 1000);
    } catch (err) {
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="space-y-5">
          {/* Category Name */}
          <InputField
            label="Category Name"
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g., Wooden Flooring"
          />

          {/* Slug */}
          <InputField
            label="Slug"
            required
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            disabled={isEdit}
            error={errors.slug}
            helperText={
              isEdit ? "Slug cannot be changed" : "Auto-generated from name"
            }
            placeholder="e.g., wooden-flooring"
          />

          {/* Description */}
          <TextareaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description of this category"
            helperText="Optional - appears on category page"
          />

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category Image
            </label>

            <ImageUploadDropzone
              value={formData.image}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, image: url }))
              }
              folder="categories" // ✅ explicit
            />

            <p className="text-xs text-gray-500 mt-1">
              Optional - category image displayed in listings
            </p>
          </div>

          {/* Trending Collection Controls */}
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isTrending: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Mark as Trending Collection
              </span>
            </label>

            {/* Tagline Input */}
            {formData.isTrending && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Trending Tagline
                </label>
                <input
                  type="text"
                  name="trendingTagline"
                  value={formData.trendingTagline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      trendingTagline: e.target.value,
                    }))
                  }
                  placeholder="e.g., Modern Designs Loved This Week"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional — shown under category name in Trending Collections
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? "Update Category" : "Create Category"}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

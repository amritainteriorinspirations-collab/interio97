import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ProductVariants({ variants, currentSlug }) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Group variants by color
  const variantsByColor = variants.reduce((acc, variant) => {
    const color = variant.color || "Other";
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push(variant);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <span>🎨</span>
        Available Variants
      </h3>
      
      <div className="space-y-3">
        {Object.entries(variantsByColor).map(([color, colorVariants]) => (
          <div key={color}>
            <p className="text-xs font-semibold text-gray-700 mb-2">{color}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {colorVariants.map((variant) => {
                const isActive = variant.slug === currentSlug;
                return (
                  <Link
                    key={variant._id}
                    href={`/product/${variant.slug}`}
                    className={`group relative p-2 border-2 rounded-lg transition-all ${
                      isActive
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {variant.images && variant.images[0] ? (
                        <img
                          src={variant.images[0]}
                          alt={variant.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-lg">
                          📦
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {variant.size || "Standard"}
                        </p>
                        {variant.thickness && (
                          <p className="text-xs text-gray-600">
                            {variant.thickness}mm
                          </p>
                        )}
                      </div>
                      {!isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                      )}
                      {isActive && (
                        <span className="text-xs font-bold text-orange-600 flex-shrink-0">Current</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
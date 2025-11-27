import {
  FileText,
  Palette,
  Ruler,
  Layers,
  Sparkles,
  SquareCheck,
} from "lucide-react";
import ApplicationsGallery from "./ApplicationsGallery";

export default function ProductDetails({ product }) {
  const attributes = [
    {
      label: "Color",
      value: product.color,
      icon: Palette,
      show: !!product.color,
    },
    {
      label: "Size",
      value: product.size,
      icon: Ruler,
      show: !!product.size,
    },
    {
      label: "Thickness",
      value: product.thickness ? `${product.thickness}mm` : null,
      icon: Layers,
      show: !!product.thickness,
    },
    {
      label: "Material",
      value: product.material?.join(", "),
      icon: SquareCheck,
      show: product.material?.length > 0,
    },
    {
      label: "Pattern",
      value: product.pattern?.join(", "),
      icon: Sparkles,
      show: product.pattern?.length > 0,
    },
    {
      label: "Finish",
      value: product.finish?.join(", "),
      icon: Palette,
      show: product.finish?.length > 0,
    },
    {
      label: "Coverage Area",
      value: product.coverageArea,
      icon: SquareCheck,
      show: !!product.coverageArea,
    },
  ];

  const visibleAttributes = attributes.filter((a) => a.show);

  if (!product.description && visibleAttributes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 relative overflow-hidden">
        {/* Dotted Pattern Background */}
        <div
          className="absolute inset-0 opacity-3 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #999 0.5px, transparent 0.5px)`,
            backgroundSize: "12px 12px",
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Description */}
          {product.description && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <h3 className="text-md font-bold text-gray-900">Description</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Divider */}
          {product.description && visibleAttributes.length > 0 && (
            <div className="h-px bg-gray-200" />
          )}

          {/* Attributes Grid */}
          {visibleAttributes.length > 0 && (
            <div>
              <h3 className="text-md font-bold text-gray-900 mb-3">
                Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {visibleAttributes.map((attr, idx) => {
                  const Icon = attr.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-start gap-3"
                    >
                      <Icon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-gray-600 font-semibold">
                          {attr.label}
                        </p>
                        <p className="text-[13px] text-gray-900 capitalize font-medium break-words">
                          {attr.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 ">

        {/* ===== APPLICATIONS SECTION ===== */}
      {product.application?.length > 0 && (
        <ApplicationsGallery applications={product.application} />
      )}
      </div>
      </div>
    </div>
  );
}

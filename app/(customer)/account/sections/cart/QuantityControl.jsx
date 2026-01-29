"use client";

export default function QuantityControl({
  quantity,
  stock,
  onChange,
}) {
  return (
    <div className="flex items-center border rounded overflow-hidden">
      <button
        onClick={() => quantity > 1 && onChange(quantity - 1)}
        className="px-3 py-1 text-sm"
      >
        −
      </button>

      <span className="px-4 text-sm font-medium">
        {quantity}
      </span>

      <button
        onClick={() =>
          quantity < stock && onChange(quantity + 1)
        }
        className={`px-3 py-1 text-sm ${
          quantity >= stock
            ? "text-gray-300 cursor-not-allowed"
            : ""
        }`}
      >
        +
      </button>
    </div>
  );
}

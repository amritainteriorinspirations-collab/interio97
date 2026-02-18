"use client";

import { MapPin, Plus, Check, Phone } from "lucide-react";

export default function AddressSelector({
  addresses,
  selected,
  onSelect,
  onAddNew,
}) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header with Icon Badge */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 flex-shrink-0">
            <MapPin size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Delivery Address</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select where to deliver your order
            </p>
          </div>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Addresses List */}
      <div className="p-5 space-y-3">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm font-medium mb-3">No addresses found</p>
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Add an address
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <label
              key={addr._id}
              className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selected === addr._id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <div className="flex gap-4">
                <input
                  type="radio"
                  checked={selected === addr._id}
                  onChange={() => onSelect(addr._id)}
                  className="mt-1 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  {/* Name & Default Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900 text-sm">
                      {addr.name}
                    </p>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        <Check size={11} />
                        Default
                      </span>
                    )}
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium text-gray-700">{addr.addressLine1}</p>
                    {addr.addressLine2 && (
                      <p className="text-xs">{addr.addressLine2}</p>
                    )}
                    <p className="text-xs">
                      {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="text-xs flex items-center gap-1 mt-2 text-gray-700 font-medium">
                      <Phone size={14} className="text-gray-400" />
                     {addr.phone}
                    </p>
                  </div>
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
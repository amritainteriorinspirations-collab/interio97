"use client";

import { useAccount } from "../AccountDataProvider";
import {
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/actions/address";
import { useState } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Phone,
} from "lucide-react";

const EMPTY_FORM = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

// Skeleton Loader
function AddressSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-5 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                <div className="h-9 w-9 bg-gray-200 rounded-lg" />
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-3/4 bg-gray-100 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AddressView() {
  const { addresses, setAddresses, loading } = useAccount();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (loading.addresses || !addresses) {
    return <AddressSkeleton />;
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEdit(addr) {
    setEditing(addr);
    setForm({ ...addr });
    setError(null);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let updated;
      if (editing) {
        updated = await updateAddress(editing._id, form);
        setAddresses((prev) =>
          prev.map((a) => (a._id === updated._id ? updated : a))
        );
      } else {
        updated = await createAddress(form);
        setAddresses((prev) => [...prev, updated]);
      }

      if (form.isDefault) {
        setAddresses((prev) =>
          prev.map((a) =>
            a._id === updated._id
              ? { ...a, isDefault: true }
              : { ...a, isDefault: false }
          )
        );
      }

      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
            <MapPin size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
            <p className="text-xs text-gray-500 mt-1">
              Manage delivery locations
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Empty State */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-gray-900 font-semibold text-base mb-1">
            No addresses yet
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Add your first address to get started with orders
          </p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`rounded-lg border-2 p-5 bg-white transition-all ${
                addr.isDefault
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-100 flex-shrink-0">
                    <MapPin size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {addr.name}
                    </p>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mt-1.5">
                        <Check size={11} />
                        Default
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(addr)}
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <p className="text-gray-700 font-medium">{addr.addressLine1}</p>
                {addr.addressLine2 && (
                  <p className="text-gray-600">{addr.addressLine2}</p>
                )}
                <p className="text-gray-600">
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
                <div className="flex items-center gap-2 text-gray-600 pt-1">
                  <Phone size={14} className="text-gray-400" />
                  {addr.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">
                {editing ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                    placeholder="9876543210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={form.addressLine1}
                    onChange={(e) =>
                      setForm({ ...form, addressLine1: e.target.value })
                    }
                    required
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={form.addressLine2}
                    onChange={(e) =>
                      setForm({ ...form, addressLine2: e.target.value })
                    }
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    required
                    placeholder="Mumbai"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                    required
                    placeholder="Maharashtra"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm({ ...form, pincode: e.target.value })
                    }
                    required
                    placeholder="400001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Default Checkbox */}
              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) =>
                      setForm({ ...form, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Set as default address
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="inline-block animate-spin">⟳</span>
                      Saving…
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Save Address
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useAccount } from "../AccountDataProvider";
import { useState } from "react";

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

export default function AddressView() {
  const {
    addresses,
    setAddresses,
    loading,
  } = useAccount();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  if (loading.addresses || !addresses) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-500">
        Loading addresses…
      </div>
    );
  }

  async function saveAddress() {
    setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/addresses/${editing._id}` : "/api/addresses",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (editing) {
        setAddresses(
          addresses.map((a) =>
            a._id === editing._id ? data.address : a
          )
        );
      } else {
        setAddresses([...addresses, data.address]);
      }

      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress(id) {
    if (!confirm("Delete this address?")) return;

    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    setAddresses(addresses.filter((a) => a._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <button
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditing(null);
            setShowForm(true);
          }}
          className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded"
        >
          Add Address
        </button>
      </div>

      {addresses.length === 0 && (
        <div className="bg-white border rounded p-6 text-sm text-gray-600">
          No addresses added yet.
        </div>
      )}

      {addresses.map((addr) => (
        <div
          key={addr._id}
          className={`border rounded p-4 bg-white ${
            addr.isDefault ? "border-orange-500" : ""
          }`}
        >
          <p className="font-medium text-sm">
            {addr.name}{" "}
            {addr.isDefault && (
              <span className="text-xs text-orange-600">
                (Default)
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            {addr.addressLine1}, {addr.city}
          </p>

          <div className="flex gap-3 mt-2 text-sm">
            <button
              onClick={() => {
                setEditing(addr);
                setForm(addr);
                setShowForm(true);
              }}
              className="text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => deleteAddress(addr._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md space-y-3">
            <h3 className="font-semibold">
              {editing ? "Edit Address" : "Add Address"}
            </h3>

            {Object.keys(EMPTY_FORM).map(
              (key) =>
                key !== "isDefault" && (
                  <input
                    key={key}
                    placeholder={key}
                    value={form[key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded text-sm"
                  />
                )
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isDefault: e.target.checked,
                  })
                }
              />
              Default address
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="border px-3 py-1.5 rounded text-sm"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={saveAddress}
                className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

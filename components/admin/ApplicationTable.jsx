"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteApplication } from "@/lib/fetchers/applications";

export default function ApplicationTable({ initialData }) {
  const [items, setItems] = useState(initialData || []);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    try {
      setDeletingId(id);
      await deleteApplication(id);

      // Remove from UI
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  if (!items.length) {
    return <p>No applications found.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Slug</th>
            <th className="p-3">Image</th>
            <th className="p-3">Description</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((app) => (
            <tr key={app._id} className="border-t">
              <td className="p-3">{app.name}</td>

              <td className="p-3 text-gray-600">{app.slug}</td>

              <td className="p-3">
                {app.image ? (
                  <img
                    src={app.image}
                    alt={app.name}
                    className="h-10 w-16 rounded object-cover"
                  />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>

              <td className="p-3">{app.desc || "-"}</td>

              <td className="p-3 flex items-center gap-4">
                <Link
                  href={`/admin/applications/${app._id}`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(app._id)}
                  disabled={deletingId === app._id}
                  className="text-red-600"
                >
                  {deletingId === app._id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

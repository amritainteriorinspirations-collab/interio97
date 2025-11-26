"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createApplication,
  updateApplication,
} from "@/lib/fetchers/applications";

export default function ApplicationForm({ application = null }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: application?.name || "",
    image: application?.image || "",
    desc: application?.desc || "",
  });

  const isEdit = !!application;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit)
      await updateApplication(application._id, form);
    else
      await createApplication(form);

    router.push("/admin/applications");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 border rounded-lg space-y-4"
    >
      {/* Name */}
      <div>
        <label className="block mb-1 text-sm font-medium">Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="Kitchen"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block mb-1 text-sm font-medium">Image URL</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="https://example.com/kitchen.jpg"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 text-sm font-medium">Description</label>
        <textarea
          className="w-full border p-2 rounded h-24"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-orange-500 text-white rounded-lg"
      >
        {isEdit ? "Update Application" : "Create Application"}
      </button>
    </form>
  );
}

import Link from "next/link";
import { getAllApplications, deleteApplication } from "@/lib/fetchers/applications";
import { revalidatePath } from "next/cache";

/* -------------------- SERVER ACTION -------------------- */
async function handleDelete(formData) {
  "use server";

  const id = formData.get("id");

  // Use your existing server-side function
  await deleteApplication(id);

  // Refresh list
  revalidatePath("/admin/applications");
}

/* -------------------- PAGE COMPONENT -------------------- */
export default async function ApplicationsPage() {
  const applications = await getAllApplications();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Applications</h1>

        <Link
          href="/admin/applications/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Application
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Image</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
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

                <td className="p-3 text-right">
                  <Link
                    href={`/admin/applications/${app._id}`}
                    className="text-blue-600 underline mr-4"
                  >
                    Edit
                  </Link>

                  {/* DELETE FORM */}
                  <form action={handleDelete} className="inline-block">
                    <input type="hidden" name="id" value={app._id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

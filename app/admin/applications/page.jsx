// app/admin/applications/page.jsx

import { getAllApplications } from "@/lib/fetchers/applications";
import ApplicationTable from "@/components/admin/ApplicationTable";
import Link from "next/link";

export default async function ApplicationsPage() {
  // Server-side fetch
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

      {/* Client table component */}
      <ApplicationTable initialData={applications} />
    </div>
  );
}

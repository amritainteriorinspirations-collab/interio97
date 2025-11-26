// app/admin/applications/[id]/page.jsx

import { getApplicationById } from "@/lib/fetchers/applications";
import ApplicationForm from "@/components/admin/ApplicationForm";

export default async function EditApplicationPage({ params }) {
  const application = await getApplicationById(params.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Application</h1>

      <ApplicationForm application={application} />
    </div>
  );
}

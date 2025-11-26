// app/admin/applications/new/page.jsx

import ApplicationForm from "@/components/admin/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Application</h1>

      <div className="max-w-xl bg-white p-6 rounded-lg border shadow-sm">
        <ApplicationForm />
      </div>
    </div>
  );
}

// app/admin/color-variants/[id]/page.js

import ColorVariantForm from "@/components/admin/ColorVariantForm";
import { getColorVariantByIdServer } from "@/lib/serversideFetchers/colorVariants";

export default async function EditColorVariantPage({ params }) {
  const variant = await getColorVariantByIdServer(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Color Variant</h1>
      <ColorVariantForm variant={variant} />
    </div>
  );
}

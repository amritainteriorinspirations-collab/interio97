import PatternVariantForm from "@/components/admin/PatternVariantForm";
import { getPatternVariantByIdServer } from "@/lib/serversideFetchers/patternVariants";


export default async function EditPatternVariantPage({ params }) {
  const variant = await getPatternVariantByIdServer(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Pattern Variant</h1>
      <PatternVariantForm variant={variant} />
    </div>
  );
}

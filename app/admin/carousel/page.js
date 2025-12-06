// app/admin/carousel/page.js
import { getInspiredCarousel } from "@/lib/fetchers/inspiredCarousel";
import CarouselManager from "@/components/admin/CarouselManager";

export default async function CarouselAdminPage() {
  const data = await getInspiredCarousel();
  const slides = data?.slides || [];
  const title = data?.title || "Get Inspired By Design";
  const isActive = !!data?.isActive;
  const autoplayMs = data?.autoplayMs || 4000;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inspired Design Carousel</h1>
          <p className="text-sm text-gray-500">
            Manage the homepage inspiration carousel — reorder, edit, remove or add slides.
          </p>
        </div>
      </div>

      <div className="bg-white rounded border-2 border-gray-200 p-4">
        <CarouselManager
          initial={{ title, slides, isActive, autoplayMs }}
        />
      </div>
    </div>
  );
}

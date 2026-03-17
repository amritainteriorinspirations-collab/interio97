// components/customer/CategoryCard.jsx
import Link  from "next/link";
import Image from "next/image";

export default function CategoryCard({ category }) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div className="flex flex-col gap-1.5 hover:-translate-y-1 transition-transform duration-200">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-orange-50 border border-gray-200 group-hover:border-orange-400 group-hover:shadow-md transition-all duration-250">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">📁</span>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="rounded-md px-2 py-1.5 text-center border border-gray-100 group-hover:border-orange-200 bg-white transition-all duration-200">
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors leading-snug line-clamp-2">
            {category.name}
          </h3>
        </div>

      </div>
    </Link>
  );
}
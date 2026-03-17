// components/HomePage/PopularCategoriesSection.jsx
import Image         from "next/image";
import Link          from "next/link";
import CategoryCard  from "@/components/customer/CategoryCard";
import Section       from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { getAllCategories } from "@/lib/fetchers/serverCategories";

const MAX_CATEGORIES = 12;

export default async function PopularCategoriesSection() {
  const categories = await getAllCategories();
  const top = categories.slice(0, MAX_CATEGORIES);

  return (
    <Section>
      <SectionHeading
        title="Popular Categories from"
        accent="Amrita Interior Design"
        subtitle="Explore our most loved category selections"
      />

      {top.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
          {top.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      )}
    </Section>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <span className="text-5xl mb-4 block">📦</span>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">No categories yet</h3>
      <p className="text-sm text-gray-500">Check back soon for new products!</p>
    </div>
  );
}
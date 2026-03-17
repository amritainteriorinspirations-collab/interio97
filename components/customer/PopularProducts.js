// components/customer/PopularProducts.jsx
"use client";

import Section        from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollRow      from "@/components/ui/ScrollRow";
import ProductCardGrid from "./ProductCardGrid";

export default function PopularProducts({ products = [], userRole = "user" }) {
  if (!products.length) return null;

  return (
    <Section>
      <SectionHeading
        title="Explore Popular Products from"
        accent="Amrita Interior Design"
        subtitle="Top-rated picks customers love the most"
      />

      <ScrollRow autoplayMs={2500} scrollAmount={280}>
        {products.map((product) => (
          <div
            key={product._id}
            // Responsive card widths — gets wider as viewport grows
            className="flex-shrink-0 w-[62%] sm:w-[38%] md:w-[28%] lg:w-[22%]"
          >
            <ProductCardGrid product={product} userRole={userRole} />
          </div>
        ))}
      </ScrollRow>
    </Section>
  );
}
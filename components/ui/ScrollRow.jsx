// components/ui/ScrollRow.jsx
// Horizontal scroll container shared by PopularProducts + TrendingCollections.
// Handles: arrow buttons, autoplay (optional), touch swipe, pause-on-hover.
//
// Props:
//   children      — card elements
//   autoplayMs    — ms between auto-scrolls, 0 = disabled (default: 0)
//   scrollAmount  — px per arrow click (default: 300)

"use client";

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollRow({ children, autoplayMs = 0, scrollAmount = 300 }) {
  const ref = useRef(null);

  // ── Autoplay ──────────────────────────────────────────────
  useEffect(() => {
    if (!autoplayMs) return;
    const el = ref.current;
    if (!el) return;

    let interval;

    const start = () => {
      interval = setInterval(() => {
        const { scrollLeft, clientWidth, scrollWidth } = el;
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }, autoplayMs);
    };

    const stop = () => clearInterval(interval);

    start();
    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", start);

    return () => {
      stop();
      el.removeEventListener("mouseenter", stop);
      el.removeEventListener("mouseleave", start);
    };
  }, [autoplayMs, scrollAmount]);

  const scrollLeft  = () => ref.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  const scrollRight = () => ref.current?.scrollBy({ left:  scrollAmount, behavior: "smooth" });

  return (
    <div className="relative group/row">
      {/* Left arrow */}
      <button
        onClick={scrollLeft}
        aria-label="Scroll left"
        className="
          absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
          hidden sm:flex items-center justify-center
          w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md
          hover:bg-orange-50 hover:border-orange-300 transition-all
          opacity-0 group-hover/row:opacity-100
        "
      >
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>

      {/* Scrollable track */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-1 py-2"
      >
        {children}
      </div>

      {/* Right arrow */}
      <button
        onClick={scrollRight}
        aria-label="Scroll right"
        className="
          absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
          hidden sm:flex items-center justify-center
          w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md
          hover:bg-orange-50 hover:border-orange-300 transition-all
          opacity-0 group-hover/row:opacity-100
        "
      >
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
}
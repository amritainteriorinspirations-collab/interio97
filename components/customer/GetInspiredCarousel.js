// components/customer/GetInspiredCarousel.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image          from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Section        from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function GetInspiredCarousel({
  slides     = [],
  autoplayMs = 4000,
  title,
}) {
  const [index,    setIndex]    = useState(0);
  const timerRef               = useRef(null);
  const total                  = slides.length;

  // ── Helpers ───────────────────────────────────────────────
  const wrap = useCallback((i) => (i + total) % total, [total]);

  const stopTimer  = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    if (total < 2) return;
    timerRef.current = setInterval(() => setIndex((p) => wrap(p + 1)), autoplayMs);
  }, [total, autoplayMs, wrap]);

  const go = useCallback((dir) => {
    setIndex((p) => wrap(p + dir));
    stopTimer();
    // Resume autoplay after manual interaction
    startTimer();
  }, [wrap, stopTimer, startTimer]);

  // ── Autoplay ──────────────────────────────────────────────
  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  // ── Touch swipe ───────────────────────────────────────────
  const touchX = useRef(null);
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx >  40) go(-1);
    if (dx < -40) go(+1);
  };

  if (!slides.length) return null;

  const leftIdx   = wrap(index - 1);
  const centerIdx = wrap(index);
  const rightIdx  = wrap(index + 1);

  return (
    <Section>
      {title && (
        <SectionHeading
          title={title}
          accent="from Amrita Interior Design"
          subtitle="Handpicked inspirations curated for modern homes"
        />
      )}

      {/* ── Track ── */}
      <div
        className="relative flex items-center justify-center gap-3 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Side card — left */}
        <SideSlide slide={slides[leftIdx]} />

        {/* Centre card */}
        <div className="relative w-11/12 sm:w-1/2 flex-shrink-0 rounded-xl overflow-hidden shadow-lg aspect-[16/9]">
          <Image
            src={slides[centerIdx].url}
            alt={slides[centerIdx].caption || "Inspiration slide"}
            fill
            sizes="(max-width: 640px) 92vw, 50vw"
            className="object-cover"
            priority
          />
          {slides[centerIdx].caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
              <p className="text-white text-xs font-medium">{slides[centerIdx].caption}</p>
            </div>
          )}
        </div>

        {/* Side card — right */}
        <SideSlide slide={slides[rightIdx]} />

        {/* Arrows — only if more than 1 slide */}
        {total > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="
                absolute left-2 top-1/2 -translate-y-1/2
                w-8 h-8 flex items-center justify-center
                bg-white/80 backdrop-blur-sm rounded-full shadow
                hover:bg-white transition-colors z-10
              "
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={() => go(+1)}
              aria-label="Next slide"
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                w-8 h-8 flex items-center justify-center
                bg-white/80 backdrop-blur-sm rounded-full shadow
                hover:bg-white transition-colors z-10
              "
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); stopTimer(); startTimer(); }}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "w-5 h-2 bg-orange-500"       // active — pill shape
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </Section>
  );
}

// ── Side slide (blurred peek cards) ──────────────────────────────────────────
function SideSlide({ slide }) {
  return (
    <div className="hidden sm:block w-[18%] flex-shrink-0 rounded-lg overflow-hidden aspect-[16/9] opacity-60">
      <div className="relative w-full h-full">
        <Image
          src={slide.url}
          alt={slide.caption || ""}
          fill
          sizes="18vw"
          className="object-cover blur-[1.5px] brightness-90"
        />
      </div>
    </div>
  );
}
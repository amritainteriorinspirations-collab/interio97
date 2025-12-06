"use client";

import { useState } from "react";
import SlideCard from "./SlideCard";
import AddSlideCard from "./AddSlideCard";

export default function CarouselManager({ initial }) {
  const [title, setTitle] = useState(initial.title || "Get Inspired By Design");
  const [slides, setSlides] = useState(initial.slides || []);
  const [isActive, setIsActive] = useState(!!initial.isActive);
  const [autoplayMs, setAutoplayMs] = useState(initial.autoplayMs || 4000);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  /** Persist full carousel document */
  async function persist(updatedSlides) {
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        title,
        slides: updatedSlides,
        isActive,
        autoplayMs,
      };

      const res = await fetch("/api/inspired-carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();
      setSlides(data.slides || updatedSlides);
      setMsg("Saved");
    } catch (err) {
      console.error(err);
      setMsg("Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2000);
    }
  }

  const handleUpdateSlide = (index, patch) => {
    const updated = slides.map((s, i) =>
      i === index ? { ...s, ...patch } : s
    );
    setSlides(updated);
    persist(updated);
  };

  const handleRemoveSlide = (index) => {
    if (!confirm("Remove this slide?")) return;
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    persist(updated);
  };

  const handleAddSlide = (newSlide) => {
    const updated = [...slides, newSlide];
    setSlides(updated);
    persist(updated);
  };

  const handleMetaSave = () => {
    persist(slides);
  };

  return (
    <div className="space-y-5">
      {/* TOP BAR (COMPACT) */}
      <div className="bg-gray-100 border border-gray-200 rounded shadow-sm p-3 text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left side: title + meta */}
        <div className="flex-1 min-w-0 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-1 text-xs w-full"
          />

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Show on Homepage
            </label>

            <label className="flex items-center gap-1">
              Autoplay:
              <input
                type="number"
                value={autoplayMs}
                onChange={(e) => setAutoplayMs(Number(e.target.value))}
                className="w-20 border rounded px-2 py-1 text-xs"
              />
              ms
            </label>
          </div>
        </div>

        {/* Save Meta */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMetaSave}
            disabled={saving}
            className="px-3 py-1 bg-orange-500 text-white rounded-sm text-xs disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          {msg && <span className="text-gray-500 text-[11px]">{msg}</span>}
        </div>
      </div>

      {/* SLIDE GRID */}
      <h2 className="text-sm text-gray-500 font-semibold px-1">Slides</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {slides.map((s, idx) => (
          <SlideCard
            key={idx}
            index={idx}
            slide={s}
            onUpdate={(patch) => handleUpdateSlide(idx, patch)}
            onRemove={() => handleRemoveSlide(idx)}
          />
        ))}

        <AddSlideCard onAdd={handleAddSlide} />
      </div>
    </div>
  );
}

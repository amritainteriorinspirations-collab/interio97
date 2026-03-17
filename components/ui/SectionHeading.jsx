// components/ui/SectionHeading.jsx
// Single source of truth for every homepage section heading.
//
// Props:
//   title    — plain text (before accent)
//   accent   — orange-highlighted word(s), rendered after title
//   subtitle — small grey descriptor below
//   align    — "center" (default) | "left"

export default function SectionHeading({ title, accent, subtitle, align = "center" }) {
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <div className={`mb-10 ${alignClass}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
        {title}{accent && <> <span className="text-orange-600">{accent}</span></>}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
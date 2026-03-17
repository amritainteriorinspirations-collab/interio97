// components/HomePage/HeroSection.jsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Flame } from "lucide-react";
import Link from "next/link";

const HEADING = "Transform Your Space Instantly";

// Per-character fade-in variants
const charVariants = {
  hidden:  { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: { delay: i * 0.04, duration: 0.25 },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* ── Gradient background ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "320px",
          background: "linear-gradient(135deg, #92400e 0%, #ea580c 33%, #c2410c 66%, #7c2d12 100%)",
        }}
      >
        {/* ── Floating particles ── */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-orange-300 opacity-60"
            style={{
              top:  `${(i * 7)  % 80}%`,
              left: `${(i * 13) % 100}%`,
            }}
            animate={{
              y:       [0, -100, 0],
              x:       [0, Math.sin(i) * 80, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + ((i * 3) % 4),
              repeat:   Infinity,
              ease:     "easeInOut",
              delay:    i * 0.1,
            }}
          />
        ))}

        {/* ── Content ── */}
        <div
          className="relative z-10 flex items-center justify-center px-6 text-center"
          style={{ minHeight: "320px" }}
        >
          <div className="max-w-3xl mx-auto">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/15 border border-orange-300/40 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-orange-200" />
              <span className="text-sm font-medium text-orange-100">New Collection 2025</span>
            </motion.div>

            {/* Animated heading */}
            <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight flex items-center justify-center flex-wrap">
              {HEADING.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={charVariants}
                  initial="hidden"
                  animate="visible"
                  className={char === " " ? "w-2" : ""}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <Flame className="w-6 h-6 text-orange-300 ml-2 flex-shrink-0" />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-orange-100 text-sm md:text-base mb-6 max-w-2xl mx-auto"
            >
              Premium flooring, wallpaper & decor handpicked for modern living
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Link href="/category/all">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-700 via-orange-600 to-yellow-600 text-white font-semibold rounded-lg transition-all group"
                >
                  Explore Products
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* ── Animated SVG waves — 3 layers ── */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          style={{ minHeight: "120px" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wg1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="rgba(234,88,12,0.3)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0.1)" />
            </linearGradient>
            <linearGradient id="wg2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="rgba(249,115,22,0.2)" />
              <stop offset="100%" stopColor="rgba(253,224,71,0.05)" />
            </linearGradient>
            <linearGradient id="wg3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="rgba(245,158,11,0.15)" />
              <stop offset="100%" stopColor="rgba(254,243,199,0)" />
            </linearGradient>
          </defs>

          {[
            { id: "wg1", d1: "M 0,80 Q 300,40 600,80 T 1200,80 L 1200,200 L 0,200 Z",   d2: "M 0,100 Q 300,60 600,100 T 1200,100 L 1200,200 L 0,200 Z", dur: 6,   delay: 0   },
            { id: "wg2", d1: "M 0,100 Q 300,70 600,100 T 1200,100 L 1200,200 L 0,200 Z", d2: "M 0,110 Q 300,50 600,110 T 1200,110 L 1200,200 L 0,200 Z", dur: 7,   delay: 0.2 },
            { id: "wg3", d1: "M 0,120 Q 300,90 600,120 T 1200,120 L 1200,200 L 0,200 Z", d2: "M 0,100 Q 300,80 600,100 T 1200,100 L 1200,200 L 0,200 Z", dur: 8,   delay: 0.4 },
          ].map(({ id, d1, d2, dur, delay }) => (
            <motion.path
              key={id}
              fill={`url(#${id})`}
              animate={{ d: [d1, d2, d1] }}
              transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}
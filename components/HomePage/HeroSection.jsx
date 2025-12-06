"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full h-72 overflow-hidden bg-gradient-to-r from-orange-900 via-orange-700 to-orange-800">
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-25">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.4) 0%, transparent 50%)
            `,
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      {/* Floating elements */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 rounded-full bg-orange-300 opacity-50"
          style={{
            top: `${20 + i * 20}%`,
            left: `${15 + i * 25}%`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
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

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight"
          >
            Transform Your Space{" "}
            <motion.span
              animate={{ color: ["#fed7aa", "#fb923c", "#fed7aa"] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-orange-300"
            >
              Instantly
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-orange-100 text-sm md:text-base mb-6 max-w-2xl mx-auto"
          >
            Premium flooring, wallpaper & decor handpicked for modern living
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-gray-100 font-semibold rounded-lg transition-all group"
            >
              Explore Products
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition" />
              </motion.div>
            </motion.button>
          </motion.div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent opacity-5" />
    </section>
  );
}
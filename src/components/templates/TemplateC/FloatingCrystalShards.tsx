'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export interface FloatingCrystalShardsProps {
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export const FloatingCrystalShards: React.FC<FloatingCrystalShardsProps> = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({
    container: containerRef,
  })

  // Gentle Z and Y parallax offsets for floating crystal facets
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 140])
  const r1 = useTransform(scrollYProgress, [0, 1], [0, 45])
  const s1 = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  const y2 = useTransform(scrollYProgress, [0, 1], [0, 220])
  const r2 = useTransform(scrollYProgress, [0, 1], [25, -20])
  const s2 = useTransform(scrollYProgress, [0, 1], [0.9, 1.2])

  const y3 = useTransform(scrollYProgress, [0, 1], [0, 180])
  const r3 = useTransform(scrollYProgress, [0, 1], [-15, 30])

  const y4 = useTransform(scrollYProgress, [0, 1], [0, 260])
  const r4 = useTransform(scrollYProgress, [0, 1], [40, -10])

  const y5 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const r5 = useTransform(scrollYProgress, [0, 1], [-30, 40])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Top-left Crystal Prism */}
      <motion.div
        style={{ y: y1, rotate: r1, scale: s1 }}
        className="absolute top-12 left-4 w-16 h-24 backdrop-blur-xs bg-white/25 border border-white/50 shadow-sm rounded-lg rotate-12 opacity-60"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 via-transparent to-white/40" />
      </motion.div>

      {/* 2. Top-right Faceted Shard */}
      <motion.div
        style={{ y: y2, rotate: r2, scale: s2 }}
        className="absolute top-36 -right-2 w-20 h-20 backdrop-blur-xs bg-teal-50/30 border border-white/60 shadow-md rotate-45 opacity-50"
      >
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-100/20 via-transparent to-white/30" />
      </motion.div>

      {/* 3. Mid-left Floating Rhombus */}
      <motion.div
        style={{ y: y3, rotate: r3 }}
        className="absolute top-[42%] -left-3 w-14 h-24 backdrop-blur-xs bg-white/20 border border-white/45 shadow-sm -rotate-12 opacity-55"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-teal-100/20" />
      </motion.div>

      {/* 4. Mid-right Crystal Triangle Sward */}
      <motion.div
        style={{ y: y4, rotate: r4 }}
        className="absolute top-[68%] -right-4 w-24 h-32 backdrop-blur-xs bg-emerald-50/20 border border-white/50 shadow-sm rotate-20 opacity-40"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-200/20 via-transparent to-white/30" />
      </motion.div>

      {/* 5. Bottom Small Glistening Shard */}
      <motion.div
        style={{ y: y5, rotate: r5 }}
        className="absolute bottom-16 left-10 w-12 h-16 backdrop-blur-xs bg-white/30 border border-white/60 shadow-xs rotate-6 opacity-65"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-teal-50/30" />
      </motion.div>
    </div>
  )
}

export default FloatingCrystalShards

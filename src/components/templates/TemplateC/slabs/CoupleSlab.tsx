'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { CoupleWithDetails, Guest } from '@/types'
import { Sparkles, Heart } from 'lucide-react'

const InstagramIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

interface CoupleSlabProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}

export const CoupleSlab: React.FC<CoupleSlabProps> = ({ couple, guest }) => {
  const slabRef = useRef<HTMLDivElement>(null)

  // 3D Tilt micro-interaction setup
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg'])

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!slabRef.current) return
    const rect = slabRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  const groomInitial = couple.groomName ? couple.groomName.charAt(0) : 'B'
  const brideInitial = couple.brideName ? couple.brideName.charAt(0) : 'A'

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={slabRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full rounded-3xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden select-none"
      >
        {/* Ambient Light Glare Overlay */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-gradient-to-br from-white/60 via-teal-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Slab Indicator Tag */}
        <div className="flex items-center justify-between relative z-10 mb-4">
          <span className="text-[10px] font-mono tracking-widest text-teal-800 uppercase backdrop-blur-md bg-white/60 px-3 py-1 rounded-full border border-white/70 shadow-2xs">
            Slab 01 &bull; The Couple
          </span>
          <div className="flex items-center space-x-1 text-teal-600">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bismillah & Salam */}
        <div className="relative z-10 space-y-2 mt-2">
          <span className="text-2xl text-teal-800 font-serif block">﷽</span>
          <p className="text-xs font-serif text-slate-600">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan kerendahan hati, kami mengundang Anda dalam ikatan suci kami:
          </p>
        </div>

        {/* Centerpiece: Frosted Glass Photo / Monogram */}
        <div className="my-6 relative z-10 flex flex-col items-center">
          {couple.coverPhotoUrl ? (
            <div className="relative w-52 h-64 rounded-2xl overflow-hidden backdrop-blur-md bg-white/40 border-2 border-white/90 shadow-xl p-1.5">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={couple.coverPhotoUrl}
                  alt={`${couple.groomName} & ${couple.brideName}`}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
              </div>
            </div>
          ) : (
            <div className="w-44 h-44 rounded-3xl backdrop-blur-xl bg-white/60 border-2 border-white shadow-xl p-3 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-teal-700 to-slate-800 text-white flex flex-col items-center justify-center shadow-inner">
                <span className="font-serif text-4xl tracking-wider text-teal-200">
                  {groomInitial} &amp; {brideInitial}
                </span>
                <span className="text-[9px] uppercase font-sans tracking-widest text-teal-100/70 mt-1">
                  Holy Union
                </span>
              </div>
            </div>
          )}

          {/* Couple Names */}
          <h1 className="mt-4 text-2xl sm:text-3xl font-serif font-normal text-slate-900 leading-tight">
            {couple.groomName.split(',')[0]}
            <span className="block text-xl text-teal-700 font-serif italic my-0.5">
              &amp;
            </span>
            {couple.brideName.split(',')[0]}
          </h1>
        </div>

        {/* Detailed Profiles */}
        <div className="relative z-10 space-y-4 pt-1">
          {/* Groom Profile */}
          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 shadow-2xs">
            <h3 className="font-serif text-base font-medium text-slate-900">
              {couple.groomName}
            </h3>
            {couple.groomParents && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Putra dari {couple.groomParents}
              </p>
            )}
            {couple.groomInstagram && (
              <a
                href={`https://instagram.com/${couple.groomInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center space-x-1.5 text-xs text-teal-800 hover:text-teal-950 backdrop-blur-md bg-white/80 px-3 py-1 rounded-full border border-white/80"
              >
                <InstagramIcon className="w-3 h-3" />
                <span>@{couple.groomInstagram}</span>
              </a>
            )}
          </div>

          {/* Heart Divider */}
          <div className="flex items-center justify-center my-0.5">
            <div className="w-7 h-7 rounded-full backdrop-blur-md bg-white/80 border border-white/90 flex items-center justify-center text-teal-700 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-teal-600/20 text-teal-700" />
            </div>
          </div>

          {/* Bride Profile */}
          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 shadow-2xs">
            <h3 className="font-serif text-base font-medium text-slate-900">
              {couple.brideName}
            </h3>
            {couple.brideParents && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Putri dari {couple.brideParents}
              </p>
            )}
            {couple.brideInstagram && (
              <a
                href={`https://instagram.com/${couple.brideInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center space-x-1.5 text-xs text-teal-800 hover:text-teal-950 backdrop-blur-md bg-white/80 px-3 py-1 rounded-full border border-white/80"
              >
                <InstagramIcon className="w-3 h-3" />
                <span>@{couple.brideInstagram}</span>
              </a>
            )}
          </div>
        </div>

        {/* Holy Verse Quote */}
        {couple.openingQuoteText && (
          <div className="mt-5 pt-4 border-t border-slate-200/60 relative z-10 text-center">
            <p className="text-xs font-serif italic text-slate-800 leading-relaxed">
              &ldquo;{couple.openingQuoteText}&rdquo;
            </p>
            {couple.openingQuoteTitle && (
              <p className="mt-1.5 text-[10px] font-semibold tracking-wider text-teal-700 uppercase font-sans">
                &mdash; {couple.openingQuoteTitle} &mdash;
              </p>
            )}
          </div>
        )}

        {/* Guest Badge */}
        {guest && (
          <div className="mt-5 p-3 rounded-2xl backdrop-blur-md bg-white/70 border border-white/90 shadow-2xs relative z-10">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              Tamu Kehormatan:
            </p>
            <p className="mt-0.5 text-sm font-serif font-semibold text-slate-900 truncate">
              {guest.name}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default CoupleSlab

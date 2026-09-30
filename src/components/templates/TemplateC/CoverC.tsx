'use client'

import React, { useState } from 'react'
import type { CoverProps } from '@/types/cover'
import dynamic from 'next/dynamic'
import { Sparkles, Zap } from 'lucide-react'
import type { GlassState } from '@/components/three/TemplateCCover3D'

const DynamicTemplateCCanvas = dynamic(
  () => import('@/components/three/TemplateCCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 sm:h-96 flex items-center justify-center">
        <div className="w-64 h-44 rounded-3xl backdrop-blur-md bg-white/40 border border-white/60 shadow-lg p-4 animate-pulse flex flex-col items-center justify-center space-y-2">
          <div className="w-9 h-9 rounded-full bg-teal-100/60 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-[10px] font-sans tracking-widest text-slate-500 uppercase">
            Mempersiapkan Undangan Kaca...
          </span>
        </div>
      </div>
    ),
  }
)

export const CoverC: React.FC<CoverProps> = ({
  couple,
  guest,
  onOpenComplete,
}) => {
  const [glassState, setGlassState] = useState<GlassState>('INTACT')

  const groomShort = couple.groomName.split(',')[0]
  const brideShort = couple.brideName.split(',')[0]

  return (
    <section className="relative h-screen w-full flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b from-[#F5F8F4] via-[#EEF2EC] to-[#E5EBE3] text-slate-800 select-none overflow-hidden touch-none overscroll-none">
      {/* Background Soft Glows */}
      <div className="absolute top-8 -left-16 w-64 h-64 bg-teal-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 -right-16 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header */}
      <div className="pt-4 relative z-10 space-y-2 text-center shrink-0">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-xs text-[11px] font-sans font-medium text-teal-800 tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>CRYSTALLINE GLASS INVITATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-slate-800 tracking-tight">
          {groomShort} <span className="font-light italic text-teal-600">&amp;</span> {brideShort}
        </h1>
        <p className="text-xs text-slate-500 font-sans">
          Walimatul &apos;Ursy &amp; Syukuran Pernikahan
        </p>
      </div>

      {/* 2. Central 3D Interactive Canvas */}
      <div className="relative z-10 my-auto w-full max-w-sm mx-auto flex flex-col items-center justify-center">
        <DynamicTemplateCCanvas
          glassState={glassState}
          setGlassState={setGlassState}
          onOpenComplete={onOpenComplete}
        />

        {/* Dynamic Tactile Glass Instruction */}
        <div className="mt-1 transition-all duration-300">
          {glassState === 'INTACT' && (
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/70 shadow-xs text-xs font-sans text-teal-800 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>Ketuk kaca untuk membuka</span>
            </div>
          )}

          {glassState === 'CRACKED' && (
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-800 text-white shadow-md text-xs font-sans animate-bounce">
              <Zap className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              <span>Ketuk sekali lagi</span>
            </div>
          )}

          {glassState === 'SHATTERING' && (
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-900/80 text-teal-100 shadow-sm text-xs font-sans">
              <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-spin" />
              <span>Membuka undangan...</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Guest Card */}
      {guest && (
        <div className="relative z-10 pb-4 w-full max-w-sm mx-auto shrink-0">
          <div className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 shadow-xs text-center">
            <p className="text-[10px] font-sans uppercase tracking-wider text-slate-500">
              Yth. Bapak/Ibu/Saudara/i:
            </p>
            <p className="mt-0.5 text-base font-serif font-bold text-slate-800 truncate">
              {guest.name}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default CoverC


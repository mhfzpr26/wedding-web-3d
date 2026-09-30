'use client'

import React, { useState } from 'react'
import type { CoverProps } from '@/types/cover'
import dynamic from 'next/dynamic'
import { ArrowRight, Sparkles } from 'lucide-react'
const DynamicTemplateBCanvas = dynamic(
  () => import('@/components/three/TemplateBCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 sm:h-96 flex items-center justify-center">
        <div className="w-64 h-44 border border-neutral-300 bg-neutral-100/70 p-4 animate-pulse flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-neutral-600" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            Loading Monolith Envelope...
          </span>
        </div>
      </div>
    ),
  }
)

export type CoverBStage = 'LOCKED' | 'TEARING' | 'OPENED'

export const CoverB: React.FC<CoverProps> = ({
  couple,
  guest,
  onOpenComplete,
}) => {
  const [stage, setStage] = useState<CoverBStage>('LOCKED')
  const [tearProgress, setTearProgress] = useState(0)

  const handleDragChange = (dragging: boolean) => {
    if (stage === 'OPENED') return
    if (dragging) {
      setStage('TEARING')
    } else if (tearProgress < 0.85) {
      setStage('LOCKED')
    }
  }

  const handleOpenComplete = () => {
    setStage('OPENED')
    onOpenComplete()
  }

  const groomShort = couple.groomName.split(',')[0].toUpperCase()
  const brideShort = couple.brideName.split(',')[0].toUpperCase()
  const isDragging = stage === 'TEARING'

  return (
    <section className="relative h-screen w-full flex flex-col justify-between p-6 sm:p-8 bg-[#FAFAF8] text-neutral-900 select-none overflow-hidden touch-none overscroll-none border-x border-neutral-200">
      {/* 1. Editorial Masthead */}
      <div className="pt-4 relative z-10 space-y-2 shrink-0">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600">
            01 // UNVEIL
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">
            EDITION MMXXVI
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif tracking-tighter uppercase font-bold pt-1">
          {groomShort} &amp; {brideShort}
        </h1>
        <p className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
          Contemporary Matrimonial Folio
        </p>
      </div>

      {/* 2. Central 3D Interactive Canvas */}
      <div className="relative z-10 my-auto w-full max-w-sm mx-auto flex flex-col items-center justify-center">
        <DynamicTemplateBCanvas
          tearProgress={tearProgress}
          setTearProgress={setTearProgress}
          isDragging={isDragging}
          setIsDragging={handleDragChange}
          onOpenComplete={handleOpenComplete}
        />

        {/* Dynamic Tear Progress Indicator */}
        <div className="w-full max-w-[280px] mt-3 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600">
            <span className="flex items-center space-x-1 tracking-wider">
              {stage === 'LOCKED' && (
                <>
                  <span className="font-bold text-neutral-950">01 / PULL TO UNVEIL</span>
                  <ArrowRight className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                </>
              )}
              {stage === 'TEARING' && (
                <>
                  <span className="font-bold text-neutral-950">TEARING STRIP</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block ml-1" />
                </>
              )}
              {stage === 'OPENED' && (
                <span className="font-bold text-neutral-950">UNVEILED</span>
              )}
            </span>
            <span className="font-mono text-neutral-900 font-semibold">
              {Math.round(tearProgress * 100)}%
            </span>
          </div>
          <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-950 transition-all duration-75"
              style={{ width: `${Math.max(4, tearProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Guest Card */}
      {guest && (
        <div className="relative z-10 pb-4 w-full max-w-sm mx-auto shrink-0">
          <div className="p-3.5 border border-neutral-900/15 bg-white shadow-xs">
            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400">
              INVITATION RECIPIENT
            </p>
            <p className="mt-0.5 text-sm font-serif font-bold tracking-wide uppercase text-neutral-900 truncate">
              {guest.name}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default CoverB


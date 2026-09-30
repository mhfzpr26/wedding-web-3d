'use client'

import React, { useState } from 'react'
import type { CoverProps } from '@/types/cover'
import dynamic from 'next/dynamic'
import { Sparkles, MailOpen } from 'lucide-react'
import { playWaxSealCrackSound, playPaperSlideSound, triggerHaptic } from '@/lib/audio/soundEffects'
import { formatDate } from '@/lib/utils'
import type { EnvelopeThemeKey } from '@/components/three/TemplateACover3D'

const DynamicTemplateACanvas = dynamic(
  () => import('@/components/three/TemplateACanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 sm:h-72 flex items-center justify-center">
        <div className="w-60 h-40 rounded-3xl bg-white/70 border border-[#E2D9CE] shadow-sm animate-pulse flex flex-col items-center justify-center space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span className="text-[10px] font-serif tracking-widest text-[#8A7968] uppercase">
            Mempersiapkan Undangan...
          </span>
        </div>
      </div>
    ),
  }
)

export const CoverA: React.FC<CoverProps> = ({
  couple,
  guest,
  onOpenComplete,
}) => {
  const [isSealBroken, setIsSealBroken] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<EnvelopeThemeKey>('navy')

  const handleBreakSeal = () => {
    if (isSealBroken) return
    playWaxSealCrackSound()
    triggerHaptic(25)
    setIsSealBroken(true)
    setIsOpening(true)
  }

  const handleOpenFinished = () => {
    playPaperSlideSound()
    onOpenComplete()
  }

  // Trigger one-tap unbox from the button or seal
  const handleTriggerOpen = () => {
    if (isSealBroken || isOpening) return
    handleBreakSeal()
    setForceOpen(true)
  }

  const groomShort = couple.groomName.split(',')[0]
  const brideShort = couple.brideName.split(',')[0]

  // Formatted wedding event date (from first event, e.g. Akad Nikah)
  const weddingDateStr = couple.events?.[0]?.startTime
    ? formatDate(couple.events[0].startTime, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <section className="fixed inset-0 h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-b from-[#F2ECE4] via-[#FAF8F5] to-[#FAF8F5] select-none overflow-hidden touch-none z-50">
      {/* Background Soft Arch Glow */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#EAE2D5]/70 to-transparent pointer-events-none" />

      {/* Background Architectural Palace Arch Silhouette */}
      <div className="absolute inset-3 sm:inset-5 border border-[#D4AF37]/20 rounded-t-full pointer-events-none" />
      <div className="absolute inset-4 sm:inset-6 border border-[#D4AF37]/10 rounded-t-full pointer-events-none" />

      {/* Romantic Couple Initials Watermark Monogram behind Envelope */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-serif text-[120px] sm:text-[150px] italic font-light text-[#D4AF37]/[0.055] tracking-widest translate-y-[-24px]">
          {groomShort[0]}&amp;{brideShort[0]}
        </span>
      </div>

      {/* Main Unified Content Stack: Balanced & Cohesive Vertical Spacing */}
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center justify-center space-y-3 sm:space-y-4 my-auto">
        {/* 1. Header: The Wedding of & Couple Names & Date */}
        <div className="space-y-1 shrink-0">
          <div className="inline-flex items-center space-x-1.5 text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8C7851] bg-white/90 backdrop-blur-sm px-3.5 py-1 rounded-full border border-[#E2D9CE] shadow-sm">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>The Wedding of</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif text-[#1B2A4A] tracking-tight leading-tight">
            {groomShort} <span className="italic font-normal text-[#8C7851]">&amp;</span> {brideShort}
          </h1>

          {weddingDateStr && (
            <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#8A7968] uppercase">
              {weddingDateStr}
            </p>
          )}
        </div>

        {/* 2. Central 3D Interactive Canvas & Action Buttons */}
        <div className="w-full flex flex-col items-center justify-center">
          <div className="relative w-full">
            <DynamicTemplateACanvas
              isSealBroken={isSealBroken}
              onBreakSeal={handleBreakSeal}
              onOpenComplete={handleOpenFinished}
              forceOpen={forceOpen}
              themeKey={selectedTheme}
            />
          </div>

          {/* One-Tap Open Prompt Button */}
          <div className="mt-1 transition-all duration-300">
            {!isSealBroken ? (
              <div className="flex flex-col items-center space-y-2">
                <button
                  type="button"
                  onClick={handleTriggerOpen}
                  className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#E2D9CE] shadow-sm text-xs font-serif text-[#1B2A4A] hover:bg-[#FAF8F5] transition-all cursor-pointer animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-[#861A24] animate-ping" />
                  <span>Ketuk segel untuk membuka</span>
                </button>

                {/* Envelope Theme Color Selector */}
                <div className="flex items-center space-x-2 pt-0.5">
                  {(['navy', 'burgundy', 'olive', 'saddle'] as EnvelopeThemeKey[]).map((theme) => {
                    const isSelected = selectedTheme === theme
                    const bgColors: Record<EnvelopeThemeKey, string> = {
                      navy: 'bg-[#192843]',
                      burgundy: 'bg-[#4A131B]',
                      olive: 'bg-[#1E3327]',
                      saddle: 'bg-[#4A3222]',
                    }
                    const names: Record<EnvelopeThemeKey, string> = {
                      navy: 'Midnight Navy',
                      burgundy: 'Royal Burgundy',
                      olive: 'Forest Olive',
                      saddle: 'Rich Saddle',
                    }
                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => setSelectedTheme(theme)}
                        title={`Warna: ${names[theme]}`}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${bgColors[theme]} transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#FAF8F5] scale-110 shadow-sm'
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                        aria-label={names[theme]}
                      />
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#1B2A4A] text-[#FAF8F5] shadow-md text-xs font-serif">
                <MailOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Membuka Undangan...</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Luxury Stationery Recipient Label (Seamlessly integrated into unified stack) */}
        <div className="w-full max-w-xs sm:max-w-sm mx-auto pt-0.5 shrink-0">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FCFAF7]/95 backdrop-blur-md border border-[#E2D9CE] ring-1 ring-[#D4AF37]/30 shadow-sm relative overflow-hidden text-center">
            {/* Subtle top ribbon accent */}
            <div className="w-10 h-0.5 rounded-full bg-[#D4AF37]/45 mx-auto mb-1.5" />

            <p className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#8A7968]">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </p>

            <p className="mt-0.5 text-base sm:text-lg font-serif font-bold text-[#1B2A4A] truncate">
              {guest?.name || 'Tamu Undangan'}
            </p>

            <p className="text-[10px] font-serif italic text-[#8A7968] mt-0.5">
              Di Tempat
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CoverA

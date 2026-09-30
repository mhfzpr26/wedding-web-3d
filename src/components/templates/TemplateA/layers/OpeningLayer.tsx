'use client'

import { ChevronDown } from 'lucide-react'
import React from 'react'
import type { CoupleWithDetails, Guest } from '@/types'

interface OpeningLayerProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}

export const OpeningLayer: React.FC<OpeningLayerProps> = ({ couple, guest }) => {
  return (
    <div className="w-full p-2.5 sm:p-4 text-center select-text relative flex flex-col items-center">
      {/* 0. Naskah Proklamasi Cross-Fold Creases & Archival Accents */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {/* Horizontal Fold Crease Line */}
        <div className="absolute top-[49%] inset-x-2 h-px -translate-y-1/2">
          <div className="w-full h-[0.5px] bg-[#8C7A64]/20 shadow-[0_1px_1px_rgba(255,255,255,0.75)]" />
        </div>
        {/* Vertical Fold Crease Line */}
        <div className="absolute left-1/2 inset-y-3 w-px -translate-x-1/2">
          <div className="h-full w-[0.5px] bg-[#8C7A64]/20 shadow-[1px_0_1px_rgba(255,255,255,0.75)]" />
        </div>

        {/* Archival Corner Frame Hairlines */}
        <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t border-l border-[#C5A059]/35" />
        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t border-r border-[#C5A059]/35" />
        <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b border-l border-[#C5A059]/35" />
        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b border-r border-[#C5A059]/35" />
      </div>

      {/* 1. Salam */}
      <div className="mb-2 relative z-10">
        <p className="text-xs sm:text-[13px] font-serif italic text-[#8A7968] tracking-wide">
          Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
        </p>
      </div>

      {/* 2. Sapaan */}
      <div className="w-full max-w-xs sm:max-w-sm px-2 space-y-1 mb-2.5 relative z-10">
        <p className="text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-[0.24em] text-[#8C7851]">
          Kepada Yth. Bapak/Ibu/Saudara/i
        </p>
        <p className="text-base sm:text-lg font-serif font-bold text-[#1B2A4A] tracking-tight">
          {guest?.name || 'Tamu Undangan'}
        </p>
        <p className="text-[11.5px] sm:text-xs text-[#4A5568] leading-relaxed">
          Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu
          kepada kedua mempelai.
        </p>
      </div>

      {/* 3. Pembatas 1 */}
      <div className="flex items-center justify-center space-x-2 my-1 opacity-65 select-none relative z-10">
        <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#D4AF37]" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37] bg-[#FAF6EE]" />
        <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#D4AF37]" />
      </div>

      {/* 4. Bismillah */}
      <div className="my-1.5 w-full max-w-xs sm:max-w-sm px-2 relative z-10" dir="rtl">
        <p className="font-serif text-base sm:text-lg text-[#8C7851] tracking-normal leading-relaxed text-center font-normal">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      {/* 5. Ayat (Arabic Text) */}
      <div className="w-full max-w-xs sm:max-w-sm px-2 my-1 relative z-10" dir="rtl">
        <p className="font-serif text-[13px] sm:text-[15px] text-[#1B2A4A] leading-relaxed text-center font-normal">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </p>
      </div>

      {/* 6. Pembatas 2 */}
      <div className="flex items-center justify-center space-x-2 my-1 opacity-65 select-none relative z-10">
        <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
        <div className="w-1 h-1 rotate-45 bg-[#D4AF37]" />
        <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
      </div>

      {/* 7. Arti */}
      {couple.openingQuoteText && (
        <div className="w-full max-w-xs sm:max-w-sm px-2 space-y-1 mb-2 relative z-10">
          <p className="text-[11px] sm:text-xs font-serif italic text-[#4A5568] leading-relaxed">
            &ldquo;{couple.openingQuoteText}&rdquo;
          </p>
          {couple.openingQuoteTitle && (
            <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#8C7851] uppercase">
              &mdash; {couple.openingQuoteTitle} &mdash;
            </p>
          )}
        </div>
      )}

      {/* Subtle Scroll Down Prompt */}
      <div className="flex flex-col items-center pt-1 text-[#8A7968]/75 animate-bounce select-none relative z-10">
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em]">
          Scroll ke bawah
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
      </div>
    </div>
  )
}

export default OpeningLayer

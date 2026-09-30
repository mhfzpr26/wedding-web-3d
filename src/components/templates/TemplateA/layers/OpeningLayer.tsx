'use client'

import React from 'react'
import type { CoupleWithDetails, Guest } from '@/types'
import { Sparkles, ChevronDown } from 'lucide-react'

interface OpeningLayerProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}

export const OpeningLayer: React.FC<OpeningLayerProps> = ({ couple, guest }) => {
  return (
    <div className="w-full p-2.5 sm:p-4 text-center select-text relative flex flex-col items-center">

      {/* Top Royal Decree Badge */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E2D9CE] text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7851] shadow-sm select-none mb-2">
        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
        <span>Walimatul &apos;Ursy</span>
      </div>

      {/* 1. Salam */}
      <div className="mb-2">
        <p className="text-[11px] sm:text-xs font-serif italic text-[#8A7968] tracking-wide">
          Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
        </p>
      </div>

      {/* 2. Sapaan */}
      <div className="w-full max-w-xs sm:max-w-sm px-2 space-y-1 mb-2.5">
        <p className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.22em] text-[#8C7851]">
          Kepada Yth. Bapak/Ibu/Saudara/i
        </p>
        <p className="text-sm sm:text-base font-serif font-bold text-[#1B2A4A] tracking-tight">
          {guest?.name || 'Tamu Undangan'}
        </p>
        <p className="text-[10px] sm:text-[11px] text-[#4A5568] leading-relaxed">
          Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu kepada kedua mempelai.
        </p>
      </div>

      {/* 3. Pembatas 1 */}
      <div className="flex items-center justify-center space-x-2 my-1 opacity-60 select-none">
        <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#D4AF37]" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37] bg-[#FAF6EE]" />
        <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#D4AF37]" />
      </div>

      {/* 4. Bismillah */}
      <div className="my-1.5 w-full max-w-xs sm:max-w-sm px-2" dir="rtl">
        <p className="font-serif text-sm sm:text-base text-[#8C7851] tracking-normal leading-relaxed text-center font-normal">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      {/* 5. Ayat (Arabic Text) */}
      <div className="w-full max-w-xs sm:max-w-sm px-2 my-1" dir="rtl">
        <p className="font-serif text-xs sm:text-sm text-[#1B2A4A] leading-relaxed text-center font-normal">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </p>
      </div>

      {/* 6. Pembatas 2 */}
      <div className="flex items-center justify-center space-x-2 my-1 opacity-60 select-none">
        <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
        <div className="w-1 h-1 rotate-45 bg-[#D4AF37]" />
        <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
      </div>

      {/* 7. Arti */}
      {couple.openingQuoteText && (
        <div className="w-full max-w-xs sm:max-w-sm px-2 space-y-1 mb-2">
          <p className="text-[10px] sm:text-[11px] font-serif italic text-[#4A5568] leading-relaxed">
            &ldquo;{couple.openingQuoteText}&rdquo;
          </p>
          {couple.openingQuoteTitle && (
            <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#8C7851] uppercase">
              &mdash; {couple.openingQuoteTitle} &mdash;
            </p>
          )}
        </div>
      )}

      {/* Subtle Scroll Down Prompt */}
      <div className="flex flex-col items-center pt-1 text-[#8A7968]/75 animate-bounce select-none">
        <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em]">Scroll ke bawah</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
      </div>
    </div>
  )
}

export default OpeningLayer

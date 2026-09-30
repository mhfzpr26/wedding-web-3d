'use client'

import React, { useState, useEffect } from 'react'
import type { CoupleWithDetails, Wish } from '@/types'
import { Sparkles, MessageSquareQuote, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface WishesClosingLayerProps {
  couple: CoupleWithDetails
}

export const WishesClosingLayer: React.FC<WishesClosingLayerProps> = ({ couple }) => {
  const wishes: Wish[] = couple.wishes || []
  const [currentWishIndex, setCurrentWishIndex] = useState(0)

  // Auto-rotate wishes every 4.5 seconds if there are wishes
  useEffect(() => {
    if (wishes.length <= 1) return
    const interval = setInterval(() => {
      setCurrentWishIndex((prev) => (prev + 1) % wishes.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [wishes.length])

  const activeWish = wishes[currentWishIndex]

  return (
    <div className="w-full p-3 sm:p-5 text-center select-text relative">
      {/* Header Tag */}
      <div className="flex items-center justify-between mb-2 select-none">
        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#8C7851] uppercase bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E2D9CE]/80 shadow-sm inline-flex items-center space-x-1">
          <BookOpen className="w-3 h-3 text-[#D4AF37]" />
          <span>Guestbook &amp; Blessing</span>
        </span>
        <div className="flex items-center space-x-1 text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-0.5 mb-2.5">
        <h2 className="text-xl sm:text-2xl font-serif text-[#1B2A4A]">Doa &amp; Terima Kasih</h2>
        <p className="text-[10px] sm:text-[11px] text-[#8A7968]">
          Untaian doa restu dari keluarga dan para sahabat tercinta
        </p>
      </div>

      {/* Wishes Carousel (Direct on 3D Tablet) */}
      <div className="py-2 px-1 text-left min-h-[80px] flex flex-col justify-between mb-2 border-b border-[#D4AF37]/35">
        <div className="flex items-center justify-between pb-1 mb-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#8C7851]">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-serif font-bold text-[#1B2A4A] truncate max-w-[170px]">
              {activeWish?.senderName || 'Keluarga & Sahabat'}
            </span>
          </div>
          {activeWish?.createdAt && (
            <span className="text-[10px] font-mono text-[#8A7968]">
              {formatDate(activeWish.createdAt, { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        <p className="font-serif italic text-xs text-[#4A5568] leading-relaxed line-clamp-2">
          &ldquo;{activeWish?.message || 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin yaa Rabbal aalamin.'}&rdquo;
        </p>

        {/* Carousel Dots & Controls */}
        {wishes.length > 1 && (
          <div className="flex items-center justify-between pt-1 border-t border-[#D4AF37]/20 mt-1">
            <span className="text-[9px] font-mono text-[#8A7968]">
              {currentWishIndex + 1} / {wishes.length} Doa
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setCurrentWishIndex((prev) => (prev - 1 + wishes.length) % wishes.length)}
                className="p-1 rounded-full text-[#8C7851] hover:bg-[#FAF8F5]/80 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentWishIndex((prev) => (prev + 1) % wishes.length)}
                className="p-1 rounded-full text-[#8C7851] hover:bg-[#FAF8F5]/80 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Closing Statement */}
      <div className="py-1 px-1 space-y-1 text-center">
        <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-2">
          {couple.closingMessage ||
            'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.'}
        </p>
        <p className="text-[11px] font-serif italic text-[#8A7968]">
          Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
        </p>
        <p className="font-serif font-bold text-xs text-[#1B2A4A] pt-0.5">
          {couple.groomName.split(',')[0]} &amp; {couple.brideName.split(',')[0]}
        </p>
      </div>
    </div>
  )
}

export default WishesClosingLayer

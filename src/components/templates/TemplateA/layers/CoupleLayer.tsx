'use client'

import React from 'react'
import type { CoupleWithDetails } from '@/types'

const InstagramIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
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

interface CoupleLayerProps {
  couple: CoupleWithDetails
}

export const CoupleLayer: React.FC<CoupleLayerProps> = ({ couple }) => {
  return (
    <div className="w-full p-2 sm:p-4 text-center select-text relative">
      {/* Title & Subtitle */}
      <div className="space-y-1 mb-2">
        <h2 className="text-2xl sm:text-[28px] md:text-3xl font-serif text-[#1B2A4A] tracking-wide">
          Kedua Mempelai
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#8A7968]">
          Dua hati yang dipersatukan dalam ikatan suci pernikahan
        </p>
      </div>

      {/* Reserved 3D Cameo Viewport Window (Allows the 3D ExtrudeGeometry photo medallions to float freely) */}
      <div className="w-full h-28 sm:h-32 md:h-36 pointer-events-none" aria-hidden="true" />

      {/* Grid: Groom & Bride Profile Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-1">
        {/* The Groom Card */}
        <div className="flex flex-col items-center justify-between text-center p-2.5 sm:p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E2D9CE]/90 shadow-sm transition-transform hover:scale-[1.01]">
          <div>
            <span className="text-[10px] sm:text-xs md:text-xs font-mono uppercase tracking-widest text-[#8C7851] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E2D9CE]">
              Mempelai Pria
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#1B2A4A] mt-1.5 line-clamp-1">
              {couple.groomName.split(',')[0]}
            </h3>
            {couple.groomParents && (
              <p className="text-xs sm:text-[13px] md:text-sm text-[#4A5568] mt-1 line-clamp-2 leading-tight">
                Putra dari {couple.groomParents}
              </p>
            )}
          </div>

          {couple.groomInstagram && (
            <a
              href={`https://instagram.com/${couple.groomInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs sm:text-[13px] md:text-sm font-mono text-[#8C7851] hover:underline mt-2.5 pt-1.5 border-t border-[#E2D9CE]/70 w-full justify-center"
            >
              <InstagramIcon className="w-3 h-3" />
              <span>@{couple.groomInstagram}</span>
            </a>
          )}
        </div>

        {/* The Bride Card */}
        <div className="flex flex-col items-center justify-between text-center p-2.5 sm:p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E2D9CE]/90 shadow-sm transition-transform hover:scale-[1.01]">
          <div>
            <span className="text-[10px] sm:text-xs md:text-xs font-mono uppercase tracking-widest text-[#8C7851] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E2D9CE]">
              Mempelai Wanita
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#1B2A4A] mt-1.5 line-clamp-1">
              {couple.brideName.split(',')[0]}
            </h3>
            {couple.brideParents && (
              <p className="text-xs sm:text-[13px] md:text-sm text-[#4A5568] mt-1 line-clamp-2 leading-tight">
                Putri dari {couple.brideParents}
              </p>
            )}
          </div>

          {couple.brideInstagram && (
            <a
              href={`https://instagram.com/${couple.brideInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs sm:text-[13px] md:text-sm font-mono text-[#8C7851] hover:underline mt-2.5 pt-1.5 border-t border-[#E2D9CE]/70 w-full justify-center"
            >
              <InstagramIcon className="w-3 h-3" />
              <span>@{couple.brideInstagram}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoupleLayer

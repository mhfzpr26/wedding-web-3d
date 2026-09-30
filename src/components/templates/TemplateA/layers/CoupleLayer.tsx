'use client'

import Image from 'next/image'
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
  const groomInitial = couple.groomName ? couple.groomName.charAt(0) : 'B'
  const brideInitial = couple.brideName ? couple.brideName.charAt(0) : 'A'

  return (
    <div className="w-full p-3 sm:p-5 text-center select-text relative">
      <div className="space-y-0.5 mb-3">
        <h2 className="text-2xl sm:text-[26px] font-serif text-[#1B2A4A]">Kedua Mempelai</h2>
        <p className="text-xs sm:text-[13px] text-[#8A7968]">
          Dua hati yang dipersatukan dalam ikatan suci pernikahan
        </p>
      </div>

      {/* Grid: Groom & Bride Cameo Medallions */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
        {/* The Groom Cameo */}
        <div className="flex flex-col items-center justify-between text-center px-1">
          {/* Cameo Oval Frame */}
          {couple.groomPhotoUrl ? (
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-[36px] overflow-hidden border-2 border-white ring-2 ring-[#D4AF37]/65 shadow-md mb-2">
              <Image
                src={couple.groomPhotoUrl}
                alt={couple.groomName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-[36px] bg-gradient-to-b from-[#1B2A4A] to-[#142036] border-2 border-white ring-2 ring-[#D4AF37]/65 flex flex-col items-center justify-center text-white mb-2 shadow-md">
              <span className="font-serif text-2xl text-[#E8C872]">{groomInitial}</span>
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37]/80 uppercase">
                Groom
              </span>
            </div>
          )}

          <div>
            <span className="text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-widest text-[#8C7851] bg-[#FAF8F5]/90 px-2 py-0.5 rounded-full border border-[#E2D9CE]">
              Mempelai Pria
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#1B2A4A] mt-1 line-clamp-1">
              {couple.groomName.split(',')[0]}
            </h3>
            {couple.groomParents && (
              <p className="text-[11px] sm:text-xs text-[#4A5568] mt-1 line-clamp-2 leading-tight">
                Putra dari {couple.groomParents}
              </p>
            )}
          </div>

          {couple.groomInstagram && (
            <a
              href={`https://instagram.com/${couple.groomInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-[11px] sm:text-xs font-mono text-[#8C7851] hover:underline mt-2 pt-1 border-t border-[#E2D9CE]/60 w-full justify-center"
            >
              <InstagramIcon className="w-2.5 h-2.5" />
              <span>@{couple.groomInstagram}</span>
            </a>
          )}
        </div>

        {/* The Bride Cameo */}
        <div className="flex flex-col items-center justify-between text-center px-1">
          {/* Cameo Oval Frame */}
          {couple.bridePhotoUrl ? (
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-[36px] overflow-hidden border-2 border-white ring-2 ring-[#D4AF37]/65 shadow-md mb-2">
              <Image
                src={couple.bridePhotoUrl}
                alt={couple.brideName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-[36px] bg-gradient-to-b from-[#1B2A4A] to-[#142036] border-2 border-white ring-2 ring-[#D4AF37]/65 flex flex-col items-center justify-center text-white mb-2 shadow-md">
              <span className="font-serif text-2xl text-[#E8C872]">{brideInitial}</span>
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37]/80 uppercase">
                Bride
              </span>
            </div>
          )}

          <div>
            <span className="text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-widest text-[#8C7851] bg-[#FAF8F5]/90 px-2 py-0.5 rounded-full border border-[#E2D9CE]">
              Mempelai Wanita
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#1B2A4A] mt-1 line-clamp-1">
              {couple.brideName.split(',')[0]}
            </h3>
            {couple.brideParents && (
              <p className="text-[11px] sm:text-xs text-[#4A5568] mt-1 line-clamp-2 leading-tight">
                Putri dari {couple.brideParents}
              </p>
            )}
          </div>

          {couple.brideInstagram && (
            <a
              href={`https://instagram.com/${couple.brideInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-[11px] sm:text-xs font-mono text-[#8C7851] hover:underline mt-2 pt-1 border-t border-[#E2D9CE]/60 w-full justify-center"
            >
              <InstagramIcon className="w-2.5 h-2.5" />
              <span>@{couple.brideInstagram}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoupleLayer

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import type { CoupleWithDetails, Guest } from '@/types'

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

interface UnionPanelProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}

export const UnionPanel: React.FC<UnionPanelProps> = ({ couple, guest }) => {
  const groomInitial = couple.groomName ? couple.groomName.charAt(0) : 'B'
  const brideInitial = couple.brideName ? couple.brideName.charAt(0) : 'A'

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-y-auto overscroll-contain select-none scrollbar-none">
      {/* 1. Masthead */}
      <div className="border-b border-neutral-900 pb-3 flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-950">
          INDEX // 01 &bull; THE UNION
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">
          VOL. 2026 // FOLIO
        </span>
      </div>

      {/* 2. Hero Section: Massive Editorial Typography & Photo */}
      <div className="my-auto py-6 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 block mb-2">
            CONTEMPORARY MATRIMONY
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight text-neutral-950 uppercase leading-none">
            {couple.groomName.split(',')[0]}
            <span className="block font-serif italic text-2xl sm:text-4xl font-normal lowercase my-1 text-neutral-600">
              &amp;
            </span>
            {couple.brideName.split(',')[0]}
          </h1>
        </div>

        {/* Editorial Photo Frame or Monogram Typographic Folio */}
        <div className="w-full">
          {couple.coverPhotoUrl ? (
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] border border-neutral-950 overflow-hidden shadow-sm bg-neutral-100">
              <Image
                src={couple.coverPhotoUrl}
                alt={`${couple.groomName} & ${couple.brideName}`}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                priority
                unoptimized
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-neutral-950 text-white font-mono text-[9px] uppercase tracking-widest">
                FIG. 01 &bull; THE UNION PORTRAIT
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[4/3] sm:aspect-[16/9] border-2 border-neutral-950 p-6 flex flex-col justify-between bg-neutral-100">
              <div className="flex justify-between items-start font-mono text-[10px] text-neutral-500 uppercase">
                <span>ARCHIVE FOLIO</span>
                <span>EST. 2026</span>
              </div>
              <div className="text-center py-4">
                <span className="font-serif text-5xl sm:text-7xl tracking-tighter font-light text-neutral-950">
                  {groomInitial} &amp; {brideInitial}
                </span>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-600 mt-2">
                  MATRIMONIAL UNION
                </p>
              </div>
              <div className="font-mono text-[9px] text-neutral-400 text-right">FOLIO // 01</div>
            </div>
          )}
        </div>

        {/* Couple Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Groom Block */}
          <div className="border border-neutral-900/15 p-4 bg-white">
            <span className="font-mono text-[9px] uppercase tracking-widest bg-neutral-950 text-white px-2 py-0.5 inline-block mb-2">
              THE GROOM
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-light text-neutral-950">
              {couple.groomName}
            </h3>
            {couple.groomParents && (
              <p className="font-sans text-xs text-neutral-600 mt-1 leading-relaxed">
                Putra dari {couple.groomParents}
              </p>
            )}
            {couple.groomInstagram && (
              <a
                href={`https://instagram.com/${couple.groomInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 font-mono text-xs text-neutral-900 hover:underline mt-2"
              >
                <InstagramIcon className="w-3 h-3" />
                <span>@{couple.groomInstagram}</span>
              </a>
            )}
          </div>

          {/* Bride Block */}
          <div className="border border-neutral-900/15 p-4 bg-white">
            <span className="font-mono text-[9px] uppercase tracking-widest bg-neutral-950 text-white px-2 py-0.5 inline-block mb-2">
              THE BRIDE
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-light text-neutral-950">
              {couple.brideName}
            </h3>
            {couple.brideParents && (
              <p className="font-sans text-xs text-neutral-600 mt-1 leading-relaxed">
                Putri dari {couple.brideParents}
              </p>
            )}
            {couple.brideInstagram && (
              <a
                href={`https://instagram.com/${couple.brideInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 font-mono text-xs text-neutral-900 hover:underline mt-2"
              >
                <InstagramIcon className="w-3 h-3" />
                <span>@{couple.brideInstagram}</span>
              </a>
            )}
          </div>
        </div>

        {/* Holy Verse / Quote */}
        {couple.openingQuoteText && (
          <div className="border-l-2 border-neutral-950 pl-4 py-2 space-y-1">
            <blockquote className="font-serif text-sm sm:text-base italic text-neutral-800 leading-relaxed font-light">
              &ldquo;{couple.openingQuoteText}&rdquo;
            </blockquote>
            {couple.openingQuoteTitle && (
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 font-semibold">
                &mdash; {couple.openingQuoteTitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. Bottom Guest Recipient Box */}
      {guest && (
        <div className="border-t border-neutral-900/15 pt-3 flex items-center justify-between shrink-0">
          <div className="border-l-2 border-neutral-950 pl-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
              CORDIALLY INVITED:
            </p>
            <p className="font-serif text-base font-normal text-neutral-950">{guest.name}</p>
          </div>
          <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
            SWIPE &rarr;
          </span>
        </div>
      )}
    </div>
  )
}

export default UnionPanel

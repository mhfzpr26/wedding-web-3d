'use client'

import Image from 'next/image'
import React from 'react'
import { RsvpForm } from '@/components/shared/RsvpForm'
import { WishesFeed } from '@/components/shared/WishesFeed'
import type { CoupleWithDetails, Guest } from '@/types'

interface RsvpWordsPanelProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}

export const RsvpWordsPanel: React.FC<RsvpWordsPanelProps> = ({ couple, guest }) => {
  const groomShort = couple.groomName.split(',')[0].toUpperCase()
  const brideShort = couple.brideName.split(',')[0].toUpperCase()

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-y-auto overscroll-contain select-none scrollbar-none">
      {/* 1. Masthead */}
      <div className="border-b border-neutral-900 pb-3 flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-950">
          INDEX // 04 &bull; RSVP &amp; WORDS
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">
          FINAL CHAPTER
        </span>
      </div>

      {/* 2. Main Content Grid */}
      <div className="my-auto py-6 space-y-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 block mb-1">
            CONFIRMATION &amp; GUESTBOOK
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-light tracking-tight text-neutral-950 uppercase">
            Attendance &amp; Wishes
          </h2>
          <p className="font-sans text-xs text-neutral-600 mt-1 max-w-lg leading-relaxed">
            Please confirm your attendance and leave your heartfelt blessings for our new journey
            together:
          </p>
        </div>

        {/* Two Columns Layout on Desktop / Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: RSVP Form */}
          <div className="border border-neutral-950 p-5 bg-white space-y-4 shadow-xs">
            <div className="border-b border-neutral-200 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">
                SECTION A
              </span>
              <h3 className="font-serif text-lg font-light text-neutral-950 uppercase">
                RSVP Confirmation
              </h3>
            </div>
            <RsvpForm coupleId={couple.id} guest={guest} slug={couple.slug} />
          </div>

          {/* Right Column: Wishes Feed in Isolated Vertical Scroll Container */}
          <div className="border border-neutral-950 p-5 bg-white space-y-4 shadow-xs">
            <div className="border-b border-neutral-200 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">
                SECTION B
              </span>
              <h3 className="font-serif text-lg font-light text-neutral-950 uppercase">
                Words of Blessing
              </h3>
            </div>

            {/* Isolated vertical scroll area */}
            <div className="max-h-[380px] sm:max-h-[440px] overflow-y-auto overscroll-contain touch-pan-y pr-1">
              <WishesFeed
                initialWishes={couple.wishes}
                guest={guest}
                coupleId={couple.id}
                slug={couple.slug}
              />
            </div>
          </div>
        </div>

        {/* 3. Epilogue & Family Gratitude */}
        <div className="pt-6 border-t-2 border-neutral-950 space-y-4">
          <div className="flex justify-between items-baseline font-mono text-[10px] uppercase text-neutral-500">
            <span>EPILOGUE</span>
            <span>END OF FOLIO</span>
          </div>

          {couple.closingPhotoUrl && (
            <div className="relative aspect-[16/9] w-full max-w-md border border-neutral-950 overflow-hidden bg-neutral-100">
              <Image
                src={couple.closingPhotoUrl}
                alt="Closing Portrait"
                fill
                className="object-cover grayscale"
                unoptimized
              />
            </div>
          )}

          <p className="font-serif text-sm italic text-neutral-800 leading-relaxed max-w-xl">
            {couple.closingMessage ||
              'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.'}
          </p>

          <div className="pt-3 border-t border-neutral-200">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500">
              WITH UTMOST GRATITUDE:
            </p>
            <p className="font-serif text-2xl font-light text-neutral-950 mt-0.5 uppercase">
              {groomShort} &amp; {brideShort}
            </p>
            <p className="font-mono text-[10px] uppercase text-neutral-500 mt-0.5">
              AND THE BLESSED FAMILIES
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Guide */}
      <div className="border-t border-neutral-900/15 pt-3 flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
          &larr; REGISTRY
        </span>
        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
          COMPLETED // END OF RUNWAY
        </span>
      </div>
    </div>
  )
}

export default RsvpWordsPanel

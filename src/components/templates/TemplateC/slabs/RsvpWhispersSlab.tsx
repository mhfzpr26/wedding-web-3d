'use client'

import { Heart, Sparkles } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { RsvpForm } from '@/components/shared/RsvpForm'
import { WishesFeed } from '@/components/shared/WishesFeed'
import type { CoupleWithDetails, Guest } from '@/types'

interface RsvpWhispersSlabProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}

export const RsvpWhispersSlab: React.FC<RsvpWhispersSlabProps> = ({ couple, guest }) => {
  const groomShort = couple.groomName.split(',')[0]
  const brideShort = couple.brideName.split(',')[0]

  return (
    <div className="w-full rounded-3xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden select-none">
      {/* Ambient Glare */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-bl from-teal-200/30 via-emerald-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Slab Indicator Tag */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <span className="text-[10px] font-mono tracking-widest text-teal-800 uppercase backdrop-blur-md bg-white/60 px-3 py-1 rounded-full border border-white/70 shadow-2xs">
          Slab 04 &bull; RSVP &amp; Whispers
        </span>
        <div className="flex items-center space-x-1 text-teal-600">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center relative z-10 space-y-1 mt-2 mb-6">
        <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-teal-800 backdrop-blur-md bg-white/60 px-3 py-0.5 rounded-full border border-white/70">
          Konfirmasi Kehadiran
        </span>
        <h2 className="text-2xl font-serif text-slate-900">Buku Tamu &amp; Doa</h2>
        <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
          Mohon konfirmasikan kehadiran dan tinggalkan doa tulus Anda untuk mengiringi babak baru
          kami:
        </p>
      </div>

      {/* 1. RSVP Form */}
      <div className="relative z-10 mb-8 p-5 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 shadow-xs">
        <RsvpForm coupleId={couple.id} guest={guest} slug={couple.slug} />
      </div>

      {/* 2. Wishes Feed with Protected Internal Vertical Scroll */}
      <div className="relative z-10 mb-8 p-5 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 shadow-xs">
        <div className="text-center mb-4">
          <h3 className="font-serif text-lg font-semibold text-slate-900">
            Untaian Doa &amp; Harapan
          </h3>
          <p className="text-[11px] text-slate-500">
            Pesan hangat dari keluarga, kerabat, dan sahabat
          </p>
        </div>

        {/* Protected internal vertical scroll */}
        <div className="max-h-[360px] sm:max-h-[420px] overflow-y-auto overscroll-contain touch-pan-y pr-1">
          <WishesFeed
            initialWishes={couple.wishes}
            guest={guest}
            coupleId={couple.id}
            slug={couple.slug}
          />
        </div>
      </div>

      {/* 3. Epilogue & Family Gratitude */}
      <div className="relative z-10 pt-6 border-t border-slate-200/60 text-center space-y-4">
        {couple.closingPhotoUrl ? (
          <div className="relative w-48 h-64 mx-auto rounded-2xl overflow-hidden backdrop-blur-md bg-white/50 border-2 border-white shadow-md p-1.5">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src={couple.closingPhotoUrl}
                alt="Closing Portrait"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 py-2">
            <div className="w-10 h-0.5 bg-teal-200 rounded-full" />
            <div className="w-7 h-7 rounded-full backdrop-blur-md bg-white/80 border border-white flex items-center justify-center text-teal-700 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-teal-600/20 text-teal-700" />
            </div>
            <div className="w-10 h-0.5 bg-teal-200 rounded-full" />
          </div>
        )}

        <div className="max-w-xs mx-auto space-y-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            {couple.closingMessage ||
              'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.'}
          </p>
          <p className="text-xs font-serif italic text-slate-700">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
        </div>

        <div className="pt-3 border-t border-slate-200/50">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Salam Hangat Dari Kami,
          </p>
          <p className="font-serif text-xl font-medium text-slate-900 mt-0.5">
            {groomShort} &amp; {brideShort}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Beserta Seluruh Keluarga Besar</p>
        </div>
      </div>
    </div>
  )
}

export default RsvpWhispersSlab

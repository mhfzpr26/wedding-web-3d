'use client'

import React from 'react'
import type { CoupleWithDetails, Guest } from '@/types'
import { Sparkles, Mail } from 'lucide-react'
import { RsvpForm } from '@/components/shared/RsvpForm'

interface RsvpLayerProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}

export const RsvpLayer: React.FC<RsvpLayerProps> = ({ couple, guest }) => {
  return (
    <div className="w-full p-3 sm:p-5 text-center select-text relative">

      {/* Header Tag */}
      <div className="flex items-center justify-between mb-2 select-none">
        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#8C7851] uppercase bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E2D9CE]/80 shadow-sm inline-flex items-center space-x-1">
          <Mail className="w-3 h-3 text-[#D4AF37]" />
          <span>RSVP Postcard</span>
        </span>
        <div className="flex items-center space-x-1 text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-0.5 mb-2.5">
        <h2 className="text-xl sm:text-2xl font-serif text-[#1B2A4A]">Konfirmasi Kehadiran</h2>
        <p className="text-[10px] sm:text-[11px] text-[#8A7968]">
          Mohon konfirmasikan kehadiran Anda untuk kemudahan pengaturan tempat
        </p>
      </div>

      {/* Compact RSVP Form Container */}
      <div className="w-full max-w-xs sm:max-w-sm mx-auto text-left">
        <RsvpForm
          coupleId={couple.id}
          guest={guest}
          slug={couple.slug}
          variant="clean"
          className="p-0 text-left"
        />
      </div>
    </div>
  )
}

export default RsvpLayer
